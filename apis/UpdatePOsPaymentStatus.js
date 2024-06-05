var express = require("express");
var router = express.Router();
var axios = require("axios");
const https = require("https");
const LocalConnect = require("../LocalDB");
const { DefaultApiUrl } = require("../Constant");

/*   
API url: - 
http://localhost:9000/main_api/SAP_DATA
{
  start: "2023-10-10",
  POData:[{
      Vendor_Code: "0001400055",
      Vendor_Name: "Krishna Solvechem Ltd",
      Vendor_Doc: 782,
      Vendor_Doc_date: 20230630,
      Plant_Code: 1011,
      Plant_name: "IIL Dahej SEZ",
      Payment_term_Code: "Z090",
      Payment_term_text: "Net due in 90 days",
      Po_No: 4500071773,
      Po_Date: 20230630,
      Document_No: 5100007813,
      Posting_Date: 20230711,
      Amount: "300599.00",
      Due_date: 20231009,
      // resourceId: getUniqueID(),
      Approved_by_id: "SAMISHTI_ABA",
      Approved_by_Name: " SAMISHTI_ABA",
    },]
}
*/

router.post("/", async function (req, res, next) {

  console.log("");
  try {
      let LocalDB = await LocalConnect();
 const convertIndianStandardIntoYMD = (date) => {
   var dateObj = new Date(date);
   console.log("datesdhbasjdasjdda", date);
   if (!isNaN(dateObj) && dateObj != "") {
     let mnth = ("0" + (dateObj?.getMonth() + 1)).slice(-2);
     let day = ("0" + dateObj?.getDate())?.slice(-2);
     return [dateObj.getFullYear(), mnth, day].join("-");
   }
 };

 let CurrentDate = new Date();
 CurrentDate = convertIndianStandardIntoYMD(CurrentDate);
 let NextDate = new Date();

 // add a day
 NextDate = NextDate.setDate(NextDate.getDate() + 1);
 NextDate = convertIndianStandardIntoYMD(NextDate);
 let [year, month, day] = CurrentDate.split("-");
 let [yearNextDate, monthNextDate, dayNextDate] = NextDate.split("-");

 let finalCurrentDate = year + month + day;
 let finalNextDate = yearNextDate + monthNextDate + dayNextDate;
 console.log("asdhabsdas", finalCurrentDate, finalNextDate);

 let POsCurrentDate = await LocalDB.collection("POs")
   .find({
     Payment_Assign_Date: Number(finalCurrentDate),
   })
   .toArray();
 let POsNextData = await LocalDB.collection("POs")
   .find({
     Payment_Assign_Date: Number(finalNextDate),
   })
   .toArray();

 let formData = {
   POData:[],
 };

 if (POsCurrentDate.length > 0) {
   POsCurrentDate.map((val) => {
     formData.POData.push({
       ...val,
     });
   });
 }
 if (POsNextData.length > 0) {
   POsNextData.map((val) => {
     formData.POData.push({
       ...val,
     });
   });
 }

 console.log("Asdkhasbdhas", formData);
    

  



    console.log("form Data", formData.POData);
        // let payment_date = formData.start.split("-");
        // payment_date = payment_date[0] + payment_date[1] + payment_date[2]

    // formData.POData.map((val, index) => {
    //   if (val?.sap_payment_status) {
    //     formData.POData[index].splice(index, 1);


    //   } else {

    

    //     val.Payment_Assign_Date = Number(payment_date);
    //      val.Form_3b = "test";
    //    val.Company_Code="1000"
    //    val.Fiscal_year="2023"
    //   }
    // });

    if (formData.POData.length > 0) {
      let data = {
        IT_TAB: formData.POData,
      };
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${DefaultApiUrl}RESTAdapter/Bank_Integrationl/Vendor_Payment_Update`,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic V1NfUE9RX0RBU0g6aWlsQDIwMjQ=",
          Cookie: "saplb_*=(J2EE129733420)129733450",
        },
        data: data,
        httpsAgent: new https.Agent({ rejectUnauthorized: false }),
      };


      console.log("SAP DATA",data);
      axios
        .request(config)
        .then(async (response) => {
          console.log("response.datanasdjasdj", response.data);

          if (formData.POData.length == 1) {
            console.log("inside if");
            let PaymentCompilationStatus = false;
            if (
              response.data.IT_TAB.TECH_REMARK == "DATA ALREADY EXIST" ||
              response.data.IT_TAB.TECH_REMARK == "SUCCESSFUL"
            ) {
              PaymentCompilationStatus = true;
            } else {
              PaymentCompilationStatus = false;
            }
            console.log("Sadasdasdsad payment response",response.data.IT_TAB);
            await LocalDB.collection("POs").updateOne(
              { Document_No: response.data.IT_TAB.Document_No, 
                  Item: response.data.IT_TAB.Item,
                Company_Code: response.data.IT_TAB.Company_Code,
                Fiscal_year: response.data.IT_TAB.Fiscal_Year, },
              { $set: { PaymentStatusSAP: PaymentCompilationStatus } }
              // { upsert: true }
            );
          } else if (formData.POData.length > 1) {
            console.log("inside else if ", response.data.IT_TAB);

            response.data.IT_TAB.map(async (val) => {
              let PaymentCompilationStatus = false;
              if (
                val.TECH_REMARK == "DATA ALREADY EXIST" ||
                val.TECH_REMARK == "SUCCESSFUL"
              ) {
                PaymentCompilationStatus = true;
              } else {
                PaymentCompilationStatus = false;
              }
              console.log("ASASDASDAS",   { Document_No: val.Document_No ,
                Item: val.Item,
                Company_Code: val.Company_Code,
                Fiscal_year: val.Fiscal_Year,

              },);
              await LocalDB.collection("POs").updateOne(
                { Document_No: val.Document_No ,
                  Item: val.Item,
                  Company_Code: val.Company_Code,
                  Fiscal_year: val.Fiscal_Year,

                },
                { $set: { PaymentStatusSAP: PaymentCompilationStatus } }
                // { upsert: true }
              );
            });
          }

          res.send(response.data);
        })
        .catch((err) => {
          console.log(err);
          res.send(err);

        });

      // POData.map(async(val)=>{
      let updateData = {
        Due_date: formData.start,
        sap_payment_status: true,
      };

      // await LocalDB.collection("POs").updateOne(
      //   { Document_No: val.Document_No },
      //   { $set: updateData }
      //   // { upsert: true }
      // );

      // })
    }

    // res.send(tempArray)
  } catch (err) {
    console.log(err);
    res.send({ message: "Error in " + __filename });
  }
});

module.exports = router;
