const mongoose = require("mongoose");
function callback(error) {
  console.log("failed to connect mongoDb", error);
}
const connectDb = () => {
  try {
    mongoose.connect(process.env.MONGODB_URL);
    const connection = mongoose.connection;

    connection.on("error", callback);
    connection.once("open", () => {
      console.log("connected to Mongodb");
    });
  } catch (err) {
    console.log("Failed to connect MongoDb", err);
  }
};
module.exports = connectDb;
