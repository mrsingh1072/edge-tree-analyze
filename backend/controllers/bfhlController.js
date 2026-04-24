const { analyzeEdgeList } = require("../utils/treeProcessor");

function getIdentity() {
  return {
    user_id: process.env.USER_ID || "yourname_ddmmyyyy",
    email_id: process.env.EMAIL_ID || "your_college_email@example.edu",
    college_roll_number: process.env.COLLEGE_ROLL_NUMBER || "your_roll_number",
  };
}

function badRequest(message) {
  const err = new Error(message);
  err.status = 400;
  return err;
}

async function postBfhl(req, res, next) {
  try {
    const body = req.body;
    if (!body || typeof body !== "object") throw badRequest("Body must be JSON.");
    if (!Array.isArray(body.data)) throw badRequest('"data" must be an array of strings.');

    const result = analyzeEdgeList(body.data);
    res.status(200).json({ ...getIdentity(), ...result });
  } catch (e) {
    next(e);
  }
}

module.exports = { postBfhl };

