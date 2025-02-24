const validate = require("validator");
const validateSignUp = (req) => {
  const { emailId, password, firstName, lastName } = req.body;
  if (!firstName || !lastName) {
    throw new Error("name is required");
  } else if (!emailId || !validate.isEmail(emailId)) {
    throw new Error("Email is invalid");
  } else if (!password || password.length < 8) {
    throw new Error("Password must be atleast 8 characters long");
  }
};

const validateEditProfile = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "emailId",
    "photoUrl",
    "skills",
    "about",
    "gender",
    "age",
  ];
  const isEditedFields = Object.keys(req.body).every((item) =>
    allowedEditFields.includes(item)
  );
  return isEditedFields;
};

module.exports = { validateSignUp, validateEditProfile };
