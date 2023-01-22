const jwt = require("jsonwebtoken");

// create a JWT with the user's email address and a unique token
const createVerificationToken = (_id, exp) => {
  const token = jwt.sign({ _id }, process.env.JWT_SECRET, {
    expiresIn: exp,
  });
  return token;
};

module.exports = createVerificationToken;
