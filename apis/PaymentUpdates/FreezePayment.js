var express = require("express");
var router = express.Router();
const LocalConnect = require("../../LocalDB");

/*   
API url: -   
http://localhost:9000/apis/PaymentUpdates/FreezePayment
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
  try {
    let db = await LocalConnect();
    let formData = req.body;
    // console.log("Sdhasbdas",formData);

    let [year, month, day] = formData.start.split("-");
    payment_date = year + month + day;

    // console.log("aasdasd", payment_date);


    formData.POData.map(async(val)=>{
      console.log("Asdsadasdadsa",val.Document_No);
    await db.collection("POs").updateOne(
      { Document_No: val.Document_No ,   
        Item: val.Item,
        Company_Code: val.Company_Code,
        Fiscal_year: val.Fiscal_year},
      {
        $set: {
          PaymentStatus: formData.FREEZE_STATUS,
          Payment_Assign_Date: Number(payment_date),
          Due_date: Number(payment_date),
          Form_3b: "testabcd",
          CARRY_FORWARD:false
          // Company_Code: "1000",
          // Fiscal_year: "2023",
        },
      }
      // { upsert: true }
    );
    })

    res.send({STATUS_CODE:200, DATA_UPDATED:true})

     
  } catch (e) {
    console.log({ error: e, fileName: __filename });
    // axios_function_all_APIs_catch(__filename, res.statusCode, req.body);

    res.send({ error: e, fileName: __filename });
  }
});

module.exports = router;
