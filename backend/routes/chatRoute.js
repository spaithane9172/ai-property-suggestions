const express = require("express");
const aiChat = require("../controllers/chatController.js");

const chatRoute = express.Router();

chatRoute.post("/chat", aiChat.chat);

module.exports = chatRoute;
