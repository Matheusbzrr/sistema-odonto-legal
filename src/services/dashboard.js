const dashRepository = require("../repositories/dashRepository");

const getCasesAndDistrict = async () => {
  const counts = await dashRepository.getCasesAndDistrict();
  return counts;
};

const getCasesByDate = async () => {
    const counts = await dashRepository.getCasesAndDate();
    return counts;
}

module.exports = { getCasesAndDistrict, getCasesByDate };