var express = require("express");
var router = express.Router();
const DbConnect = require("./LocalDB");

// const axios_function_all_APIs_catch = require("../for_programmers/axios_function_all_APIs_catch");

/*   
API url: -   
http://localhost:9000/truncate
*/

router.get("/", async function (req, res, next) {
  try {
    let db = await DbConnect();
    db.collection("POs").deleteMany({});

    res.send("Local DB truncated!!!!!!!!!!!!");
  } catch (e) {
    console.log({ error: e, fileName: __filename });
    // axios_function_all_APIs_catch(__filename, res.statusCode, req.body);

    res.send({ error: e, fileName: __filename });
  }
});

module.exports = router;
