const { MongoClient } = require("mongodb");

// const url =
//   "mongodb+srv://rahulrohilla1081:Rahul1234@cluster0.rtaxnq9.mongodb.net/?retryWrites=true&w=majority";

const url = "mongodb://0.0.0.0:27017";
const DatabaseName = "IIL-Bank-PO";
const client = new MongoClient(url);
async function DbConnect() {
  let result = await client.connect();
  db = result.db(DatabaseName);
  return db;
}

module.exports = DbConnect;
