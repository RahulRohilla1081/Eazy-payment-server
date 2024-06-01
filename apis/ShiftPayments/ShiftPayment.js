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
    console.log("Sdhasbdas",formData);
    const convertIndianStandardIntoYMDSAP = (date) => {
      var date = new Date(date),
        mnth = ("0" + (date.getMonth() + 1)).slice(-2),
        day = ("0" + date.getDate()).slice(-2);
      return [date.getFullYear(), mnth, day].join("");
    };

    if(formData.START_DATE!=undefined && formData.END_DATE!=undefined && formData.SELECTED_DATE!=undefined){
      const MonthStartDate=convertIndianStandardIntoYMDSAP(formData.START_DATE)
      const MonthEndDate=convertIndianStandardIntoYMDSAP(formData.END_DATE)
      const SelectedDate=convertIndianStandardIntoYMDSAP(formData.SELECTED_DATE)
      
    const prev_data=await db.collection("POs").find({
      // PaymentStatus:false,
      Due_date: { 
              $gte: Number(MonthStartDate), // Start of the previous month
              $lte: Number(MonthEndDate)   // Start of the current month
            }
          
    }).toArray()
    console.log("ASdasdas",prev_data,MonthStartDate,MonthEndDate);

    await db.collection("POs").updateMany(
        { 
          PaymentStatus:false,
          // Match documents where the Duedate field is in the previous month
          Due_date: { 
            $gte: Number(MonthStartDate), // Start of the previous month
            $lte: Number(MonthEndDate)  // Start of the current month
          }
        },
        {
          // Update fields as needed
          $set: {
            // Update someField to someValue
            CARRY_FORWARD:true,
            SAVED_DATE:null,
            Due_date:Number(SelectedDate)
          }
        }
      )
    }



    // const prev_data=await db.collection("POs").find({
    //   Due_date: { 
    //           $gte: formData.START_DATE, // Start of the previous month
    //           $lt: formData.END_DATE   // Start of the current month
    //         }
          
    // }).toArray()
    
    // console.log("asdkjnasdjk",startDateString,endDateString,convertIndianStandardIntoYMDSAP(firstDayOfCurrentMonth),firstDayOfThisMonth,firstDayOfThisMonth,);
    // const prevMonthPending=await db.collection("POs").find({


    // return {
    //   startDate: firstDayOfPreviousMonth,
    //   endDate: lastDayOfPreviousMonth
    // };
  
    // }).toArray()

   

    res.send({STATUS_CODE:200, DATA_UPDATED:true})

     
  } catch (e) {
    console.log({ error: e, fileName: __filename });
    // axios_function_all_APIs_catch(__filename, res.statusCode, req.body);

    res.send({ error: e, fileName: __filename });
  }
});

module.exports = router;
