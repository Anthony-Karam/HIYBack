const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");
const SALT_ROUNDS = process.env.SALT_ROUNDS || 10;
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
      minLength: 10,
      maxLength: 11,
      required: true,
      unique: true,
      // match: /^\+961[0-9]{8}$/,
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
      maxLength: 16,
      select: false,
    },
    address: {
      type: String,
      minLength: 3,
      maxLength: 10,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },

    subscribedDate: {
      type: Date,
      default: Date.now,
    },
    enrolled: [
      {
        courseName: String,
        courseId: String,
        default: 0,
      },
    ],
  },
  {
    collection: "users",
  }
);
UserSchema.pre("save", async function (next) {
  try {
    const SALT_ROUNDS = 10 || process.env.SALT_ROUNDS;
    const salt = await bcrypt.genSalt(SALT_ROUNDS);

    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

UserSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error(error);
  }
};
const User = model("User", UserSchema);
module.exports = User;
