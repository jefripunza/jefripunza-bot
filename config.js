const config = {
    app_name: "Keep Smart",

    prefix: "!",
    whatsapp_session: "whatsapp-session.json",

    root: __dirname,

    // MongoDB setup
    mongodb: {
        uri: "mongodb+srv://jefripunza:hanyaakuyangtau123@p34c3-khyrein.9fdur.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
        database: "bot_grup",
    },
}

module.exports = config;