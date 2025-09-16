// middlewares/validateDrug.js
const Drug = require('../model/model'); // model Mongoose

async function validateDrug(req, res, next) {
  const { name, dosage, card, pack, perDay } = req.body;

  // a. Name > 5
  if (!name || name.length <= 5) {
    return res.status(400).json({ error: "Name must be longer than 5 characters." });
  }

  // b. Dosage
  const dosagePattern = /^\d+-morning,\d+-afternoon,\d+-night$/;
  if (!dosage || !dosagePattern.test(dosage)) {
    return res.status(400).json({ error: "Dosage must follow XX-morning,XX-afternoon,XX-night format." });
  }

  // c. Card > 1000
  const cardNum = Number(card);
  if (isNaN(cardNum) || cardNum <= 1000) {
    return res.status(400).json({ error: "Card must be greater than 1000." });
  }

  // d. Pack > 0
  const packNum = Number(pack);
  if (isNaN(packNum) || packNum <= 0) {
    return res.status(400).json({ error: "Pack must be greater than 0." });
  }

  // e. PerDay >0 and <90
  const perDayNum = Number(perDay);
  if (isNaN(perDayNum) || perDayNum <= 0 || perDayNum >= 90) {
    return res.status(400).json({ error: "PerDay must be greater than 0 and less than 90." });
  }

  // f. Check trùng name trong DB
  try {
    const existing = await Drug.findOne({ name });
    if (existing) {
      return res.status(400).json({ error: "Drug name already exists." });
    }
  } catch (err) {
    return res.status(500).json({ error: "Database error." });
  }

  // Hợp lệ → đi tiếp
  next();
}

module.exports = validateDrug;
