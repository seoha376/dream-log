const generateDreamSummary = async (content) => {
  if (!content) {
    return "";
  }

  const trimmedContent = content.trim();

  if (trimmedContent.length <= 120) {
    return trimmedContent;
  }

  return `${trimmedContent.slice(0, 120)}...`;
};

module.exports = {
  generateDreamSummary
};