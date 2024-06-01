// var createError = require("http-errors");
var express = require("express");
var path = require("path");
var app = express();
const cors = require("cors");
const http = require("http");
var bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
var cron = require('node-cron');
const axios =require("axios")


app.use(fileUpload());
app.use(function (err, req, res, next) {
  res.setHeader("Access-Control-Allow-Headers", "*");
});



app.use(cors());
app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");


const UpdatePOsPaymentStatus = require("./apis/UpdatePOsPaymentStatus");
const SAPPOsGetRoute = require("./apis/SAPPOsGet");
const DeletePaymentsRoute = require("./apis/DeletePayments");
const updateMaxAmountLimitRoute = require("./apis/updateMaxAmountLimit");
const getMaxAmountLimitRoute = require("./apis/getMaxAmountLimit");
const UserOTPSendRoute = require("./apis/Auth/UserOTPSend");
const UserOTPVerifyRoute = require("./apis/Auth/UserOTPVerify");
const UserPasswordVerifyRoute = require("./apis/Auth/UserPasswordVerify");
const UserSessionTokenVerifyRoute = require("./apis/Auth/UserSessionTokenVerify");
const UserSessionLogoutRoute = require("./apis/Auth/UserSessionLogout");
const DisableDatesRoute = require("./apis/DisabledDate/DisableDates");
const FreezePaymentRoute = require("./apis/PaymentUpdates/FreezePayment");
const UnfreezePaymentRoute = require("./apis/PaymentUpdates/PaymentScheduler");
const FreezeAllPaymentRoute = require("./apis/PaymentUpdates/FreezeAllPayment");
// const UnfreezePaymentRoute = require("./TruncateLocalDB");
const TruncateLocalDB = require("./TruncateLocalDB");
const ShiftPaymentRoute = require("./apis/ShiftPayments/ShiftPayment");
const SavePaymentsRoute = require("./apis/PaymentUpdates/SavePayments");
const PODataSAPSendRoute = require("./apis/PaymentUpdates/PODataSAPSend");
app.use("/apis/UpdatePOsPaymentStatus", UpdatePOsPaymentStatus);
app.use("/apis/SAPPOsGetRoute", SAPPOsGetRoute);
app.use("/apis/DeletePayments", DeletePaymentsRoute);
app.use("/apis/updateMaxAmountLimit", updateMaxAmountLimitRoute);
app.use("/apis/getMaxAmountLimit", getMaxAmountLimitRoute);
app.use("/apis/Auth/UserOTPSend", UserOTPSendRoute);
app.use("/apis/Auth/UserOTPVerify", UserOTPVerifyRoute);
app.use("/apis/Auth/UserPasswordVerify", UserPasswordVerifyRoute);
app.use("/apis/Auth/UserSessionTokenVerify", UserSessionTokenVerifyRoute);
app.use("/apis/Auth/UserSessionLogout", UserSessionLogoutRoute);
app.use("/apis/DisableDates/DisableDates", DisableDatesRoute);
app.use("/apis/PaymentUpdates/FreezePayment", FreezePaymentRoute);
app.use("/apis/PaymentUpdates/PaymentScheduler", UnfreezePaymentRoute);
app.use("/apis/ShiftPayment/ShiftPayment", ShiftPaymentRoute);
app.use("/apis/PaymentUpdates/SavePayments", SavePaymentsRoute);
app.use("/apis/PaymentUpdates/FreezeAllPayment", FreezeAllPaymentRoute);
app.use("/apis/PaymentUpdates/PODataSAPSend", PODataSAPSendRoute);
app.use("/truncate", TruncateLocalDB);



// app.use(express.static(__dirname + "/assets/aadhar_card_upload"));
// app.use(express.static(__dirname + "/assets/pan_card_upload"));
// app.use(express.static(__dirname + "/assets/profile_image_upload"));

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error", {
    message: err.message,
    error: err,
  });
});



cron.schedule('0 0 * * *', () => {
  console.log('running Every day 12 AM');

  //PO send to SAP current +7 days data
  axios
  .post("http://localhost:7001/apis/PaymentUpdates/PODataSAPSend")
  .then((response) => {
    console.log("API called");
  })
  .catch((err) => {
    console.log("Something Went wrong while sending reminder mail", err);
  });
  
});
// cron.schedule('* * * * *', () => {
//   console.log('running Every min');
// });
cron.schedule('0 0 * * *', () => {
  console.log('running Every day 12 AM');

  //PO Payment Status update api
  axios
  .post("http://localhost:7001/apis/UpdatePOsPaymentStatus")
  .then((response) => {
    console.log("API called");
  })
  .catch((err) => {
    console.log("Something Went wrong while sending reminder mail", err);
  });

});


var port =7001

var server=http.createServer(app)
server.listen(port)



// module.exports = app;
