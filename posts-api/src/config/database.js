const md5 = require("md5");
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("data.db");

const AUTH_SCHEMA = `
CREATE TABLE IF NOT EXISTS auth (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    field TEXT NOT NULL,
    value TEXT NOT NULL
)
`;

const DROP_AUTH_SCHEMA = `
	DROP TABLE IF EXISTS auth;
`;

const INSERT_AUTH = `
    INSERT OR IGNORE INTO auth (
        field,
        value
    ) VALUES (?, ?)
`;

const TAGS_SCHEMA = `
	CREATE TABLE IF NOT EXISTS tags (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		title TEXT NOT NULL,
		content TEXT,
		imageUrl TEXT
	)
`;

const DROP_TAGS_SCHEMA = `
	DROP TABLE IF EXISTS tags;
`;

const INSERT_TAG = `
    INSERT OR IGNORE INTO tags (
        title,
		content,
		imageUrl
    ) VALUES (?, ?, ?)
`;

db.serialize(async () => {
  db.run("PRAGMA foreign_keys=ON");
  db.run(DROP_AUTH_SCHEMA);
  db.run(AUTH_SCHEMA);
  db.run(INSERT_AUTH, ["token", ""]);
  db.run(DROP_TAGS_SCHEMA);
  db.run(TAGS_SCHEMA);

  try {
    db.run(INSERT_TAG, [
      "Javascript",
      "JavaScript é uma linguagem de programação interpretada estruturada, de script em alto nível com tipagem dinâmica fraca e multiparadigma.",
      "https://arquivo.devmedia.com.br/noticias/artigos/artigo_javascript-reduce-reduzindo-uma-colecao-em-um-unico-objeto_37981.jpg",
    ]);
  } catch (e) {
    console.log(`Error: ${e}`);
  }

  db.each("SELECT * FROM tags", (err, contact) => {
    console.log(`Tags: ${JSON.stringify(contact)}`);
  });
});

process.on("SIGINT", () =>
  db.close(() => {
    console.log("DB closed");
    process.exit(0);
  })
);

module.exports = db;
