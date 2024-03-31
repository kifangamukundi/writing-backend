const express = require("express");
const router = express.Router();
const { onlyAdmin } = require("../middleware/accessControl");

const {
  createOrUpdate, getOne,
} = require("../controllers/achievement");

router.route("/").post(onlyAdmin, createOrUpdate);
router.route("/").get(getOne);

module.exports = router;