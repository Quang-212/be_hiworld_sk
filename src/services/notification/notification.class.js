const { Service } = require("feathers-mongoose");

exports.Notification = class Notification extends Service {
  setup(app) {
    this.app = app;
  }
  async create(data, params) {
    try {
      const _id = this.app.get("mongooseClient").Types.ObjectId();

      const { room, sender } = data;

      const usersInRoom = (
        await this.app
          .service("user-room")
          .Model.find({ room })
          .select("user_id -_id")
      ).filter((user) => user.user_id.toString() !== sender);

      const [response] = await Promise.all([
        super.create({ ...data, _id }, params),
        this.app.service("user-notification").Model.insertMany(
          [...new Set(usersInRoom.map((user) => user.user_id))].map(
            (user_id) => ({
              owner: user_id,
              notification: _id,
              ...data,
            })
          )
        ),
      ]);

      return { ...response, type: data.type };
    } catch (error) {
      console.log(error);
    }
  }
};
