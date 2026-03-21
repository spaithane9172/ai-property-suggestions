const express = require("express");
const vectorController = require("../controllers/vectorController");
const vectorRoute = express.Router();

vectorRoute.get("/bulk-insert", vectorController.bulkInsert);
vectorRoute.get("/all-vectors", vectorController.viewAllVectorData);
vectorRoute.post("/search-property", vectorController.searchProperty);

module.exports = vectorRoute;
