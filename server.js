const express = require("express");
const exphbs = require("express-handlebars");
const mysql = require("mysql");

const app = express();

const PORT = process.env.PORT || 3000;

// Parse req.body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "fatbeats",
  database: "movie_planner_db",
});

connection.connect((err) => {
  if (err) {
    console.error(`error connecting: ${err.stack}`);
    return;
  }
  console.log(`connected as id ${connection.threadId}`);
});

// Render index.html with movie data
app.get('/', (req, res) => {
  connection.query('select * from movies', (err, data) => {
    if (err) return res.status(500).end();
    res.render("index", { movies: data });
  });
});

// Post new movie to database
app.post('/api/movies', (req, res) => {
  connection.query('insert into movies (movie) values (?)', [req.body.movie], (err, result) => {
    if (err) return res.status(500).end();

    res.json({ id: result.insertId });
    console.log({ id: result.insertId });
  })
})


app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));