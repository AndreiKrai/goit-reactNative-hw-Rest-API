const express = require("express");
const ctrlAuth = require("../../controller/auth");
const { schemas } = require("../../models/user");
const validateBody = require("../../middlewares/validateBody");
// const { validateBody } = require("../../middlewares");
const router = express.Router();

router.post(
  "/register",
  validateBody(schemas.registerSchema),
  ctrlAuth.register
);
router.post("/login", validateBody(schemas.loginSchema), ctrlAuth.login);

module.exports = router;
