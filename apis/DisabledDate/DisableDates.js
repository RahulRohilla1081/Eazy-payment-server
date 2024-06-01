var express = require("express");
var router = express.Router();
// const LocalConnect = require("../LocalDB");
const reader = require("xlsx");
const excelToJson = require("convert-excel-to-json");
const fs = require("fs");
const  axios  = require("axios");

// const axios_function_all_APIs_catch = require("../for_programmers/axios_function_all_APIs_catch");

/*   
API url: -   
http://localhost:9000/apis/DisableDates/DisableDates
{ 
    From_Date: "20230901",
    To_Date: "20230921" 
}
*/

router.post("/", async function (req, res, next) {
  try {

    let formData=req.body

    console.log("ASdasdasdas",formData);
    

    axios.post("https://apps.insecticidesindia.com:51200/RESTAdapter/DisableDates",{ 
      From_Date: formData.From_Date,
      To_Date: formData.To_Date 
  }).then((response)=>{
    console.log("Asdasdasd  asbdhjads",response.data);
    if(response.data?.Disable_Dates){
      res.send(response.data?.Disable_Dates)

    }else{
      res.send([])

    }

  }).catch((err)=>{
    console.log("ASasdasd",err);
    res.send([])
  })
    // let db = await LocalConnect();
    // console.log("asdhbsajdas", );

    // const file = reader.readFile(__dirname +"/test.xlsx");
    // let data = [];
    // const sheets = file.SheetNames;
    // console.log("asdasd", sheets);
    // for (let i = 0; i < sheets.length; i++) {
    //   const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[i]]);
    //   console.log("asjdnashdsa", temp);
    //   temp.forEach((res) => {
    //     console.log("asdadasd", res);
    //     data.push(res);
    //   });
    // }
    
//  let result = excelToJson({
//    source: fs.readFileSync(__dirname + "/test.xlsx"), // fs.readFileSync return a Buffer
//    columnToKey: {
//      A: "DATE",
//      B: "TYPE",
//     //  B: "firstName",
//    },
//  });

//  result.Sheet1.splice(0, 1);


 

//     res.send({
//       DISABLED_DATE: result.Sheet1,
//     });



  } catch (e) {
    console.log({ error: e, fileName: __filename });
    // axios_function_all_APIs_catch(__filename, res.statusCode, req.body);

    res.send({ error: e, fileName: __filename });
  }
});

module.exports = router;
