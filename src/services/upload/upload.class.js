/* eslint-disable no-unused-vars */
const { unlink } = require("fs");
const cloudinary = require("../../middleware/cloudinary");

exports.Upload = class Upload {
  constructor(options) {
    this.options = options || {};
  }

  async create(data, params) {
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      params.file.path
    );
    unlink(params.file.path, (err) => {
      if (err) throw new Error(err);
    });
    return { url: secure_url, id: public_id };
  }

  async update(id, data, params) {
    return data;
  }

  async patch(id, data, params) {
    return data;
  }

  async remove(id, params) {
    return { id };
  }
};
