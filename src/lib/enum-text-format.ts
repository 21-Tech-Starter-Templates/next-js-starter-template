// ✅ Utility: format ENUM style strings like "HIGHER_SECONDARY_SCHOOL"
const formatTextEnum = (value?: string) =>
  value
    ?.toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ') ?? '';

export { formatTextEnum };
