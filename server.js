const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config;

const app = express();
app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.static("public"));
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
      console.log("Save Successfully");
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
    res.send({ data: 1 });
  });
});
const port = process.env.PORT || 3000;

app.post("/updateDone/:id", function(req, res) {
  const id = req.params.id;
  Work.updateOne({ _id: id }, { $set: { checked: true } }, function(err, data) {
    if (err) {
      console.log("Error When Update One Set True" + err);
    } else {
      res.send("Update Done Success");
    }
  });
});

app.post("/updateUnDone/:id", function(req, res) {
  const id = req.params.id;
  Work.updateOne({ _id: id }, { $set: { checked: false } }, function(err) {
    if (err) {
      console.log("Error When Update One Set False" + err);
    } else {
      res.send("Update Un Done Success");
    }
  });
});

app.listen(port, () => {
  console.log("running on port " + port);
});
