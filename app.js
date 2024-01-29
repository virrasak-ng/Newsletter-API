const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const emailAdress = req.body.email;
  const url = "https://us21.api.mailchimp.com/3.0/lists/00ce9df4cf";

  const options = {
    method: "POST",
    auth: "daniel:0899f447332768a1bf18b75a08785dcc-us21",
  };

  const data = {
    members: [
      {
        email_address: emailAdress,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
    update_existing: true,
  };

  const jsonData = JSON.stringify(data);

  const request = https.request(url, options, function (response) {
    let statusCode = response.statusCode;
    let responseData = "";

    response.on("data", function (chunk) {
      responseData += chunk;
    });

    response.on("end", function () {
      console.log("Response data:", responseData);

      try {
        const responseDataJSON = JSON.parse(responseData);

        if (statusCode === 200) {
          console.log(responseDataJSON);
          res.redirect("/success");
        } else {
          console.error("Mailchimp API error:", responseDataJSON);
          res.sendFile(__dirname + "/failure.html");
        }
      } catch (jsonError) {
        console.error("JSON Parsing error", jsonError);
        res.sendFile(__dirname + "/failure.html");
      }
    });
  });

  // Make the write call only once
  request.write(jsonData);

  request.on("error", function (error) {
    console.error("Request error:", error);
    res.sendFile(__dirname + "/failure.html");
  });

  // Move the second write call outside the response.on("end") block
  request.end();
});

// Update this route handler for "/success" to handle GET and POST requests
app.all("/success", function (req, res) {
  res.sendFile(__dirname + "/success.html");
});

// Move this outside of the app.post("/") callback
app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Initiating Server Run On Port 3000 ... 🚀");
});
