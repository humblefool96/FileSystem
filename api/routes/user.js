const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

// register endpoint
router.post('/register', (req, res, next) => {
  User.find({ username: req.body.username })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "username already exist"
        })
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              name: req.body.name,
              username: req.body.username,
              password: hash,
            });
            user.save().then(result => {
              console.log(result);
              res.status(200).json({
                name: result.name,
                username: result.username,
              })
                .catch(err => {
                  console.log(err);
                  res.status(500).json({
                    error: err
                  });
                })
            })
          }
        });
      }
    })
});

// login endpoint
router.post('/login', (req, res, next) => {
  User.find({ username: req.body.username })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(404).json({
          message: "Auth Failed!"
        })
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(404).json({
            message: "Auth Failed!"
          })
        }
        if (result) {
          const token = jwt.sign({
            username: user[0].username,
            userId: user[0]._id
          },
            "secretKey",
            {
              expiresIn: "1h"
            },
          )
          return res.status(200).json({
            name: user[0].name,
            username: user[0].username,
            message: "Authentication Successful",
            token: token
          })
        }
      })
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      })
    })
});

module.exports = router;