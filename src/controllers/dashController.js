const dashService = require("../services/dashboard");

const getCasesAndDistrict = async (req, res) => {
  try {
    const data = await dashService.getCasesAndDistrict();

    return res.json(data);
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ message: err.message });
    }
    return res.status(500).json({ message: err.message });
  }
};

const getCasesByDate = async (req, res) => {
  try {
    const data = await dashService.getCasesByDate();

    return res.json(data);
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ message: err.message });
    }
    return res.status(500).json({ message: err.message });
  }
};

const getCasesByStatus = async (req, res) => {
  try {
    const data = await dashService.getCasesByStatus();

    return res.json(data);
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ message: err.message });
    }
    return res.status(500).json({ message: err.message });
  }
};

const getVitimsByStatusOfIdentification = async (req, res) => {
  try {
    const data = await dashService.getVitimsByStatusOfIdentification();

    return res.json(data);
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ message: err.message });
    }
    return res.status(500).json({ message: err.message });
  }
};
module.exports = { getCasesAndDistrict, getCasesByDate, getCasesByStatus, getVitimsByStatusOfIdentification };
