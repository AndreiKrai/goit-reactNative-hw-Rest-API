const express = require("express");
const ctrlAuth = require("../../controller/auth");
const { registerSchema, loginSchema } = require("../../models/user");
const validateBody = require("../../middlewares/validateBody");
const authenticate = require("../../middlewares/authenticate");
const router = express.Router();

router.post("/register", validateBody(registerSchema), ctrlAuth.register);
router.post("/login", validateBody(loginSchema), ctrlAuth.login);
router.get("/logout", authenticate, ctrlAuth.logout);
router.get("/current", authenticate, ctrlAuth.getCurrent);

module.exports = router;
