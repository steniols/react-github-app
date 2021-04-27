const md5 = require("md5");
const sqlite3 = require("sqlite3");
const sql = require("sqlite");

const dbFile = "./data.db";

async function init() {
  try {
    return await sql.open({
      filename: dbFile,
      driver: sqlite3.Database,
    });
  } catch (e) {
    console.error(e);
  }
}

module.exports = init();
