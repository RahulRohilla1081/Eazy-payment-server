var express = require("express");
var router = express.Router();
const hat = require("hat");
const LocalConnect = require("../../LocalDB");
const fast2sms = require("fast-two-sms");
const client = require("twilio")(
  "ACdb7c56927ed1fb9ad58a55ad969213c2",
  "8fcbe2b6660dde900bdb2bae82658eb9"
);

/*   
API url: - 
http://localhost:9000/api/Auth/UserOTPSend

payload:
{
    "CONTACT":"7777040224",
    "PASSWORD":"abcd"
    
}
*/

router.post("/", async function (req, res, next) {
  let formData = await req.body;
  console.log("formData", formData);
  //   let db = await dbConnect();
  let db = await LocalConnect();


  const generateOTP = () => {
    var digits = "0123456789";

    let OTP = "";
    for (let i = 0; i < 6; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
  };
  // ======================================
  const sendOTPtoContact = (userContact, pwMatch) => {
    console.log("AgentData", userContact);
    let GeneratedOTP = generateOTP();

    //Twilio code
    client.messages
      .create({
        body:
          GeneratedOTP +
          " is the OTP to login in your IIL Account. DO NOT disclose it to anyone.Your Safety is our priority.",
        from: "+16508974342",
        to: "+91" + userContact,
      })
      .then((message) => {
        db.collection("users").updateOne(
          { CONTACT: formData.CONTACT },
          { $set: { VERIFICATION_TOKEN: GeneratedOTP } }
        );
        res.send({
          STATUS_CODE: 200,
          OTP_SENT: true,
          USER_EXISTS: true,
          PASSWORD_MATCH: pwMatch,
          Status: "OTP sent and data inserted successfully",
        });
      })
      .catch((err) => {
        console.log(err);
      });

    //twilio code end
  };

  try {
    let user_data = await db
      .collection("users")
      .find({ CONTACT: formData.CONTACT })
      .toArray();
    // console.log("userDATA", user_data);
      sendOTPtoContact(formData.CONTACT, true);

    // let userExist = user_data.some((val) => val.PASSWORD == formData.PASSWORD);
    // if (userExist || (user_data.length > 0 && formData.PASSWORD == "")) {
    //   let pw_match;
    //   if (userExist) {
    //     pw_match = true;
    //   } else {
    //     pw_match = false;
    //   }
    //   sendOTPtoContact(formData.CONTACT, pw_match);
    // } else {
    //   let userExist;
    //   if (user_data.length > 0 && !userExist) {
    //     userExist = true;
    //   } else {
    //     userExist = false;
    //   }
    //   res.send({
    //     STATUS_CODE: 200,
    //     OTP_SENT: false,
    //     USER_EXISTS: userExist,
    //     PASSWORD_MATCH: false,
    //     Status: "OTP not sent",
    //   });
    // }
  } catch (err) {
    console.log(err);
    res.send({ message: "Error in " + __filename });
  }
});

module.exports = router;
