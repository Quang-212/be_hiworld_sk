const { isEmpty } = require("lodash");

module.exports = function (app) {
  if (typeof app.channel !== "function") {
    // If no real-time functionality has been configured just return
    return;
  }

  app.on("connection", (connection) => {
    app.channel("anonymous").join(connection);
  });

  app.on("login", async (authResult, { connection }) => {
    if (connection) {
      // Obtain the logged in user from the connection
      const user = connection.user;
      // The connection is no longer anonymous, remove it
      app.channel("anonymous").leave(connection);

      // Add it to the authenticated user channel
      app.channel("authenticated").join(connection);
      app.channel(`user:${user._id.toString()}`).join(connection);
      console.log(app.channel(`authenticated`).length, "authenticated");
      const userRooms = await app
        .service("user-room")
        .Model.find({ user_id: user._id.toString() });
      userRooms.forEach(({ room }) => {
        app.channel(room).join(connection);
      });
    }
  });

  app.service("contract-report").publish((data) => app.channel(data.room));

  app.service("user-notification").on("created", (data, context) => {
    app.channel(data.room).join(context.params.connection);
  });

  app.service("user-notification").publish((data) => app.channel(data.room));

  app.service("join-room").on("created", (joinRequest, context) => {
    // const joined = app
    //   .channel(joinRequest.room)
    //   .connections.find(
    //     (connection) =>
    //       connection.user._id === context.params.connection.user._id
    //   );
    // !joined && app.channel(joinRequest.room).join(context.params.connection);
    app.channel(joinRequest.room).join(context.params.connection);
  });

  app.service("join-room").on("removed", (leaveRequest, context) => {
    app.channel(leaveRequest.room).leave(context.params.connection);
  });

  app.service("join-room").publish((data) => app.channel(data.room));

  app.service("calling").publish((data) => {
    return app.channel(data.room);
  });

  app.service("assignment-chat").publish((data) => {
    return app.channel(data.room);
  });

  app.service("assignment-contract").publish((data) => {
    return app.channel(`assignment-contract:${data._id}`);
  });

  app.service("chat-typing").publish((data) => {
    return app.channel(data.room);
  });

  app.service("assignment-submit").publish("patched", (data) => {
    return data.contract_id
      ? app.channel(`assignment-contract:${data.contract_id}`)
      : app.channel(`assignment:${data._id.toString()}`);
  });

  app.service("assignment-comment").on("created", async (data, context) => {
    return app
      .channel(`assignment-comment:${data._id.toString()}`)
      .join(context.params.connection);
  });

  app.service("assignment-comment").publish("created", async (data) => {
    return app.channel("authenticated").send({
      ...data,
      user: await app.service("users").get(data.user),
    });
  });

  // app.service("course-feedback").on("created", (data, context) => {
  //   app
  //     .channel(`course-feedback/${data._id.toString()}`)
  //     .join(context.params.connection);
  // });

  // app.service("course-feedback").publish("created", async (data) => {
  //   return app.channel("authenticated").send({
  //     ...data,
  //     userId: await app.service("users").get(data.userId),
  //   });
  // });

  app.on("logout", ({ connection }) => {
    if (connection) {
      app.channel("anonymous").join(connection);
    }
  });

  app.on("disconnect", async (connection) => {
    const now = new Date().getTime();
    connection &&
      (await app.service("users").Model.findByIdAndUpdate(connection.user._id, {
        last_login: now,
      }));
  });

  app.publish(() => {
    return app.channel("authenticated");
  });
};
