const { Ollama } = require("ollama");

const ollama = new Ollama();

async function askAI(userQuery, properties) {
  console.log("pp", properties, userQuery);
  const finalPrompt = `
You are a real estate response formatter.

Your ONLY job is to present database results
in a user-friendly way.

STRICT RULES:
- ONLY use the provided database data
- NEVER create imaginary data
- NEVER assume missing values
- NEVER modify any value
- NEVER add extra information
- NEVER add marketing language
- NEVER explain missing fields
- All prices provided in database data are already in INR
- NEVER convert currency
- NEVER use USD or dollars
- Display prices only in ₹ format
- If a field is missing, ignore it

IMPORTANT:
- Response style MUST depend on the user's question
- Use ONLY fields present in database data
- The database data is already correct
- Your job is ONLY formatting and presentation
- you have only 150 tokens limit for response creation so strictly generate response which is full in that limit.

User Question:
${userQuery}

Database Data:
${JSON.stringify(properties, null, 2)}

Generate a short, clean, user-friendly response.
`;

  const response = await ollama.chat({
    model: "qwen2.5:7b",
    messages: [{ role: "user", content: finalPrompt }],
    options: {
      num_predict: 150,
    },
  });
  return response.message.content;
}

async function generateSQL(message) {
  const finalPrompt = `
You are a MySQL query generator for a real estate application.

You can ONLY answer questions related to properties and real estate.

If the question is not related to properties,
reply EXACTLY:

NOT_PROPERTY_QUERY

Database Table Schema:

properties(
  id,
  propertyId,
  sellerName,
  propertyType,
  propertySubtype,
  unitType(2BHK, 1BHK, 4BHK,.....),
  wing,
  unitNo,
  furnishing,
  parkingType,
  parkingQty,
  city,
  location,
  society,
  floor,
  totalFloors,
  carpetArea,
  builtupArea,
  budget,
  address,
  status(Available, Under Construction),
  leadSource,
  possessionMonth,
  possessionYear,
  purchaseMonth,
  purchaseYear,
  sellingRights,
  description,
  isPublic,
  publicationDate,
  amenities,
  furnishingItems,
  photoCount
)

STRICT RULES:
- ONLY generate SELECT queries
- NEVER generate DELETE, UPDATE, INSERT, DROP
- Return ONLY raw SQL
- NO markdown
- NO explanation
- ALWAYS use LIMIT 3 unless user specifies limit
- Use LIKE for text search when needed
- Budget means property price
- Use city and location properly
- Ignore spelling mistakes if understandable

Example:

User:
show me 2 properties in pune

Output:
SELECT * FROM properties
WHERE city LIKE '%Pune%'
LIMIT 2;

User Question:
${message}
`;

  const response = await ollama.chat({
    model: "phi3",
    messages: [
      {
        role: "user",
        content: finalPrompt,
      },
    ],
    options: {
      temperature: 0,
      num_predict: 150,
    },
  });
  console.log("sq", response);
  let sql = response.message.content.trim();

  // Remove markdown
  sql = sql.replace(/```sql/gi, "");
  sql = sql.replace(/```/g, "");

  // Remove escaped newlines
  sql = sql.replace(/\\n/g, " ");

  // Remove real newlines
  sql = sql.replace(/\n/g, " ");

  // Clean extra spaces
  sql = sql.replace(/\s+/g, " ").trim();

  // Reject non-property queries
  if (sql === "NOT_PROPERTY_QUERY") {
    return {
      success: false,
      message: "I am only allowed to answer property-related questions.",
    };
  }

  // Security validation
  const lower = sql.toLowerCase();

  const blockedWords = [
    "delete",
    "drop",
    "truncate",
    "update",
    "insert",
    "alter",
    "create",
  ];

  const hasBlockedWord = blockedWords.some((word) => lower.includes(word));

  if (!lower.startsWith("select") || hasBlockedWord) {
    return {
      success: false,
      message: "Unsafe query generated.",
    };
  }

  return {
    success: true,
    sql,
  };
}

module.exports = { askAI, generateSQL };
