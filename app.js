const express = require('express');
const path = require('path');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();

const PORT = 3000;

// set static folder
app.use(express.static(path.join(__dirname)));

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(session({ secret: "bookstoredb", saveUninitialized: false}));

app.get("/", (req, res) => {
    res.sendFile("search.html", { root: __dirname + "/public" });
});

app.get("/search.html", (req, res) => {
    res.sendFile("search.html", { root: __dirname + "/public" });
});

app.get("/list.html", (req, res) => {
    res.sendFile("list.html", { root: __dirname + "/public" });
});

app.get("/book.html", (req, res) => {
    res.sendFile("book.html", { root: __dirname + "/public" });
});

app.post("/search", function (req, res) {

    const title = req.body.title.trim().toLowerCase();
    var re = new RegExp(';')
    var test = re.test(title);

    if (test) {
        console.log("failed");

    } else {

        var books = null;
        var tagid = null;
        var books_with_tags = null;

        var con = mysql.createConnection({
            host: "dbproject.chw0z33b0eoj.us-west-2.rds.amazonaws.com",
            user: "bookadmin",
            password: "proj1234",
            database: "bookstoredb"
        });

        const search_books_query = `SELECT * FROM books WHERE book_title = "${title}"`;
        const find_tag_query = `SELECT tag_id FROM tags WHERE tag_name = "${title}"`;
        
        let promise = new Promise((resolve, reject) => {
            con.connect((err) => {
                if (err) {
                    throw err;
                }
    
                con.query(search_books_query, (err, result) => {
                    if (err) {
                        console.log("Error");
                    } else {
                        if (result.length != 0) {
                            books = result;
                        }
                    }
                })
    
                let tag_promise = new Promise((resolve, reject) => {
                    con.query(find_tag_query, (err, result) => {
                        if (err) {
                            console.log("Error");
                        } 
                        if (result.length != 0) {
                            tagid = result[0].tag_id;
                            resolve();
                        } else {
                            reject();
                            console.log("Found No Selections");
                        }
                    })
                })

                tag_promise.then(() => {
                    const search_tag_query = `SELECT * FROM books JOIN book_tags ON books.book_id = book_tags.book_id JOIN tags ON book_tags.tag_id = tags.tag_id WHERE tags.tag_id = ${tagid};`

                    if (tagid != null) {
                        con.query(search_tag_query, (err, result) => {
                            if (err) {
                                console.log("error");
                            }
                            console.log(result);
                            if (books == null) {
                                books = result;
                  
                            } else if (books.length > 0) {
                                books.concat(result);
                            }
                        })
                    }

                    con.end((err) => {
                        if (err) {
                            throw err;
                        }
                        console.log("Database connection closed");
                        resolve();
                    })
                })
                
                tag_promise.catch(() => {
                    con.end((err) => {
                        if (err) {
                            throw err;
                        }
                        console.log("Database connection closed");
                        resolve();
                    })
                })

            });
        })

        promise.then(() => {
            req.session.searchQuery = JSON.stringify(books);
            console.log(req.session.searchQuery);
            res.send("success");

        })
       
    }
});



app.listen(PORT, (err) => {
    if (err) { console.log("Error"); }
    console.log(`Server started on port ${PORT}`)
});