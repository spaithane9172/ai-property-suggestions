const db = require("../config/db");

const propertiesModel = {
  getProperties: async () => {
    try {
      const [rows] = await db.query("SELECT * FROM properties");
      return rows;
    } catch (error) {
      console.log(error);
    }
  },

  getPropertyById: async (id) => {
    try {
      const [[rows]] = await db.query("SELECT * FROM properties where id = ?", [
        id,
      ]);
      return rows;
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = propertiesModel;
