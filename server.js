const express = require("express");
const http = require("http");
const cors = require("cors");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const bodyParser = require("body-parser");
const app = express();
require("dotenv").config();


const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const refreshToken = process.env.REFRESH_TOKEN;
const redirectURI = "https://developers.google.com/oauthplayground";

const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectURI);
oAuth2Client.setCredentials({refreshToken: refreshToken});

const buildEmail = async (email) => {
    try {
        const transportData = {
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: "zanecosmo@gmail.com",
                clientId: clientId,
                clientSecret: clientSecret,
                refreshToken: refreshToken
            }
        };
        
        let transporter = nodemailer.createTransport(transportData);

        const message = {
            from: "zanecosmo <zanecosmo@gmail.com>",
            to: "zanecosmo@gmail.com",
            subject: "E-MAIL SENT",
            text: `NAME: ${email.name}, E-MAIL: ${email.email}, MESSAGE: ${email.message}`
        }

        const result = await transporter.sendMail(message);
        return result;

    } catch (error) {return error};
}

const corsOptions = {origin: ["http://127.0.0.1:5501"]};

app.options("/send-email", cors(corsOptions));
app.use(bodyParser.json());

app.post("/send-email", cors(corsOptions), (req, res) => {
    buildEmail(req.body)
        .then((result) => console.log(result))
        .catch((error) => console.log(error.message));
    res.send(req.body);
});

const server = http.createServer(app);
const port = 4000;

server.listen(port, () => console.log(`LISTENING on PORT ${port}`));

