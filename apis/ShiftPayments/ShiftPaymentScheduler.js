
const axios = require("axios");
const LocalConnect = require("../../LocalDB");

const PaymentScheduler = () => {
  



    const today = new Date();
    const firstDayOfThisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const firstDayOfPreviousMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastDayOfPreviousMonth = new Date(firstDayOfThisMonth.getTime() - 1);
  
  function getCurrentTimeIST() {
    var currTimeArrHrMin = [];
    var currentTime = new Date();

    console.log("test", currentTime.getHours());

    var hoursIST = currentTime.getHours();
    var minutesIST = currentTime.getMinutes();

    currTimeArrHrMin.push(hoursIST, minutesIST);
    return currTimeArrHrMin;
  }
  const SendTimeIntervalReminderEmails = async() => {
    let timeNow = getCurrentTimeIST();
    console.log("asdkashdsa", timeNow);

    let db = await LocalConnect();
    // let formData = req.body;

    const CarryForwardFlag=await db.collection("Limits").find({
      COMPANY_ID:"C00001"
    }).toArray()

    console.log("asdkhasdnjhasnd",CarryForwardFlag[0]);

    if(CarryForwardFlag.length>0){
      if(CarryForwardFlag[0].CARRY_FORWARD==true){
        if (timeNow[0] >= 20 && timeNow[0] < 21) {
          axios
            .post("http://localhost:7001/apis/ShiftPayment/ShiftPayment",{
              START_DATE:firstDayOfPreviousMonth,
              END_DATE:lastDayOfPreviousMonth,
              SELECTED_DATE:firstDayOfThisMonth
            })
            .then((response) => {
              console.log("Shift API called");
            })
            .catch((err) => {
              console.log("Something Went wrong while sending reminder mail", err);
            });
    
          setTimeout(SendTimeIntervalReminderEmails, 3600000);
          // setTimeout(SendTimeIntervalReminderEmails, 3600000);
        } else {
          setTimeout(SendTimeIntervalReminderEmails, 3600000);
          console.log("Payment shift scheduler condition failed");
    
          // console.log("New date ", date);
        }
      }{
        setTimeout(SendTimeIntervalReminderEmails, 3600000);

        console.log({
          MESSAGE:"Schedular not active"
        });
      }
    
    }else{
      setTimeout(SendTimeIntervalReminderEmails, 3600000);
      console.log({
        MESSAGE:"Company Not found"
      });
   
    }


   
  };
  SendTimeIntervalReminderEmails();
};

module.exports = PaymentScheduler;