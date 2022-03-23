const router = require("express").Router();
const axios = require("axios");

const {
  models: { User },
} = require("../db");

const { requireToken } = require("./middleware");

const getDailyEmailSubscriptionStatus = async (id) => {
  const dailyStatus = await axios({
    method: "GET",
    url: `https://us20.api.mailchimp.com/3.0/lists/${process.env.MAILCHIMP_DAILY_ID}/members/${id}`,
    headers: {
      Authorization: process.env.MAILCHIMP_API_KEY,
    },
  })
    .then((response) => {
      return response.data.status;
    })
    .catch((error) => {
      return error;
    });

  return dailyStatus;
};

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

const updateEmailSubscriptionDaily = async (id, status) => {
  await axios({
    method: "PATCH",
    url: `https://us20.api.mailchimp.com/3.0/lists/${process.env.MAILCHIMP_DAILY_ID}/members/${id}`,
    headers: {
      Authorization: process.env.MAILCHIMP_API_KEY,
    },
    data: {
      status,
    },
  }).catch((error) => console.log(error));
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

exports.subscribeToDailyEmails = async (user) => {
  const mailchimpId = await axios({
    method: "POST",
    url: `https://us20.api.mailchimp.com/3.0/lists/${process.env.MAILCHIMP_DAILY_ID}/members`,
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
    const { daily, weekly } = req.body;
    console.log(daily, weekly);
    let mailchimpId = null;
    if (daily) {
      // if they want to subscribe and are not already, subscribe to daily
      mailchimpId = await this.subscribeToDailyEmails(req.user);
      // then take that mailchimp id and use it to add them to the weekly emails
    } else {
      console.log("subscribe only to weekly");
      // mailchimpId =
    }
    console.log(mailchimpId);
    await User.update({ mailchimpId }, { where: { id: req.user.id } });

    res.json({
      dailyStatus: daily ? "subscribed" : null,
      weeklyStatus: weekly ? "subscribed" : null,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/:mailchimpId", requireToken, async (req, res, next) => {
  try {
    const { mailchimpId } = req.params;

    const dailyStatus = await getDailyEmailSubscriptionStatus(mailchimpId);
    const weeklyStatus = await getWeeklyEmailSubscriptionStatus(mailchimpId);

    res.json({ dailyStatus, weeklyStatus });
  } catch (err) {
    next(err);
  }
});

router.patch("/:mailchimpId", requireToken, async (req, res, next) => {
  try {
    const { mailchimpId } = req.params;

    const { dailyUpdate, weeklyUpdate } = req.body;
    if (req.body.dailyUpdate) {
      await updateEmailSubscriptionDaily(mailchimpId, dailyUpdate);
    }

    if (req.body.weeklyUpdate) {
      await updateEmailSubscriptionWeekly(mailchimpId, weeklyUpdate);
    }

    res.json({ dailyStatus: dailyUpdate, weeklyStatus: weeklyUpdate });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
