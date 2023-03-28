const webhookUrl = process.env.SLACK_WEBHOOK_URL;
import SlackNotify from "slack-notify";
const slack = SlackNotify(webhookUrl!);

export const slackNotifyer = {
  utvikling: (text: string) => {
    slack
      .send({
        channel: "#utvikling",
        text,
      })
      .catch((err) => console.log(err));
  },
};
