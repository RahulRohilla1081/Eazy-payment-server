var express = require("express");
var router = express.Router();
const LocalConnect = require("../LocalDB");

// const axios_function_all_APIs_catch = require("../for_programmers/axios_function_all_APIs_catch");

/*   
API url: -   
http://localhost:9000/apis/DeletePayments
*/

router.post("/", async function (req, res, next) {
  try {
    let db = await LocalConnect();
    // db.collection("account_holder").deleteMany({});
    // db.collection("bank_society").deleteMany({});
    // db.collection("OAuth2.0").deleteMany({});
    db.collection("POs").deleteMany({});
    res.send("Db Deleted")
    // db.collection("agents").deleteMany({});
    // res.send("testing");
  } catch (e) {
    console.log({ error: e, fileName: __filename });
    // axios_function_all_APIs_catch(__filename, res.statusCode, req.body);

    res.send({ error: e, fileName: __filename });
  }
});

module.exports = router;
