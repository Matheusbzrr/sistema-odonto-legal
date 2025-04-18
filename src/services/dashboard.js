const dashRepository = require("../repositories/dashRepository");

const getCasesAndDistrict = async () => {
  const counts = await dashRepository.getCasesAndDistrict();
  return counts;
};

module.exports = { getCasesAndDistrict };