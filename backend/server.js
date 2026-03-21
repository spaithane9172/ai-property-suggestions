const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const chatRoute = require("./routes/chatRoute.js");
const vectorRoute = require("./routes/vectorRoute.js");

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:3000"],
  }),
);

app.use("/api", chatRoute);
app.use("/api", vectorRoute);

app.listen(PORT, () => {
  console.log("Server started on port : ", PORT);
});
