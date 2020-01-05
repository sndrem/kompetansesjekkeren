const db = require("../database/mongodb");
const SEARCHES_COLLECTION = "searches";

const dbService = {
    lagreSok: (sokeverdi, user) => {
        db
            .get()
            .collection(SEARCHES_COLLECTION)
            .insertOne({
                organisasjonsnummer: sokeverdi,
                timestamp: new Date().toISOString(),
                user: user
            })
    }
}

module.exports = dbService;