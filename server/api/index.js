const router = require("express").Router();

router.use("/admins", require("./admins"));
router.use("/questions", require("./questions"));
router.use("/streaks", require("./streaks"));
router.use("/contestQuestion", require("./contested_questions"));
router.use("/mailchimp", require("./mailchimp"));
router.use("/tags", require("./tags"));
router.use("/profiles", require("./profiles"));
router.use("/users", require("./users"));

router.use((req, res, next) => {
  const err = new Error("API route not found!");
  err.status = 404;
  next(err);
});

module.exports = router;
