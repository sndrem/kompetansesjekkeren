const webhookUrl = process.env.SLACK_WEBHOOK_URL;
const slack = require('slack-notify')(webhookUrl);

module.exports = slack;