const { Service } = require("feathers-mongoose");

exports.Notification = class Notification extends Service {
  setup(app) {
    this.app = app;
  }
  async create(data, params) {
    try {
      const _id = this.app.get("mongooseClient").Types.ObjectId();

      const { room, sender, owner } = data;

      const usersInRoom =
        sender === owner
          ? [{ user_id: sender }]
          : (
              await this.app
                .service("user-room")
                .Model.find({ room })
                .select("user_id -_id")
            ).filter((user) => user.user_id.toString() !== sender);

      const [generalNotice, userNotice] = await Promise.all([
        super.create({ ...data, _id }, params),
        this.app.service("user-notification").Model.insertMany(
          [...new Set(usersInRoom.map((user) => user.user_id.toString()))].map(
            (user_id) => ({
              owner: user_id,
              notification: _id,
              ...data,
            })
          )
        ),
      ]);

      return sender === owner
        ? { ...userNotice, notification: generalNotice }
        : { ...generalNotice, type: data.type };
    } catch (error) {
      console.log(error);
    }
  }
};
