const dashRepository = require("../repositories/dashRepository");

const getCasesAndDistrict = async () => {
  const counts = await dashRepository.getCasesAndDistrict();
  return counts;
};

const getCasesByDate = async () => {
    const counts = await dashRepository.getCasesAndDate();
    return counts;
}

const getCasesByStatus = async () => {
    const counts = await dashRepository.getCasesByStatus();
    return counts;
}

module.exports = { getCasesAndDistrict, getCasesByDate, getCasesByStatus };