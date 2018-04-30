module.exports = {
    tmi: {
        options: {
            debug: true
        },
        connection: {
            reconnect: true
        },
        identity: {
            username: "",
            password: "oauth:",
        },
        channels: ["#twitch"]
    }
}