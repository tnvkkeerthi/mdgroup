process.env.NODE_ENV = 'test';

const mongoose = require("mongoose");
const Expense = require('../models/expense.model.js').expense;

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const should = chai.should();
const basepath = '/expense-app'

chai.use(chaiHttp);

    describe('Expenses routes', () => {
        it('Healthcheck route', (done) => {
            chai.request(app)
                .get(`${basepath}/health`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Ok');
                    res.body.should.have.property('uptime');
                    res.body.should.have.property('date');
                    done();
                });
        });
        it('Invalid route', (done) => {
            chai.request(app)
                .get(`${basepath}/payment`)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error').eql('No page existing in this path');
                    done();
                });
        });
    });