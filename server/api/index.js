const router = require("express").Router();

router.use("/questions", require("./questions"));
router.use("/streaks", require("./streaks"));

router.use((req, res, next) => {
  const err = new Error("API route not found!");
  err.status = 404;
  next(err);
});

module.exports = router;
