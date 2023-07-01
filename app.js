
const express = require("express");

const bodyParser = require ("body-parser");

const request = require("request");

const https = require ("https");

const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/index.html");
});


app.post("/", function (req, res){
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const emailAdress = req.body.email;
  const url = "https://us21.api.mailchimp.com/3.0/lists/00ce9df4cf";
  const options = {
    method:"POST",
    auth: "daniel:12fae95f23742f10d9619c2f1b3ab079-us21"
  };

  const data = {
    members: [
      {
      email_address: emailAdress,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }
  ]
  };

  var jsonData = JSON.stringify(data); 

  const request = https.request (url, options, function(response){
    
    if (response.statusCode === 200){
      res.sendFile (__dirname + "/sucess.html");
    } else {
      res.sendFile (__dirname + "/failure.html");
    };
    
    response.on("data", function (data){
      console.log(JSON.parse(data));
    })
  })

  request.write(jsonData);
  request.end();

});

app.post("/failure", function(req, res){
  res.redirect("/");
})


app.listen(process.env.PORT || 3000, function (){
  console.log("Initiating Server Run On Port 3000 ... 🚀")
});

// 12fae95f23742f10d9619c2f1b3ab079-us21 apikey
// 00ce9df4cf unique ID


