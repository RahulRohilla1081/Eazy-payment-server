var express = require("express");
var router = express.Router();
const LocalConnect = require("../LocalDB");

/*   
API url: - 
http://localhost:9000/api/updateMaxAmountLimit
{
      MAX_AMOUNT_LIMIT: "0001400055",
      COMPANY_ID: "0001400055",
}
*/

router.post("/", async function (req, res, next) {
    try {
      let LocalDB = await LocalConnect();
      const formData = req.body;
      console.log("asjkdashbdj",formData);
            await LocalDB.collection("Limits").updateOne(
              { COMPANY_ID: formData.COMPANY_ID },
              { $set: { MAX_AMOUNT_LIMIT: formData.MAX_AMOUNT_LIMIT,LOWER_LIMIT_PERCENTAGE:formData.LOWER_LIMIT_PERCENTAGE,MID_LIMIT_PERCENTAGE:formData.MID_LIMIT_PERCENTAGE,
                CARRY_FORWARD:formData.CARRY_FORWARD } }
            );

                res.send(formData.MAX_AMOUNT_LIMIT);


    } catch (err) {
      console.log(err);
      res.send({ message: "Error in " + __filename });
    }
});

module.exports = router;