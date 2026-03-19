// function for calling render to keep it up for every 5 mins
const express = require("express");
const router = express.Router();

router.get("/health", (req, res) => {
  res.send("OK");
});

module.exports = router;
