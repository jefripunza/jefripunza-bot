const { MongoClient } = require("mongodb");
const config = require('../../config');

const monggodb = new MongoClient(config.mongodb.uri, { useNewUrlParser: true, useUnifiedTopology: true });
// global.monggodb = monggodb;
global.first_db = true;
monggodb.connect((error, client) => {
    if (error) {
        global.monggodb = false;
        console.log("Error connecting to MongoDB! ", { error });
        if (global.first_db) {
            process.exit(1);
        }
    }
    console.log("MongoDB Connected!");
    global.first_db = false;
    client.close();
});
