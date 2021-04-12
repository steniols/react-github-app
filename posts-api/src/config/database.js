const md5 = require("md5");
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("data.db");

const USERS_SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL
)
`;

const DROP_USERS_SCHEMA = `
	DROP TABLE IF EXISTS users;
`;

const INSERT_USER = `
    INSERT OR IGNORE INTO users (
        name,
        email,
        password
    ) VALUES (?, ?, ?)
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

const INSERT_POST = `
    INSERT OR IGNORE INTO tags (
        title,
		content,
		imageUrl
    ) VALUES (?, ?, ?)
`;

db.serialize(async () => {
  db.run("PRAGMA foreign_keys=ON");
  db.run(DROP_USERS_SCHEMA);
  db.run(USERS_SCHEMA);
  db.run(INSERT_USER, ["Admin", "admin@teste.com.br", md5("123456")]);
  db.run(DROP_TAGS_SCHEMA);
  db.run(TAGS_SCHEMA);

  try {
    db.run(INSERT_POST, [
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
