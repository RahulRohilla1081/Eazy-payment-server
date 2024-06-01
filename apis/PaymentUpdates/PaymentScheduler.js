const axios = require("axios");

const PaymentScheduler = () => {
  function getCurrentTimeIST() {
    var currTimeArrHrMin = [];
    var currentTime = new Date();

    console.log("test", currentTime.getHours());

    var hoursIST = currentTime.getHours();
    var minutesIST = currentTime.getMinutes();

    currTimeArrHrMin.push(hoursIST, minutesIST);
    return currTimeArrHrMin;
  }
  const SendTimeIntervalReminderEmails = () => {
    let timeNow = getCurrentTimeIST();
    console.log("asdkashdsa", timeNow);

    if (timeNow[0] >= 23 && timeNow[0] < 24) {
      axios
        .post("http://localhost:7001/apis/UpdatePOsPaymentStatus")
        .then((response) => {
          console.log("API called");
        })
        .catch((err) => {
          console.log("Something Went wrong while sending reminder mail", err);
        });

      setTimeout(SendTimeIntervalReminderEmails, 15000);
      // setTimeout(SendTimeIntervalReminderEmails, 3600000);
    } else {
      setTimeout(SendTimeIntervalReminderEmails, 15000);
      console.log("RF");

      // console.log("New date ", date);
    }
  };
  SendTimeIntervalReminderEmails();
};

module.exports = PaymentScheduler;
