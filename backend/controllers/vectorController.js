const buildContext = require("../ai/buildContext");
const askAI = require("../ai/ollama");
const propertiesModel = require("../models/properties");
const vectorModel = require("../vectorDB/vectorModel");

const vectorController = {
  bulkInsert: async (req, res) => {
    try {
      await vectorModel.bulkInsert();
      res.status(200).json({ message: "All data inserted into vector db." });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  viewAllVectorData: async (req, res) => {
    try {
      const result = await vectorModel.viewAllVectorData();
      res
        .status(200)
        .json({ data: JSON.parse(result), message: "Vectors All Data." });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  searchProperty: async (req, res) => {
    try {
      const { query } = req.body;
      const result = await vectorModel.searchProperty(query);
      const propertiesData = [];
      console.log(result);
      if (result.length === 0) {
        res.status(200).json({
          data: "No suitable property found",
          message: "Property found",
        });
        return;
      }
      for (let p of result) {
        const property = await propertiesModel.getPropertyById(p.id);
        propertiesData.push(property);
      }

      const context = await buildContext(propertiesData);
      const msg = await askAI(query, context);
      res.status(200).json({ data: msg, message: "Property found" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

module.exports = vectorController;
