var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET database information */
router.get('/bookcodes', function(req, res, next) {

  // Get the database
  var db = new sqlite3.Database('data/db_3005winter2015');

  // Initialize the bookcodes array
  var bookcodes = [];

  // Do the thing
  db.serialize(function() {

    // Create table in the current database
    db.run("CREATE TABLE IF NOT EXISTS bookcodes (code text primary key not null, title text not null, format text, filename text, page_offset integer);");
    db.run("CREATE TABLE IF NOT EXISTS songs (id integer primary key not null, bookcode text, page integer, title text);");

    console.log("SELECT * FROM bookcodes");

    db.each("SELECT * FROM bookcodes", function(err, row) {

      bookcode = {};
      bookcode.code = row.code;
      bookcode.title = row.title;
      bookcode.format = row.format;
      bookcode.filename = row.filename;
      bookcode.page_offset = row.page_offset;
      bookcodes.push(bookcode);

    }, function(err, n) {

      // Close the database connection and send the result
      db.close();
      res.send(JSON.stringify(bookcodes));

    });
  });

});

router.get('/songs', function(req, res, next) {

  // Get the database
  var db = new sqlite3.Database('data/db_3005winter2015');

  // Initialize the songs array
  var songs = [];

  // Get any specified filters
  var filterText = req.query.filterText || '';
  var book = req.query.book;

  // Do the thing
  db.serialize(function() {

    // Create table in the current database
    db.run("CREATE TABLE IF NOT EXISTS bookcodes (code text primary key not null, title text not null, format text, filename text, page_offset integer);");
    db.run("CREATE TABLE IF NOT EXISTS songs (id integer primary key not null, bookcode text, page integer, title text);");

    var statement = db.prepare("SELECT * FROM songs WHERE title LIKE '%' || ? || '%'" + (book ? " AND bookcode = '" + book + "'" : '') + " LIMIT 200;");

    statement.each(filterText, function(err, row) {

      if(!err && row) {
        song = {};
        song.id = row.id;
        song.bookcode = row.bookcode;
        song.page = row.page;
        song.title = row.title;
        songs.push(song);
      }

    }, function(err, n) {
      
      // Close the database connection and send the result
      db.close();
      res.send(JSON.stringify(songs));

    });

    statement.finalize();

  });

});


// For deleting a song
router.delete('/songs', function(req, res, next) {

  // Get the database
  var db = new sqlite3.Database('data/db_3005winter2015');

  // Get any specified filters
  var id = req.query.id;

  if(!id) {

    // Close the database and send an empty response
    db.close();
    res.status(404);
    res.send();

  }

  // Do the thing
  db.serialize(function() {

    var statement = db.prepare("DELETE FROM songs WHERE id = ?;");

    statement.run(id, function(err) {

      console.log("Everything is just ducky.");

      // Close the database connection
      db.close();
      res.send();

    });

    statement.finalize();

  });

});


// For updating a song
router.post('/songs', function(req, res, next) {

  // Get the database
  var db = new sqlite3.Database('data/db_3005winter2015');

  // Get update information and escape single quotes
  var id = req.query.id;
  var bookcode = req.query.bookcode.replace("'", "''");
  var title = req.query.title.replace("'", "''");
  var page = req.query.page;

  if(!id || !bookcode || !title || !page) {

    // Close the database and send an empty response
    db.close();
    res.status(404);
    res.send();

  }

  // Do the thing
  db.serialize(function() {

    var statement = db.prepare("UPDATE songs SET bookcode = ?, title = ?, page = ? WHERE id = ?;");

    statement.run(bookcode, title, page, id, function(err) {

      console.log("Everything is just ducky.");

      // Close the database connection
      db.close();
      res.send();

    });

    statement.finalize();

  });

});


module.exports = router;
