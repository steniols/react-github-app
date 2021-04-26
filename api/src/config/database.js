const md5 = require("md5");
const sqlite3 = require("sqlite3").verbose();

const fs = require("fs");
const dbFile = "./data.db";
const dbExists = fs.existsSync(dbFile);

if (!dbExists) {
  fs.openSync(dbFile, "w");
}

const db = new sqlite3.Database(dbFile);

const AUTH_SCHEMA = `
CREATE TABLE IF NOT EXISTS auth (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    token TEXT NOT NULL
)
`;

const DROP_AUTH_SCHEMA = `
	DROP TABLE IF EXISTS auth;
`;

const TAGS_SCHEMA = `
	CREATE TABLE IF NOT EXISTS tags (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		title TEXT NOT NULL,
		content TEXT,
		imageUrl TEXT,
    userId INTEGER
	)
`;

const REL_SCHEMA = `
	CREATE TABLE IF NOT EXISTS rel_tags_repository (
		tagId INT NOT NULL,
		repositoryId INT NOT NULL,
    PRIMARY KEY (tagId, repositoryId)
	)
`;

const DROP_TAGS_SCHEMA = `
	DROP TABLE IF EXISTS tags;
`;

const INSERT_TAG = `
    INSERT OR IGNORE INTO tags (
        title,
		content,
		imageUrl,
    userId
    ) VALUES (?, ?, ?, ?)
`;

db.serialize(async () => {
  if (!dbExists) {
    db.run("PRAGMA foreign_keys=ON");
    db.run(DROP_AUTH_SCHEMA);
    db.run(AUTH_SCHEMA);
    db.run(DROP_TAGS_SCHEMA);
    db.run(TAGS_SCHEMA);
    db.run(REL_SCHEMA);

    try {
      db.run(INSERT_TAG, [
        "Javascript",
        "JavaScript é uma linguagem de programação interpretada estruturada, de script em alto nível com tipagem dinâmica fraca e multiparadigma.",
        "https://arquivo.devmedia.com.br/noticias/artigos/artigo_javascript-reduce-reduzindo-uma-colecao-em-um-unico-objeto_37981.jpg",
        9152758,
      ]);
    } catch (e) {
      console.log(`Error: ${e}`);
    }

    db.each("SELECT * FROM tags", (err, contact) => {
      console.log(`Tags: ${JSON.stringify(contact)}`);
    });
  }
});

process.on("SIGINT", () =>
  db.close(() => {
    console.log("DB closed");
    process.exit(0);
  })
);

module.exports = db;
