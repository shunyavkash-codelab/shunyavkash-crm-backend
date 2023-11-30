const express = require("express");
const router = express.Router();

// Default routes
router.get("/", (req, res) => res.status(200).json({ message: "ok" }));

router.post("/", (req, res) =>
  res.status(401).json({ message: "not authorized" })
);

router.patch("/", (req, res) =>
  res.status(401).json({ message: "not authorized" })
);

router.put("/", (req, res) =>
  res.status(401).json({ message: "not authorized" })
);

router.delete("/", (req, res) =>
  res.status(401).json({ message: "not authorized" })
);

module.exports = router;
