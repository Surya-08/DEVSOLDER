const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://supani1108:H2IZEryt3nLyji3a@nodejscluster.nurxp.mongodb.net/devSolder"
  );
};
module.exports = connectDB;
