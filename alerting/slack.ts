const webhookUrl = process.env.SLACK_WEBHOOK_URL;
const slack = require("slack-notify")(webhookUrl);

export const slackNotifiyer = {
  utvikling: (text) => {
    slack.send({
      channel: "#utvikling",
      text,
    });
  },
};
