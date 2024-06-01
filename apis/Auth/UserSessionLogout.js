var express = require("express");
var router = express.Router();
const LocalConnect = require("../../LocalDB");
const hat = require("hat");

/*   
API url: - 
http://localhost:9000/api/Auth/UserSessionTokenVerify

payload:
{
    
    "SESSION_ID":"502324"
    
}
*/

router.post("/", async function (req, res, next) {
  let formData = await req.body;
//   console.log("formData", formData);
  let db = await LocalConnect();
  try {
     db.collection("sessions").updateOne(
       {
         SESSION_ID: formData.SESSION_ID,
         IS_LOGOUT: false,
       },
       { $set: { IS_LOGOUT: true } }
     );
      res.send({  SESSION_LOGOUT: true });

  } catch (err) {
    console.log(err);
    res.send({ message: "Error in " + __filename });
  }
});

module.exports = router;
