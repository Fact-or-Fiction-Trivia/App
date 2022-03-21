const sgMail = require("@sendgrid/mail");
module.exports = ({ to, accessToken }) => {
  sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
  const msg = {
    from: "info@factorfictiontrivia.com",
    subject: "Password Reset",
    template_id: "d-527faf9388de4869aab1f36d714e3446",
    to,
    dynamic_template_data: {
      resetLink: `${
        process.env.NODE_ENV !== "production"
          ? process.env.DEV_BASE_URL
          : process.env.PROD_BASE_URL
      }/forgot-password/${accessToken}`,
    },
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
};
