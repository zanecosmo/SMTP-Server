require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const app = express();


const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const refreshToken = process.env.REFRESH_TOKEN;

console.log(process.env);

const emailRouter = {
    ["ZANE"]: "zanecosmo@gmail.com",
    ["GAGE"]: "primelandandhome@gmail.com"
};

const buildEmail = async (sender) => {
    try {
        const transportData = {
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: "zanessmtpserver@gmail.com",
                clientId: clientId,
                clientSecret: clientSecret,
                refreshToken: refreshToken
            }
        };
        
        let transporter = nodemailer.createTransport(transportData);

        const message = {
            from: "Contact Form Submission <zanessmtpserver@gmail.com>",
            to: emailRouter[sender.identifier],
            subject: `Message From: ${sender.name}`,
            text: `NAME: ${sender.name}, E-MAIL: ${sender.email}, MESSAGE: ${sender.message}`
        }

        const result = await transporter.sendMail(message);
        return result;

    } catch (error) {return error};
};

const corsOptions = {origin: "https://zanecosmo.com"};
// const corsOptions = {origin: "http://127.0.0.1:5500"}

app.options("/send-email", cors(corsOptions));
app.use(bodyParser.json());

app.post("/send-email", cors(corsOptions), (req, res) => {
       console.log("WE RECIEVED A REQUEST");
       buildEmail(req.body)
        .then((result) => console.log(result))
        .catch((error) => console.log(error.message));
    res.send(req.body);
});

const server = http.createServer(app);
const port = process.env.PORT;

server.listen(port, () => console.log(`LISTENING on PORT ${port}`));

