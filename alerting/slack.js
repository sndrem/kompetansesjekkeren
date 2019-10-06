const webhookUrl = process.env.SLACK_WEBHOOK_URL;
const slack = require('slack-notify')(webhookUrl);

const slackNotifiyer = {
    bugs: (text) => {
        slack.send({
            channel: "#bugs",
            text,
        })
    }
}

module.exports = { slack, slackNotifiyer };