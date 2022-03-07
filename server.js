const express = require("express");
const http = require("http");
const cors = require("cors");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const app = express();
require("dotenv").config();


const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const refreshToken = process.env.REFRESH_TOKEN;

console.log(`CLIENT-ID: ${process.env.CLIENT_ID}`);
console.log(`CLIENT-SECRET: ${process.env.CLIENT_SECRET}`);
console.log(`REFRESH-TOKEN: ${process.env.REFRESH_TOKEN}`);

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

app.options("/send-email", cors());
app.use(cors());
app.use(bodyParser.json());

app.post("/send-email", (req, res) => {
    buildEmail(req.body)
        .then((result) => console.log(result))
        .catch((error) => console.log(error.message));
    res.send(req.body);
});

const server = http.createServer(app);
const port = process.env.PORT || 4000;

server.listen(port, () => console.log(`LISTENING on PORT ${port}`));

