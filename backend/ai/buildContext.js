function buildContext(properties) {
  return properties
    .map((p, index) => {
      return `
Property ${index + 1}:
- Type: ${p.unitType}
- Location: ${p.location}, ${p.city}
- Price: ₹${p.budget}
- Area: ${p.carpetArea} sqft
- Furnishing: ${p.furnishing}
- Amenities: ${p.amenities}
- Description: ${p.description}
`;
    })
    .join("\n");
}

module.exports = buildContext;
