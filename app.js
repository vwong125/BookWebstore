// use express dependency
const express = require('express');

// use path dependency
const path = require('path');

// use mysql dependency
const mysql = require('mysql');

// use bodyParser dependency
const bodyParser = require('body-parser');

// use express-session dependency
const session = require('express-session');

// set up server
const app = express();

// set port number for server
const PORT = 3000;

// set static folder
app.use(express.static(path.join(__dirname)));

// used to extract data from client
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// setUp express-session
app.use(session({ secret: "bookstoredb", saveUninitialized: false }));

// pool used for pooling sql connections
var pool = mysql.createPool({
    host: "dbproject.chw0z33b0eoj.us-west-2.rds.amazonaws.com",
    user: "bookadmin",
    password: "proj1234",
    database: "bookstoredb",
    connectionLimit: 10,
});

// get request for landing page, send search.html upon loading
app.get("/", (req, res) => {
    res.sendFile("search.html", { root: __dirname + "/public" });
});

// get request for /search.html url, send search.html
app.get("/search.html", (req, res) => {
    res.sendFile("search.html", { root: __dirname + "/public" });
});

// get request for /list.html, send list.html
app.get("/list.html", (req, res) => {
    res.sendFile("list.html", { root: __dirname + "/public" });
});

// get request for /book.html, send book.html
app.get("/book.html", (req, res) => {
    res.sendFile("book.html", { root: __dirname + "/public" });
});

// post request from the client 
app.post("/featureBook", (req, res) => {

    // mysql query to find 4 books with the features tag
    let featureBookQuery = `SELECT book_picture, book_title FROM books JOIN book_tags ON books.book_id = 
            book_tags.book_id JOIN tags ON book_tags.tag_id = tags.tag_id WHERE tags.tag_name = "features" ORDER BY RAND() LIMIT 4;`

    // mysql connection to run query; pool.query will automatically released
    // connection once query is finished
    pool.query(featureBookQuery, (err, result) => {
        if (err) throw err;

        res.send(JSON.stringify(result));
    })
})

// post request for the search function on the search page
app.post("/search", function (req, res) {

    // user input; case insensitive; stripped whitespace
    const title = req.body.title.trim().toLowerCase();

    // object to store book results;
    var books = null;

    // object to store tag id if user input is a tag;
    var tagid = null;

    // find all books that have the same name as the user input
    const search_books_query = `SELECT * FROM books WHERE book_title = "${title}"`;

    // find the tag id of the tag with the same name as the user input
    const find_tag_query = `SELECT tag_id FROM tags WHERE tag_name = "${title}"`;

    // Promise to ensure that all queries get completed before sending data
    let promise = new Promise((resolve, reject) => {

        // pool query to run the search_books_query
        pool.query(search_books_query, (err, result) => {
            if (err) throw err;

            // if the query finds an object, then set the books variable to this result
            if (result.length != 0) {
                books = result;
            }
        })

        // Tag promise to ensure that finding the tag_id query occurs first
        // before searching all tags with that tag id
        let tag_promise = new Promise((resolve, reject) => {
            pool.query(find_tag_query, (err, result) => {
                if (err) throw err;

                // if we find a result then resolve the promise
                if (result.length != 0) {
                    tagid = result[0].tag_id;
                    resolve();
                } else {
                    // if we don't find a result, reject the promise
                    reject();
                    console.log("Found No Selections");
                }
            })
        })

        // if promise is resolved then query for all tags with that tag id
        tag_promise.then(() => {
            const search_tag_query = `SELECT * FROM books JOIN book_tags ON books.book_id = book_tags.book_id JOIN tags ON book_tags.tag_id = tags.tag_id WHERE tags.tag_id = ${tagid};`

            if (tagid != null) {
                pool.query(search_tag_query, (err, result) => {
                    if (err) throw err;

                    // if books is currently null, assign books to the result
                    if (books == null) {
                        books = result;

                        // if books is not equal to null then concat the results
                    } else {
                        books.concat(result);
                    }

                    resolve();
                })
            }
        })

        // if the promise failed, just resolve the original promise
        tag_promise.catch(() => {
            resolve();
        })
    })

    // when the promise resolves, then set the session variable to the data and
    // send a result 
    promise.then(() => {
        req.session.searchQuery = JSON.stringify(books);
        res.send("success");
    })
});

// post request for /load_list url on the list page. Send search results to client
app.post("/load_list", (req, res) => {
    res.send(req.session.searchQuery);
})

// post request for /moreInfo url on the list page. Query data for a specified book
app.post("/moreInfo", (req, res) => {
    if (req.body.title) {
        // object to store book information
        let book_information = {};

        // query to find the book information
        let bookInformationQuery = `SELECT * FROM books WHERE book_title = "${req.body.title}"`

        // query to find all tags that the book have
        let tagInformationQuery = `SELECT book_title, tag_name FROM book_tags JOIN tags ON book_tags.tag_id = 
        tags.tag_id JOIN books ON book_tags.book_id = books.book_id WHERE book_title =  "${req.body.title}";`

        // Used for recommendedBook query
        req.session.bookTitle = req.body.title;

        let detailsPromise = new Promise((resolve, reject) => {
            pool.query(bookInformationQuery, (err, result) => {
                if (err) throw err;
                book_information.details = result[0];
                resolve();
            });
        })

        detailsPromise.then(() => {

            pool.query(tagInformationQuery, (err, result) => {
                if (err) throw err;
                req.session.bookTags = result[0];
                book_information.tags = result;
                req.session.bookInfo = JSON.stringify(book_information);
                res.send("success");
            })
        })
    } else {
        res.send("failure");
    }
})

// post request to send information to the client
app.post("/moreBookInfo", (req, res) => {
    res.send(req.session.bookInfo);
})

// post request to get the recommended books on the book page
app.post("/recommendedBooks", (req, res) => {
    
    // stores the tag that the book has
    let bookTag = req.session.bookTags.tag_name;

    // query to find other books with the same tag
    let recommendedBookQuery = `SELECT * FROM books JOIN book_tags ON books.book_id = 
    book_tags.book_id JOIN tags ON book_tags.tag_id = tags.tag_id WHERE tags.tag_name = "${bookTag}" AND books.book_title <> "${req.session.bookTitle}" ORDER BY RAND() LIMIT 3;`

    // queries data and sends information to client
    pool.query(recommendedBookQuery, (err, result) => {
        if (err) {
            throw err;
        }
        res.send(JSON.stringify(result));
    })
})

// port to host the server
app.listen(PORT, (err) => {
    if (err) { console.log("Error"); }
    console.log(`Server started on port ${PORT}`)
});