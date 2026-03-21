function formatProperty(p) {
  return `
${p.unitType} ${p.propertySubtype} in ${p.location}, ${p.city}.
Price ${p.budget}.
Carpet area ${p.carpetArea} sqft.
Furnishing ${p.furnishing}.
Amenities ${p.amenities}.
Description: ${p.description}
`;
}

module.exports = formatProperty;
