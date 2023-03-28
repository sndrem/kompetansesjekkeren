const webhookUrl = process.env.SLACK_WEBHOOK_URL;
import SlackNotify from "slack-notify";
const slack = SlackNotify(webhookUrl);

export const slackNotifiyer = {
  utvikling: (text) => {
    slack.send({
      channel: "#utvikling",
      text,
    });
  },
};
