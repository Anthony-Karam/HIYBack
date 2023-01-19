const jwt = require("jsonwebtoken");

// create a JWT with the user's email address and a unique token
const createVerificationToken = (_id) => {
  console.log("VERIFY SECRET jwt.js", process.env.JWT_SECRET);
  console.log(_id, "id");
  const token = jwt.sign({ _id }, process.env.JWT_SECRET, {
    expiresIn: "10h",
  });
  console.log("token jwt.js", token);
  return token;
};

module.exports = createVerificationToken;
