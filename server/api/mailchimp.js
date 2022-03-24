const router = require("express").Router();
const axios = require("axios");

const {
  models: { User },
} = require("../db");

const { requireToken } = require("./middleware");

const getWeeklyEmailSubscriptionStatus = async (id) => {
  const weeklyStatus = await axios({
    method: "GET",
    url: `https://us20.api.mailchimp.com/3.0/lists/${process.env.MAILCHIMP_WEEKLY_ID}/members/${id}`,
    headers: {
      Authorization: process.env.MAILCHIMP_API_KEY,
    },
  })
    .then((response) => {
      return response.data.status;
    })
    .catch((err) => {
      return err;
    });

  return weeklyStatus;
};

const updateEmailSubscriptionWeekly = async (id, status) => {
  await axios({
    method: "PATCH",
    url: `https://us20.api.mailchimp.com/3.0/lists/${process.env.MAILCHIMP_WEEKLY_ID}/members/${id}`,
    headers: {
      Authorization: process.env.MAILCHIMP_API_KEY,
    },
    data: {
      status,
    },
  }).catch((error) => console.log(error));
};

const subscribeToWeeklyEmails = async (user) => {
  const mailchimpId = await axios({
    method: "POST",
    url: `https://us20.api.mailchimp.com/3.0/lists/${process.env.MAILCHIMP_WEEKLY_ID}/members`,
    headers: {
      Authorization: process.env.MAILCHIMP_API_KEY,
    },
    data: {
      email_address: user.email,
      status: "subscribed",
      merge_fields: {
        FNAME: user.firstName,
        LNAME: user.lastName,
      },
    },
  })
    .then((response) => {
      return response.data.id;
    })
    .catch((error) => {
      console.log(error, "ERROR");
    });
  return mailchimpId;
};

router.post("/", requireToken, async (req, res, next) => {
  try {
    const mailchimpId = await subscribeToWeeklyEmails(req.user);

    await User.update({ mailchimpId }, { where: { id: req.user.id } });

    res.json({
      status: "subscribed",
    });
  } catch (err) {
    next(err);
  }
});

router.get("/:mailchimpId", requireToken, async (req, res, next) => {
  try {
    const { mailchimpId } = req.params;

    const status = await getWeeklyEmailSubscriptionStatus(mailchimpId);

    res.json({ status });
  } catch (err) {
    next(err);
  }
});

router.patch("/:mailchimpId", requireToken, async (req, res, next) => {
  try {
    const { mailchimpId } = req.params;
    const { update } = req.body;

    const status = await updateEmailSubscriptionWeekly(mailchimpId, update);

    res.json({ status });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
