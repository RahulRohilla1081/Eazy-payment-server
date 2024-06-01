var express = require("express");
var router = express.Router();
var axios = require("axios");
const https = require("https");
const LocalConnect = require("../LocalDB");

/*   
API url: - 
http://localhost:9000/api/getMaxAmountLimit
{

}
*/

router.get("/", async function (req, res, next) {
  try {
    let LocalDB = await LocalConnect();
     let maxLimitData = await LocalDB.collection("Limits").find({}).toArray();
    //  console.log("asmdbjasvdjasd inside if", maxLimitData);

  } catch (err) {
    console.log(err);
    res.send({ message: "Error in " + __filename });
  }
});

module.exports = router;
