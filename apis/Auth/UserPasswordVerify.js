var express = require("express");
var router = express.Router();
// const dbConnect = require("../../db");
const LocalConnect = require("../../LocalDB");
const bcrypt = require("bcrypt");

const hat = require("hat");
const reader = require("xlsx");
const excelToJson = require("convert-excel-to-json");
const fs = require("fs");


/*   
API url: - 
http://localhost:9000/api/Auth/UserPasswordVerify

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
      .collection("users")
      .find({
        CONTACT: formData.CONTACT,
      })
      .toArray();
    const HashedPassword = bcrypt.hashSync(formData.PASSWORD, 10);
    console.log("kabjhbsdjs", HashedPassword);

    if (data.length > 0) {
      console.log("inside ");
      bcrypt.compare(
        formData.PASSWORD,
        data[0].PASSWORD,
     async  function (err, isMatch) {
          if (err) {
            throw err;
          } else if (!isMatch) {
            console.log("Password not match");
            res.send({ STATUS_CODE: 200, PASSWORD_MATCH: false });
          } else {
            const sessionToken = hat();
            let SessionData = {
              SESSION_ID: sessionToken,
              CUSTOMER_ID: data[0].CUSTOMER_ID,
              DEVICE_NAME: formData.DEVICE_NAME,
              IP_ADDRESS: formData.IP_ADDRESS,
              IS_LOGOUT: false,
              CREATION_DATE: new Date(),
            };

            let config_data = await db
            .collection("Limits")
            .find({
              COMPANY_ID: data[0].CUSTOMER_ID,
            })
            .toArray();
            console.log(
              "asjdvasjdasda",config_data,data[0].CUSTOMER_ID
            );

            db.collection("sessions").insertOne(SessionData);

            

            let tempData = { ...data[0], ...SessionData,...config_data[0] };
            delete tempData.PASSWORD;
            delete tempData.VERIFICATION_TOKEN;
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

 result.Sheet1.splice(0, 1);

            res.send({
              STATUS_CODE: 200,
              PASSWORD_MATCH: true,
              SESSION_DATA: tempData,
              DISABLED_DATE: result.Sheet1,
            });

            console.log("Matched");
          }
        }
      );

      //   res.send({ STATUS_CODE: 200, TOKEN_MATCH: true, data: SessionData });
    } else {
      res.send({ STATUS_CODE: 200, TOKEN_MATCH: false });
    }
  } catch (err) {
    console.log(err);
    res.send({ message: "Error in " + __filename });
  }
});

module.exports = router;
