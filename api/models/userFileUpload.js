const mongoose = require('mongoose');

const fileUploadSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  username: { type: String, required: true },
  file: [{
    _id: mongoose.Schema.Types.ObjectId,
    filename: { type: String, required: true, unique: false },
    url: { type: String, required: true, unique: true }
  }]
})

module.exports = mongoose.model('Files', fileUploadSchema);