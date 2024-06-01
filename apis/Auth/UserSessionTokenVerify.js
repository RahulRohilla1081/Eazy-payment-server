var express = require("express");
var router = express.Router();
const LocalConnect = require("../../LocalDB");
const hat = require("hat");
const reader = require("xlsx");
const excelToJson = require("convert-excel-to-json");
const fs = require("fs");


/*   
API url: - 
http://localhost:9000/api/Auth/UserSessionTokenVerify

payload:
{
    "CONTACT":"7777040224",
    "VERIFICATION_TOKEN":"502324"
    
}
*/

router.post("/", async function (req, res, next) {
  let formData = await req.body;
  console.log("formData", formData);
  let db = await LocalConnect();
  try {
    let data = await db
      .collection("sessions")
      .find({
        SESSION_ID: formData.SESSION_ID,
      })
      .toArray();
    if (data.length > 0) {

            let user_data = await db
              .collection("users")
              .find({
                CUSTOMER_ID: data[0].CUSTOMER_ID,
              })
              .toArray();
            let config_data = await db
              .collection("Limits")
              .find({
                CUSTOMER_ID: data[0].CUSTOMER_ID,
              })
              .toArray();
             delete user_data.PASSWORD
             delete user_data.VERIFICATION_TOKEN;
              let final_data={
                ...data[0],
                ...user_data[0],
                ...config_data[0]
              }

                  // const file = reader.readFile(__dirname + "/test.xlsx");
                  // let disabled_dates_data = [];
                  // const sheets = file.SheetNames;
                  // for (let i = 0; i < sheets.length; i++) {
                  //   const temp = reader.utils.sheet_to_json(
                  //     file.Sheets[file.SheetNames[i]]
                  //   );
                  //   temp.forEach((res) => {
                  //     disabled_dates_data.push(res);
                  //   });
                  // }

                                
 let result = excelToJson({
   source: fs.readFileSync(__dirname + "/test.xlsx"), // fs.readFileSync return a Buffer
   columnToKey: {
     A: "DATE",
     B: "TYPE",
     //  B: "firstName",
   },
 });
              
      res.send({
        TOKEN_MATCH: true,
        SESSION_DATA: final_data,
        DISABLED_DATE: result.Sheet1,
      });

    } else {
    //   res.send({SESSION_DATA: user_data });
      res.send({ TOKEN_MATCH: false, });

    }
  } catch (err) {
    console.log(err);
    res.send({ message: "Error in " + __filename });
  }
});

module.exports = router;
