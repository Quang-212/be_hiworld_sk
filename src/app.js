const path = require("path");
const favicon = require("serve-favicon");
const compress = require("compression");
const helmet = require("helmet");
const cors = require("cors");
const logger = require("./logger");
require("dotenv").config();

const feathers = require("@feathersjs/feathers");
const configuration = require("@feathersjs/configuration");
const express = require("@feathersjs/express");
const socketio = require("@feathersjs/socketio");

const middleware = require("./middleware");
const services = require("./services");
const appHooks = require("./app.hooks");
const channels = require("./channels");

const authentication = require("./authentication");

const mongoose = require("./mongoose");

const app = express(feathers());

// Load app configuration
app.configure(configuration());
// Enable security, CORS, compression, favicon and body parsing
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(
  cors({
    origin: [
      "http://localhost:3039",
      "http://localhost:3034",
      "http://34.87.93.1:3060",
      process.env.SECRET_FRONTEND_DOMAIN,
    ],
    allowedHeaders: [
      "Content-Type",
      "Origin",
      "X-Requested-With",
      "Accept",
      "Authorization",
    ],
    credentials: true,
  })
);
app.use(compress());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(favicon(path.join(app.get("public"), "favicon.ico")));
// Host the public folder
app.use("/", express.static(app.get("public")));

// Set up Plugins and providers
app.configure(express.rest());
app.configure(
  socketio(function (io) {
    io.on("connection", function (socket) {
      //join-leave room by event from client
      socket.on("join-room", ({ room }) => {
        app.channel(room).join(socket.feathers);
      });
      socket.on("leave-room", ({ room }) => {
        app.channel(room).leave(socket.feathers);
      });
    });
    // Registering Socket.io middleware
    io.use(function (socket, next) {
      // Exposing a request property to services and hooks
      socket.feathers.referrer = socket.request.referrer;
      next();
    });
  })
);
app.configure(mongoose);
// app.configure((app) => {
//   app.mixins.push(function (service) {
//     // service.findOne = function (params) {
//     //   params = params || {}
//     //   params.query = params.query || {}
//     //   params.query.$limit = 1
//     //   return service.find(params).then(function (result) {
//     //     var data = result.data || result
//     //     return Array.isArray(data) ? data[0] : data
//     //   })
//     // }
//     service.find = async function (params) {
//       params = params || {};
//       params.query = params.query || {};
//       if (params.query.$limit === 1) {
//         return service.find(params).then(function (result) {
//           var data = result.data || result;
//           return Array.isArray(data) ? data[0] : data;
//         });
//       }
//       return service.find(params).then(function (result) {
//         return result;
//       });
//     };
//   });
// });

// Configure other middleware (see `middleware/index.js`)
app.configure(middleware);
app.configure(authentication);
// Set up our services (see `services/index.js`)
app.configure(services);
// Set up event channels (see channels.js)
app.configure(channels);

// Configure a middleware for 404s and the error handler
app.use(express.notFound());
app.use(express.errorHandler({ logger }));

app.hooks(appHooks);

module.exports = app;
