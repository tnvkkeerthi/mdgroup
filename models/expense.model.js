const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// schema of the expense
const expenseSchema = new Schema({
    description: Schema.Types.String,
    value: Schema.Types.Number,
    type: { type: String, enum: ['Entertainment', 'Food', 'Bills' , 'Transport', 'Other'] }
});


// middleware to save createdat, updatedat times
expenseSchema.pre('save', function(next){
  let now = new Date();
    this.updated_at = now;
    if ( !this.created_at ) {
      this.created_at = now;
    }
    next();
  });

// model
const expense = mongoose.model('Expense', expenseSchema, 'Expense');

module.exports = {
    expense: expense
};
