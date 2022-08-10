const { Service } = require("feathers-mongoose");

exports.Notification = class Notification extends Service {
  setup(app) {
    this.app = app;
  }
  async create(data, params) {
    try {
      const _id = this.app.get("mongooseClient").Types.ObjectId();
      const { room } = data;
      const usersInRoom = await this.app
        .service("user-room")
        .Model.find({ room })
        .select("user_id -_id");
      const [response] = await Promise.all([
        super.create({ ...data, _id }, params),
        this.app.service("user-notification").Model.insertMany(
          usersInRoom.map((room) => ({
            user_id: room.user_id,
            notification_id: _id,
          }))
        ),
      ]);
      return response;
    } catch (error) {
      console.log(error);
    }
  }
};
