const multer = require('multer');
const express = require('express');
const router = express.Router();
const aws = require('aws-sdk');
const uuid = require('uuid').v4;
const mongoose = require('mongoose');
require('dotenv/config')

const User = require('../models/user');
const FileUpload = require('../models/userFileUpload');

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_SECRET
})

const storage = multer.memoryStorage({
  destination: function (req, file, callback) {
    callback(null, '');
  }
})

const upload = multer({ storage }).single('image');

router.post("/", upload, (req, res) => {
  let myFile = req.file.originalname.split(".");
  const fileType = myFile[myFile.length - 1];
  let username = req.body.username;
  console.log(username);
  User.find({ username: username })
    .exec()
    .then(curUser => {
      if (curUser.length < 1) {
        return res.status(404).json({
          message: "username does not exist"
        })
      } else {
        const params = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: `public_images/${uuid()}.${fileType}`,
          Body: req.file.buffer
        }

        s3.upload(params, (error, data) => {
          if (error) {
            console.log('not able to upload');
            res.status(500).send(error);
          } else {
            // write it in db
            const files = new FileUpload({
              _id: new mongoose.Types.ObjectId(),
              username: req.body.username,
              file: []
            });
            FileUpload.find({ username: username }).exec().then(user => {
              console.log(user);
              if (user.length >= 1) {
                files.file.push({
                  _id: new mongoose.Types.ObjectId(),
                  filename: data.key.split("/")[1],
                  url: data.Location
                });
              } else {
                files.file.unshift({
                  _id: new mongoose.Types.ObjectId(),
                  filename: data.key.split("/")[1],
                  url: data.Location
                });
              }
              files.save().then(result => {
                console.log(result);
                res.status(200).json({
                  username: result.username,
                  data: data
                })
                  .catch(err => {
                    console.log(err);
                    res.status(500).json({
                      error: err
                    });
                  })
              })
            })
            res.status(200).send(data)
          }
        })
      }
    })
})

module.exports = router;