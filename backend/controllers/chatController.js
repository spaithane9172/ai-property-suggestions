const { askAI } = require("../ai/ollama.js");
const { viewAllVectorData } = require("../vectorDB/vectorModel.js");

const aiChat = {
  chat: async (req, res) => {
    try {
      const { message } = req.body;
      // console.log(message);
      if (!message) {
        res.status(400).json({ message: "Please enter correct question." });
      }
      const msg = await askAI(message, "answer this question");
      res.status(200).json({ message: msg });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error in chat." });
    }
  },
};
module.exports = aiChat;
