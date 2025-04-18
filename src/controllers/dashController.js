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
module.exports = { getCasesAndDistrict };
