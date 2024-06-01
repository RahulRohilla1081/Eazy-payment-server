var express = require("express");
var router = express.Router();
var axios = require("axios");
const https = require("https");
// const LocalDB = require("../LocalDB");
const LocalConnect = require("../LocalDB");

/*   
API url: - 
http://localhost:9000/apis/SAPPOsGetRoute

payload:-
{ 
    Date_From: "20230901",
    Date_To: "20230921" 
}

*/

router.post("/", async function (req, res, next) {
  let LocalDB = await LocalConnect();
  const formData = req.body;

  console.log("formData", formData);
  // console.log("acladhb");
  try {
    // console.log("sadhbasdsad");
    let data = { Date_From: formData.Date_From, Date_To: formData.Date_To };
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://apps.insecticidesindia.com:51200/RESTAdapter/Bank_Integrationl/Vendor_Payment_Details",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic V1NfUE9RX0RBU0g6aWlsQDIwMjQ=",
        Cookie: "saplb_*=(J2EE129733420)129733450",
      },
      data: data,
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    };

    // console.log("Adasdasd",config);

    axios
      .request(config)
      .then(async (response) => {

        console.log("asdhasd",response.data, response.data.IT_TAB.length);
        if (response.data != "") {
          if (response.data?.IT_TAB?.Document_No != undefined) {
            let IsDocumentAvailable = await LocalDB.collection("POs")
              .find({
                Document_No: response.data.IT_TAB.Document_No,
                Item: response.data.IT_TAB.Item,
                Company_Code: response.data.IT_TAB.Company_Code,
                Fiscal_year: response.data.IT_TAB.Fiscal_year,
              })
              .toArray();
              // console.log("asdjhasd inside", IsDocumentAvailable);


       
            if (IsDocumentAvailable.length==0) {
              await LocalDB.collection("POs").insertOne({...response.data.IT_TAB,PaymentStatus:false});
            }
            //  await LocalDB.collection("POs").updateOne(
            //    { Document_No: response.data.IT_TAB.Document_No },
            //    { $set: response.data.IT_TAB },
            //    { upsert: true }
            //  );
            let POsData = await LocalDB.collection("POs").find({}).toArray();
            // console.log("asmdbjasvdjasd inside if", POsData);
                //  console.log("asdhbashd 1", POsData);
            res.send(POsData);
            // console.log("ajsbdjasdjasdj");
          } else {
            response.data.IT_TAB.map(async (val, index) => {
                   let IsDocumentAvailable = await LocalDB.collection("POs")
                     .find({
                       Document_No: val.Document_No,
                       Item: val.Item,
                       Company_Code: val.Company_Code,
                       Fiscal_year: val.Fiscal_year,
                     })
                     .toArray();
                    //  console.log("asdasdsadasdasd", IsDocumentAvailable);
                     if (IsDocumentAvailable.length==0){
              await LocalDB.collection("POs").insertOne({...val,PaymentStatus:false});
            }
                      //  await LocalDB.collection("POs").updateOne(
                      //    { Document_No: val.Document_No },
                      //    { $set: val },
                      //    { upsert: true }
                      //  );

              if (response.data.IT_TAB.length - 1 == index) {
                let POsData = await LocalDB.collection("POs")
                  .find({})
                  .toArray();
                //  console.log("asmdbjasvdjasd inside else", POsData);
                //  console.log("asdhbashd 2", POsData);

                res.send(POsData);
              }
            });
          }
        } else {
          // console.log("No Response from SAP");
          // res.send([])
          let POsData = await LocalDB.collection("POs").find({}).toArray();
          //  console.log("asmdbjasvdjasd inside else", POsData);
                //  console.log("asdhbashd 3", POsData);


          res.send(POsData);
        }
      })
      .catch((error) => {
        console.log(error);
          res.send([]);
      });
  } catch (err) {
    console.log(err);
    res.send([]);
  }
});

module.exports = router;
