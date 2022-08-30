const { Service } = require("feathers-mongoose");

exports.UserNotification = class UserNotification extends Service {
  setup(app) {
    this.app = app;
  }

  async create(data, params) {
    try {
      const { room, sender, owner } = data;

      const usersInRoom =
        sender === owner
          ? [{ user_id: sender }]
          : (
              await this.app
                .service("user-room")
                .Model.find({ room })
                .select("user_id")
            ).filter((room) => room.user_id.toString() !== sender);

      await this.Model.insertMany(
        [...new Set(usersInRoom.map((user) => user.user_id.toString()))].map(
          (user_id) => ({
            owner: user_id,
            ...data,
          })
        )
      );

      return { ...data };
    } catch (error) {
      return new Error(error);
    }
  }

  async find(params) {
    try {
      const { contract_status, owner, type, total_unRead, $limit, $skip } =
        params.query;

      if (total_unRead) {
        return {
          total_unRead:
            (await this.Model.find({
              owner,
              read: false,
            }).countDocuments()) || 0,
        };
      }

      if (contract_status && type) {
        const contractsByStatus = await this.app
          .service("assignment-contract")
          .Model.find({ status: contract_status })
          .select("_id")
          .sort({
            createdAt: -1,
          })
          .limit($limit)
          .skip($skip);

        const contractIds = contractsByStatus.map((contract) =>
          contract._id.toString()
        );

        console.log(contractIds);

        return super.find({
          ...params,
          query: {
            contract: { $in: contractIds },
            ...params.query,
          },
        });
      }

      return super.find(params);
    } catch (error) {
      console.log(error);
      return new Error(error);
    }
  }

  async patch(id, data, params) {
    try {
      const { patch_type = "one", owner } = params.query;
      if (patch_type === "all") {
        return await this.Model.updateMany({ owner }, data);
      }
      return await this.Model.findByIdAndUpdate(id, data);
    } catch (error) {
      return new Error(error);
    }
  }
};
