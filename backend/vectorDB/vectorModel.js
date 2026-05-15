const client = require("../ai/qdrant");
const getEmbedding = require("../vectorDB/generateEmbedding");
const formatProperty = require("../vectorDB/formatProperty");
const propertiesModel = require("../models/properties");

async function ensureCollection() {
  const collections = await client.getCollections();
  const exists = collections.collections.some((c) => c.name === "properties");

  if (!exists) {
    await client.createCollection("properties", {
      vectors: {
        size: 384,
        distance: "Cosine",
      },
    });
    console.log("Collection created.");
  }
}

async function bulkInsert() {
  await ensureCollection();
  const properties = await propertiesModel.getProperties();
  console.log("Total Properties : ", properties.length);
  for (const p of properties) {
    const text = formatProperty(p);

    const vector = await getEmbedding(text);

    await client.upsert("properties", {
      points: [
        {
          id: p.id,
          vector: vector,
          payload: {
            propertyId: p.propertyId,
            location: p.location,
            price: p.budget,
            type: p.unitType,
          },
        },
      ],
    });
    console.log("Inserted : ", p.propertyId);
  }
  console.log("All data inserted into vector db.");
  return "All data inserted into vector db.";
}

async function viewAllVectorData() {
  await ensureCollection();
  const result = await client.scroll("properties", {
    limit: 5,
    with_payload: true,
    with_vector: false,
  });
  console.log("v result : ", JSON.stringify(result));
  // console.log(JSON.stringify(result.points, null, 2));
  return result;
}

async function searchProperty(query) {
  await ensureCollection();
  const vector = await getEmbedding(query);
  const result = await client.search("properties", {
    vector: vector,
    limit: 3,
    with_payload: true,
  });
  return result;
}

const vectorModel = {
  bulkInsert,
  viewAllVectorData,
  searchProperty,
};
module.exports = vectorModel;
