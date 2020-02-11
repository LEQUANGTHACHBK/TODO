const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config;
const expressValidator = require("express-validator");
const flash = require("connect-flash");
const session = require("express-session");
const app = express();
app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.static("public"));

//Express-session Middleware

app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true
  })
);

//Express-messages Middleware

app.use(require("connect-flash")());
app.use(function(req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

app.use(
  expressValidator({
    errorFormatter: function(param, msg, value) {
      var namespace = param.split("."),
        root = namespace.shift(),
        formParam = root;

      while (namespace.length) {
        formParam += "[" + namespace.shift() + "]";
      }
      return {
        param: formParam,
        msg: msg,
        value: value
      };
    }
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
//Setup For Mongoose
mongoose.connect(
  "mongodb+srv://LeQuangThach:lequangthach95@clustersthachhaclong-3t8fn.mongodb.net/ProjectLQT?retryWrites=true&w=majority",
  { useUnifiedTopology: true, useNewUrlParser: true },
  function(error) {
    if (!error) {
      console.log("Connect MongoDB Successfully");
    } else {
      console.log("Connection Error " + error);
    }
  }
);

const Work = require("./public/models/work.js");

app.get("/", (req, res) => {
  Work.find(function(err, data) {
    if (err) {
      console.log("Get Data Error " + err);
      res.json({ kq: 0 });
    } else {
      console.log("Find successfully");
      console.log(data);
      res.render("index.ejs", { data: data });
    }
  });
});
app.post("/addNewWork", (req, res) => {
  var newWork = new Work({
    content: req.body.workName,
    checked: false,
    createTime: new Date()
  });
  newWork.save(function(err) {
    if (err) {
      console.log("Cant Not Save");
      res.json({
        kq: 0
      });
    } else {
      // console.log("Save Successfully");
      req.flash("success", "Adding Complete");
      res.redirect("/");
      //   res.json({
      //     kq: 1
      //   });
    }
  });
});

app.delete("/deleteWork/:id", function(req, res) {
  let query = { _id: req.params.id };
  Work.remove(query, function(err) {
    if (err) {
      console.log(err);
    }
    req.flash("success", "Delete SuccessFull");
    res.end();
  });
});
const port = process.env.PORT || 3000;

app.post("/updateDone/:id", function(req, res) {
  const id = req.params.id;
  Work.updateOne({ _id: id }, { $set: { checked: true } }, function(err, data) {
    if (err) {
      console.log("Error When Update One Set True" + err);
    } else {
      res.end();
    }
  });
});

app.post("/updateUnDone/:id", function(req, res) {
  const id = req.params.id;
  Work.updateOne({ _id: id }, { $set: { checked: false } }, function(err) {
    if (err) {
      console.log("Error When Update One Set False" + err);
    } else {
      res.end();
    }
  });
});

app.listen(port, () => {
  console.log("running on port " + port);
});
