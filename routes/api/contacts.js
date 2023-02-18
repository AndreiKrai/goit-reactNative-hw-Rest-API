const express = require("express");
const router = express.Router();
const ctrlContact = require("../../controller/contact");
const { addShema, updateFavoriteSchema } = require("../../models/contact");
const validateBody = require("../../middlewares/validateBody");
const authenticate = require("../../middlewares/authenticate");
// const { validateBody } = require("../../middlewares");

router.get("/", authenticate, ctrlContact.get);

router.get("/:contactId", authenticate, ctrlContact.getById);

router.post("/", authenticate, validateBody(addShema), ctrlContact.create);

router.put(
  "/:contactId",
  authenticate,
  validateBody(addShema),
  ctrlContact.update
);

router.patch(
  "/:contactId/favorite",
  authenticate,
  validateBody(updateFavoriteSchema),
  ctrlContact.updateStatusContact
);

router.delete("/:contactId", authenticate, ctrlContact.remove);

module.exports = router;
