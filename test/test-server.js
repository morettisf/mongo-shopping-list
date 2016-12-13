global.DATABASE_URL = 'mongodb://localhost/shopping-list-test';

var chai = require('chai');
var chaiHttp = require('chai-http');

var server = require('../server.js');
var Item = require('../models/item');

var should = chai.should();
var app = server.app;
var itemsData = {}
chai.use(chaiHttp);

describe('Shopping List', function() {
    
    before(function(done) {
        server.runServer(function() {
            Item.create({name: 'Broad beans'},
                        {name: 'Tomatoes'},
                        {name: 'Peppers'}, function(err, beans, tomatoes, peppers) { //this is the callback function we're going to console log to see ID values
                        console.log(arguments)
                        itemsData.beans = beans
                        itemsData.tomatoes = tomatoes
                        itemsData.peppers = peppers
                done();
            });
        });
    });
    
    it('get - should list items on get', function(done) {
        chai.request(app)
        .get('/items')
        .end(function(err, res) {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('array');
            res.body.should.have.length(3);
            res.body[0].should.be.a('object');
            res.body[0].should.have.property('_id');
            res.body[0].should.have.property('name');
            res.body[0]._id.should.be.a('string');
            res.body[0].name.should.be.a('string');
            res.body[0].name.should.equal('Broad beans');
            res.body[1].name.should.equal('Tomatoes');
            res.body[2].name.should.equal('Peppers');
            done();
        });
    });
    
    it('post - should add an item on post', function(done) {
      chai.request(app)
        .post('/items')
        .send({'name': 'Kale'})
        .end(function(err, res) {
          should.equal(err, null);
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('name');
          res.body.should.have.property('_id');
          res.body.name.should.be.a('string');
          res.body._id.should.be.a('string');
          res.body.name.should.equal('Kale');
          done();
        });
    });

    it('post - if no name in request body', function(done) {
      chai.request(app)
        .post('/items')
        .send({'hats': 2})
        .end(function(err, res) {
          res.should.have.status(500);
          done();
        });
    });
    
    
    it('put - should edit an item on put', function(done) {
      chai.request(app)
        .put('/items/' + itemsData.beans._id)
        .send({'name': 'beats', _id: itemsData.beans._id})
        .end(function(err, res) {
          res.should.have.status(200);
          done();
        })
    });


    it('put - if no item ID exists to edit', function(done) {
      chai.request(app)
        .put('/items/15')
        .send({'name': 'beats', 'id': 15})
        .end(function(err, res) {
          res.should.have.status(404);
          done();
        })
    });
    
    
    it('put - if no ID in endpoint', function(done) {
      chai.request(app)
        .put('/items')
        .send({'name': 'beats'})
        .end(function(err, res) {
          res.should.have.status(404);
          done();
        })
    });
    
    it('put - if no body data exists', function(done) {
      chai.request(app)
      .put('/items/1')
      .send({})
      .end(function(err, res) {
        res.should.have.status(404);
        done();
      })
    });
    
    it('put - if diffrent ID in endpoint than body', function(done) {
      chai.request(app)
      .put('/items/1')
      .send({'name': 'beats', 'id': 2})
      .end(function(err, res) {
        res.should.have.status(404);
        done();
      })
    });

    it('put - if with something other than valid JSON', function(done) {
      chai.request(app)
      .put('/items/1')
      .send('item')
      .end(function(err, res) {
        res.should.have.status(404);
        done();
      })
    });
    
    it('delete - should delete an item on delete', function(done) {
      chai.request(app)
        .delete('/items/' + itemsData.beans._id)
        .end(function(err, res) {
          res.should.have.status(200);
          done();
        })
    });
    
    it('delete - if no ID exists to delete', function(done) {
      chai.request(app)
        .delete('/items/12')
        .end(function(err, res) {
          res.should.have.status(404);
          done();
        })
    });
    
    it('delete - if no ID exists in endpoint', function(done) {
      chai.request(app)
        .delete('/items')
        .end(function(err, res) {
          res.should.have.status(404);
          done();
        })
    })
    
    after(function(done) {
        Item.remove(function() {
            done();
        });
    });
    
});