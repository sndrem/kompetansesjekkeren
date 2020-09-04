const mongodb = require('mongodb');
const assert = require('assert');
let db;

// Connection URL
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const url = `mongodb+srv://${user}:${password}@kompetansesjekkeren.b3opu.mongodb.net/<dbname>?retryWrites=true&w=majority`;

const MongoClient = new mongodb.MongoClient(url, {
    useUnifiedTopology: true,
});
// Database Name
const dbName = 'heroku_md2xhk6d';

function connect(callback) {
    // Use connect method to connect to the server
    MongoClient.connect((err, client) => {
        assert.equal(null, err);
        console.log('Connected successfully to database server');

        db = client.db(dbName);
        if (typeof callback === "function") {
            callback();
        }
    });
}

function get() {
    return db;
}

function close() {
    if (db) {
        db.close();
    }
}

module.exports = {
    connect,
    get,
    close,
};
