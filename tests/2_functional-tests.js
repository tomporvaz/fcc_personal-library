/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  let testBookId = '';

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
    chai.request(server)
    .get('/api/books')
    .end(function(err, res){
      assert.equal(res.status, 200);
      assert.isArray(res.body, 'response should be an array');
      assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
      assert.property(res.body[0], 'title', 'Books in array should contain title');
      assert.property(res.body[0], '_id', 'Books in array should contain _id');
      done();
    });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */
  
  suite('Routing tests', function() {
    
    
    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
        .post('/api/books')
        .send({title: `Tom's Book of Stories`})
        .end(function(err, res){
          testBookId = res.body._id;
          assert.equal(res.status, 200);
          assert.property(res.body, 'title');
          assert.equal(res.body.title, `Tom's Book of Stories`);
          assert.property(res.body, 'comments');
          assert.isArray(res.body.comments);
          assert.property(res.body, '_id');
          done();
        });
      });
        
        test('Test POST /api/books with no title given', function(done) {
          chai.request(server)
          .post('/api/books')
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.text, "missing title");
            done();
          })
        });
        
      });
      
      
      suite('GET /api/books => array of books', function(){
        
        test('Test GET /api/books',  function(done){
          chai.request(server)
          .get(`/api/books`)
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.property(res.body[0], '_id');
            assert.property(res.body[0], 'title');
            assert.property(res.body[0], 'commentcount');
            assert.isNumber(res.body[0].commentcount);
            done();
          })
        });      
      });
      
      
      suite('GET /api/books/[id] => book object with [id]', function(){
        
        test('Test GET /api/books/[id] with id not in db',  function(done){
          chai.request(server)
          .get(`/api/books/5da22b49dc8265007daed36d`)
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists')
            done();
          })
        });
        
        test('Test GET /api/books/[id] with valid id in db',  function(done){
          chai.request(server)
          .get(`/api/books/${testBookId}`)
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.property(res.body, '_id');
            assert.equal(res.body._id, testBookId);
            assert.property(res.body, 'title');
            assert.equal(res.body.title, `Tom's Book of Stories`);
            assert.property(res.body, 'comments');
            assert.isArray(res.body.comments);
            done();
          })
        });
        
      });
      
      
      suite('POST /api/books/[id] => add comment/expect book object with id', function(){
        
        test('Test POST /api/books/[id] with comment', function(done){
          chai.request(server)
          .post(`/api/books/${testBookId}`)
          .send({comment: `Silly bear, tests are for routes!`})
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.property(res.body, '_id');
            assert.equal(res.body._id, testBookId);
            assert.property(res.body, 'title');
            assert.equal(res.body.title, `Tom's Book of Stories`);
            assert.property(res.body, 'comments');
            assert.isArray(res.body.comments);
            assert.equal(res.body.comments[0], `Silly bear, tests are for routes!`);
            done();
          })
        });
        
      });
      
    });
    
  });
