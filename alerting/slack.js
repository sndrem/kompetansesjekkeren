const webhookUrl = process.env.SLACK_WEBHOOK_URL;
const slack = require('slack-notify')(webhookUrl);

const slackNotifiyer = {
    utvikling: (text) => {
        slack.send({
            channel: "#utvikling",
            text,
        })
    }
}

module.exports = { slack, slackNotifiyer };