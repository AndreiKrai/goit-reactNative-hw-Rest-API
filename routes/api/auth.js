const express = require("express");
const ctrlAuth = require("../../controller/auth");
const {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
} = require("../../models/user");
const validateBody = require("../../middlewares/validateBody");
const authenticate = require("../../middlewares/authenticate");
const upload = require("../../middlewares/upload");
const router = express.Router();

router.post("/register", validateBody(registerSchema), ctrlAuth.register);
router.get("/login", validateBody(loginSchema), ctrlAuth.login);
router.post("/logout", authenticate, ctrlAuth.logout);
router.get("/current", authenticate, ctrlAuth.getCurrent);
router.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  ctrlAuth.updateAvatar
);
router.get("/verify/:verificationToken", ctrlAuth.verifyUser);
router.post("/verify", validateBody(verifyEmailSchema), ctrlAuth.resendEmail);
module.exports = router;
