const express = require('express');
const path = require('path');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();

const PORT = 3000;

// set static folder
app.use(express.static(path.join(__dirname)));

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
  }));

app.get("/", (req, res) => {
    res.sendFile("search.html", {root: __dirname + "/public"});
});

app.get("/search.html", (req, res) => {
    res.sendFile("search.html", {root: __dirname + "/public"});
});

app.get("/list.html", (req, res) => {
    res.sendFile("list.html", {root: __dirname + "/public"});
});

app.get("/book.html", (req, res) => {
    res.sendFile("book.html", {root: __dirname + "/public"});
});

app.post("/search", function(req, res) {
    
    const title = req.body.title;
   
    var con = mysql.createConnection({
        host: "dbproject.chw0z33b0eoj.us-west-2.rds.amazonaws.com",
        user: "bookadmin",
        password: "proj1234",
        database: "bookstoredb"
    });

    con.createConnection((err) => {
        if (err) {
            throw new err;
        }

        const search_books_query = `SELECT * FROM books WHERE title = ${title}`;
        const search_tag_query = "SELECT * FROM "
    })

    res.send(title);
})

app.listen(PORT, (err) => {
    if(err) {console.log("Error");}
    console.log(`Server started on port ${PORT}`)
});