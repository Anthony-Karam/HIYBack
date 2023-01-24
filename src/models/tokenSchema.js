const { Schema, model } = require("mongoose");

const tokenSchema = new Schema({
  _userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  accessToken: {
    accessTokenType: {
      type: String,
      required: true,
    },
    expiresIn: {
      type: String,
      required: true,
    },
  },
  refreshToken: {
    refreshTokenType: {
      type: String,
      required: true,
    },
    expiresIn: {
      type: String,
      required: true,
    },
  },
});

const Token = model("Token", tokenSchema);
module.exports = Token;
