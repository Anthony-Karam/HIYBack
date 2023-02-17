const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bp = require("body-parser");
const path = require("path");
const fs = require("fs");
var cors = require("cors");
const S3Controller = require("./src/controllers/s3");

app.use(
  cors({
    // origin: "http://localhost:3000",
    // methods: "GET,POST,PUT,DELETE",
    // allowedHeaders: "Content-Type,Authorization",
  })
);
app.use(bp.json());
app.use(bp.urlencoded({ useNewUrlParser: true, extended: true }));
dotenv.config();
app.use(express.static(path.join(__dirname, "src/public")));

mongoose.set("strictQuery", false);
// app.set("view engine", "ejs");
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("conntected to mongodb"))
  .catch((err) => {
    console.log(err);
  });

// app.post("/upload", S3Controller.multerS3UploadVideos(), S3Controller.s3Upload);
app.get("/videos/:filename", S3Controller.s3Read);
// app.use(express.static("public/images"));
//Routes

const userRouter = require("./src/routes/user");
//Create,update,delete,get
app.use("/users", userRouter);

//login/
const loginRouter = require("./src/routes/login");
app.use("/users", loginRouter);

const logOutRouter = require("./src/routes/logOut");
app.use("/users", logOutRouter);

///Admin routes
const categoryRouter = require("./src/routes/category");
app.use("/admin", categoryRouter);

const courseRouter = require("./src/routes/course");
app.use("/admin", courseRouter);

const aboutRouter = require("./src/routes/about");

app.use("/admin/about", aboutRouter);

app.get("/aboutImages/:imageName", (req, res) => {
  res.sendFile(
    path.join(__dirname, `src/public/aboutImages/${req.params.imageName}`)
  );
});
app.get("/courseImages/:imageName", (req, res) => {
  res.sendFile(
    path.join(__dirname, `src/public/courseImages/${req.params.imageName}`)
  );
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
