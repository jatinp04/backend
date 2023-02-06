const express = require("express");
const db = require("./db.json");
const fs = require("fs");
const bodyParser = require("body-parser");
const async = require("async");
const userModel = require("./userModel");
// const maths = require("./maths");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const verify = require("./services/authService");

require("dotenv").config();

const MongoDB = require("./services/databaseService");
// const { mongo } = require("mongoose");
const notemodel = require("./notemodel");

const cors = require("cors");


const port = process.env.BACKEND_PORT; //Backend Port Running on 5001
const secretKey = process.env.JWT_SECRET;

const app = express();
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const corsOptions = {
  origin: true,
  credentials: true,
  exposedHeaders: ["set-cookie"],
};

app.use(cors(corsOptions));
app.use(cookieParser());

MongoDB.start(); //To Start MongoDB service

// app.use(allowCrossDomain);

app.get("api/v1/notes", (req, res) => {
  let notes = res.json({
    results: db.notes,
  });
});

//auto , series and parallel async functions

app.get("/newnotes",(req, res) => {
  async.auto(
    {
      notes: function (cb) {
        notemodel.find().exec(function (err, notes) {
          if (err) {
            return cb("Unable to fetch notes.");
          }
          console.log(notes);
          return cb(null, notes);
        });
      },
    },
    function (err, results) {
      if (err) {
        return res.status(403).json({ error: err });
      }
      return res.json({ results: results.notes });
    }
  );
});

app.post("api/v1/addnewnote", (req, res) => {
  let Existingnotes = db.notes;
  let note = req.body.note;

  Existingnotes.push(note);
  fs.writeFile("db.json", JSON.stringify({ notes: Existingnotes }), () => {});

  res.send("Note Created");
});

//Post Request MongoDB
app.post("api/v1/newnotes", async (req, res) => {
  const data = new notemodel({
    description: req.body.description,
    title: req.body.title,
  });

  const val = await data.save();

  res.send("Note Sucessfully Created");
});

//fetch and add the notes and Users from the DB

app.get("api/v1/concat", (req, res) => {
  async.auto(
    {
      notes: function (cb) {
        notemodel.find().exec(function (err, notes) {
          if (err) {
            return cb("Unable to fetch notes.");
          }
          console.log(notes);
          return cb(null, notes);
        });
      },
      users: function (cb) {
        userModel.find().exec(function (err, users) {
          if (err) {
            return cb("Unable to fetch Users");
          }
          console.log(users);
          return cb(null, users);
        });
      },
    },

    function (err, results) {
      if (err) {
        return res.status(403).json({ error: err });
      }
      console.log(results);
      return res.send(results.notes.concat(results.users));
    }
  );
});

/*
app.delete('/delete',()=>{
    
})

*/

//GET request to get users
app.get("api/v1/getUsers", (req, res) => {
  async.auto(
    {
      users: function (cb) {
        userModel.find().exec(function (err, users) {
          if (err) {
            return cb("Unable to fetch users");
          }

          return cb(null, users);
        });
      },
    },
    function (err, results) {
      if (err) {
        return res.status(403).json({ error: err });
      }
      return res.json({ results: results.users });
    }
  );
});

//Post API to Add new User
app.post("api/v1/signup", (req, res) => {
  async.auto(
    {
      users: function (cb) {
        var userData = { email: req.body.email, password: req.body.password };
        console.log(userData);
        // var authToken = jwt.sign(userData,secretKey)
        userData.authToken = jwt.sign(userData, secretKey);

        userModel.create(userData, (err, user) => {
          if (err) {
            return cb("Unable to Add!");
          }
          console.log(user);
          return cb(null, user);
        });
      },
    },
    function (err, results) {
      if (err) {
        return res.status(403).json({ error: err });
      }
      return res.send(results.users);
    }
  );
});

//POST Request For Login

app.post("api/v1/login", (req, res) => {
  async.auto(
    {
      users: function (cb) {
        userModel.findOne(
          { email: req.body.email, password: req.body.password },
          (err, user) => {
            if (err) {
              return cb(err);
            }
            console.log(user);
            try {
              var token = jwt.sign(
                { email: user.email, password: user.password },
                secretKey
              );
              return cb(null, token);
            } catch (err) {
              return cb(null, false);
            }
          }
        );
      },
    },
    function (err, results) {
      if (err) {
        return res.status(403).json({ error: err });
      }
      // console.log(results);

      if (!results.users) {
        return res.status(403).json({ results: "unable to login" });
      }
      res
        .cookie("authToken", results.users, {
          httpOnly: false,
          domain: "localhost",
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
        })
        .send(" succesfully logged in");
    }
  );
});

//GET API for Logout
app.get("api/v1/logout", (req, res) => {
  res
    .cookie("authToken", null, {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .send("Succesfully logged Out!");
});

/**
 area of square
area of circle
area of square
area of circle
add two numbers
subtract two numbers
gcd of two numbers
square of two numbers
square toot of a number
 */

app.post("api/v1/submission", (req, res) => {
  var key = req.body.key;
  var first = parseInt(req.body.firstNumber);
  var second = parseInt(req.body.secondNumber);
  async.auto(
    {
      sum: function (cb) {
        if (key !== "add") return cb(null, false);

        var sum = Number(first + second);
        return cb(null, sum);
      },
      sub: function (cb) {
        if (key !== "sub") return cb(null, false);

        var sub = Number(first - second);
        return cb(null, sub);
      },

      areaCircle: function (cb) {
        if (key !== "areaCircle") return cb(null, false);

        var circle = Number(3.14 * first * first);
        return cb(null, circle);
      },
      sqrt: function (cb) {
        if (key !== "sqrt") return cb(null, false);

        var sqrt = Math.sqrt(first);
        return cb(null, sqrt);
      },
    },
    function (err, results) {
      if (err) {
        return res.send.status(403).json({ error: err });
      }
      return res.json({ results: results });
    }
  );
});

app.listen(port, () => {
  console.log("App has been started on Port : 5001");
});
