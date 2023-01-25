const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bp = require("body-parser");
app.use(bp.json());
app.use(bp.urlencoded({ useNewUrlParser: true, extended: true }));
dotenv.config();
mongoose.set("strictQuery", false);
// app.set("view engine", "ejs");
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("conntected to mongodb"))
  .catch((err) => {
    console.log(err);
  });

//Routes

const userRouter = require("./src/routes/user");
//Create,update,delete,get
app.use("/users", userRouter);

//login/
const loginRouter = require("./src/routes/login");
app.use("/users", loginRouter);

const logOutRouter = require("./src/routes/logOut");
app.use("/users", logOutRouter);

app.listen(process.env.PORT, () => {
  console.log("Server running on http://localhost:3000");
});
