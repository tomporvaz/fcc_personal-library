/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var ObjectId = require('mongodb').ObjectId;
const MONGODB_CONNECTION_STRING = process.env.DB;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.set('useFindAndModify', false);

//connect to database using mongoose
mongoose.connect(process.env.DB)

//from quick start guide in mongoose docs
let db = mongoose.connection;
db.on("error", console.error.bind(console, 'connection error'));
db.once('open', function (){
  console.log("DB sucess using mongoose!")
});

//issue schema and model
const bookSchema = new Schema({
  title: {type: String, required: true},
  comments: [String]
});

const Book = mongoose.model('Book', bookSchema);
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {
  
  app.route('/api/books')
  .get(function (req, res){
    //response will be array of book objects
    //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    Book.find(function(err, books){
      if(err){console.error(err)};
      //count comments and build response objects in array with map
      const newArrayOfBooks = books.map(book => {
        return {
          _id: book._id,
          title: book.title,
          commentcount: book.comments.length
        }
      })
      res.json(newArrayOfBooks);
    })
  })
  
  .post(function (req, res){
    //response will contain new book object including atleast _id and title
    const book = new Book({title: req.body.title});
    
    //enter logic to handle when POST logic does not have a title
    if(book.title){
      book.save(function(err, savedBook){
        if(err){console.error(err)};
        res.json(savedBook)
      });
    } else if(!book.title){
      res.send('missing title');
    }
  })
  
  .delete(function(req, res){
    //if successful response will be 'complete delete successful'
  });
  
  
  
  app.route('/api/books/:id')
  .get(function (req, res){
    var bookId = req.params.id;
    console.log(bookId);
    //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    
    Book.findById(bookId)
    .then(returnedBook => {
      if(returnedBook){
        let newBook =  {
          _id: returnedBook._id,
          title: returnedBook.title,
          comments: returnedBook.comments
        }
        res.json(newBook);
      } else if(!returnedBook){
        res.send('no book exists');
      }
    })
    .catch(err => console.error(err));
  })
  
  .post(function(req, res){
    var bookId = req.params.id;
    var comment = req.body.comment;
    //json res format same as .get
    Book.findById(bookId)
    .then(returnedBook => {
      returnedBook.comments.push(comment);
      return returnedBook;
    })
    .then(updatedBook => updatedBook.save())
    .then(savedBook => res.json(savedBook))
    .catch(err => console.error(err));
  })
  
  .delete(function(req, res){
    var bookid = req.params.id;
    //if successful response will be 'delete successful'
  });
  
};
