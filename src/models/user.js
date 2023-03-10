const { Schema, model, default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");

// console.log(wt);
const UserSchema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
    },
    userName: {
      required: true,
      unique: true,
      type: String,
      minLength: 3,
      maxLength: 10,
      lowercase: true,
    },
    firstName: {
      type: String,
      minLength: 3,
      maxLength: 10,
      required: true,
    },
    lastName: {
      type: String,
      minLength: 3,
      maxLength: 10,
      required: true,
    },
    emailAddress: {
      type: String,
      minLength: 16,
      maxLength: 34,
      required: true,
      unique: true,
      match: /^\S+@\S+\.\S+$/,
    },
    phoneNumber: {
      type: String,
      unique: true,
      required: true,
      minLength: 11,
      maxLength: 12,
      required: true,
      // match: /^\+961[0-9]{8}$/,
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
      maxLength: 16,
      // select: false,
    },
    address: {
      type: String,
      minLength: 3,
      maxLength: 10,
      required: true,
    },
    enrolled: [
      {
        courseName: {
          type: String,
          default: "Not Enrolled",
        },
        courseProgress: {
          type: String,
          default: 0,
        },
      },
    ],
    verified: {
      type: Boolean,
      default: false,
    },

    subscribedDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "users",
  }
);
UserSchema.pre("save", async function (next) {
  try {
    const SALT_ROUNDS = 10 || process.env.SALT_ROUNDS;
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    console.log("pass", this.password);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

const User = model("User", UserSchema);
module.exports = User;
