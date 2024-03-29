const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("db.json");
const db = low(adapter);

db.defaults({
  sistOppdatert: Date.now(),
  vatromsregister: [],
  mesterbrev: [],
  renholdsregister: [],
}).write();

export {db};
