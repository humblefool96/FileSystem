const express = require('express');
const router = express.Router();
require('dotenv/config')

const FileUpload = require('../models/userFileUpload');
const { db } = require('../models/userFileUpload');
// const { db } = require('../models/userFileUpload');

router.delete("/", async (req, res) => {
  let username = req.body.username;
  let filename = req.body.filename;
  console.log(username + " " + filename);
  const users_file = await FileUpload.find({ username: username });
  console.log(users_file.length);
  const deleted_files = users_file.filter(user => {
    if (user.file[0].filename === filename) return user;
  })
  console.log("id "+ deleted_files[0]._id);
  await FileUpload.findOneAndRemove({ _id: deleted_files[0]._id });
  // await deleted_user_file.remove();
  res.status(200).send(users_file);
})

module.exports = router;