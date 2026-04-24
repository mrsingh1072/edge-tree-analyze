const express = require("express");
const { postBfhl } = require("../controllers/bfhlController");

const router = express.Router();

router.post("/bfhl", postBfhl);

module.exports = router;

