process.env.NODE_ENV = 'test';

const mongoose = require("mongoose");
const Expense = require('../models/expense.model.js').expense;

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const should = chai.should();
const basepath = '/expense-app'

let testData_expenseId;
chai.use(chaiHttp);



describe('Expenses', () => {
    describe('/GET expense', () => {
        it('it should GET all the expenses', (done) => {
            chai.request(app)
                .get(`${basepath}/expenses`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.expenses.should.be.a('array');
                    done();
                });
        });
    });

    describe('/POST expense', () => {
        it('it should not POST a expense', (done) => {
            const expense = {
                "description": "medicines",
                "value": 12.2,
                "type": "medic"
            }
            chai.request(app)
                .post(`${basepath}/expenses`)
                .send(expense)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    done();
                });
        });
        it('it should POST a expense ', (done) => {
            const expense = {
                "description": "medicines",
                "value": 12,
                "type": "Other"
            }
            chai.request(app)
                .post(`${basepath}/expenses`)
                .send(expense)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Successfully created the expense');
                    res.body.expense.should.have.property('_id');
                    res.body.expense.should.have.property('description');
                    res.body.expense.should.have.property('value');
                    res.body.expense.should.have.property('type');
                    done();
                    testData_expenseId = res.body.expense._id
                });
        });
    });

    describe('/GET/:id expense', () => {
        let expenseId = '61e728b195e7872864a52490'
        it('it should GET a expense by the given id', (done) => {
            chai.request(app)
                .get(`/expense-app/expenses/${testData_expenseId}`)
                .send(expenseId)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('_id');
                    res.body.should.have.property('description');
                    res.body.should.have.property('value');
                    res.body.should.have.property('type');
                    res.body.should.have.property('_id').eql(testData_expenseId);
                    done();
                });
        });
        it('it should not GET a expense for invalid id', (done) => {
            chai.request(app)
                .get(`/expense-app/expenses/61e728b195e7872864a5249`)
                .send(expenseId)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    done();
                });
        });
    });
    
    describe('/PUT/:id expense', () => {
        it('it should UPDATE a expense given the id', (done) => {
            chai.request(app)
                .put(`${basepath}/expenses/${testData_expenseId}`)
                .send({
                    "description": "medicines",
                    "value": 17,
                    "type": "Other"
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Successfully updated the expense');
                    res.body.expense.should.have.property('value').eql(17);
                    done();
                });
        });
        it('it should not UPDATE a expense given invalid id', (done) => {
            let invalidIDError = `Sorry! Couldn't edit the Expense : Please try with a valid ID`;
            chai.request(app)
                .put(`${basepath}/expenses/61e72de37359536678881e5`)
                .send({
                    "description": "medicines",
                    "value": 17,
                    "type": "Other"
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error').eql(invalidIDError);
                    done();
                });
        });
        it('it should not UPDATE a expense given invalid type   ', (done) => {
            let invalidTypeError = `Sorry! Couldn't edit the Expense : The type of expense should only belong to category Entertainment, Food, Bills, Transport, Other. Please try saving with one of the above options`
            chai.request(app)
                .put(`${basepath}/expenses/${testData_expenseId}`)
                .send({
                    "description": "medicines",
                    "value": 17,
                    "type": "Medicines"
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error').eql(invalidTypeError);
                    done();
                });
        });
    });

    describe('/DELETE/:id expense', () => {
        it('it should DELETE a expense given the id', (done) => {
            let expenseId = `Sorry! Couldn't delete the Expense : Please try deleting with a valid expense ID`
            chai.request(app)
                .delete(`${basepath}/expenses/${testData_expenseId}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql(`Expense with id ${testData_expenseId} deleted successfully.`);
                    done();
                });
        });
        it('it should not DELETE a expense given the invalid id', (done) => {
            let errorMessage = `Sorry! Couldn't delete the Expense : Please try deleting with a valid expense ID`
            chai.request(app)
                .delete(`${basepath}/expenses/61e72de37359536678881e5`)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error').eql(errorMessage);
                    done();
                });
        });
    });
});