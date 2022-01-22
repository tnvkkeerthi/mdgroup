const Expense = require('../models/expense.model').expense;
const signale = require('signale-logger');


module.exports = {
    /**
     * Retrieves the array of all Expense Objects documents saved in the collection, with all its fields in its key-value JSON pair format
     */
    fetchAllExpenses: (req, res) => {
        const serviceName = "fetchAllExpenses";

    try{    
        Expense.find((err, expenses) => {

                if (err) {
                    signale.error(`${serviceName} :: Couldn't fetch the expenses list `)
                    return res.status(400).json({ error: "Sorry! Couldn't fetch the Expenses list." });
                }

                signale.success("Expenses fetched successfully", JSON.stringify(expenses))
                res.status(200).json({
                    expenses: expenses
                });
            })
    }
    catch(e){
        signale.error("error while executing the function : ", e);
        res.status(400).json({ error : `Error in fetching the expenses : ${e}`})
    }
    },


    /**
    * Saves the Expense Object to Database as per the Request Payload matching the Model Schema
    */
    createExpense: (req, res) => {
        const serviceName = "createExpense";
        const newExpense = new Expense(req.body);

        try { 
              newExpense.save((err, expense) => {
            if (err) {
                let response = {};
                signale.error(`${serviceName} :: Error in creating expense : ${err}`)
                if(err.errors && err.errors.type && err.errors.type.kind && err.errors.type.kind == 'enum'){
                    response.error = `The type of expense should only belong to category Entertainment, Food, Bills, Transport, Other. Please try saving with one of the above options`
                }
                else {
                 response.error = `Error in creating the expense ${err}`
                }
                return res.status(400).json(response);
            }
            signale.success("Successfully created the expense", expense)
            res.status(200).json({message: "Successfully created the expense", expense: expense});
        })

        } catch(error) {
            return res.status(400).json({ error: `Sorry! Error creating Expense : ${error}` });
        }
        
    },

    /**
     * 	Retrieves the Expense Object with all its fields in its key-value JSON pair format. Id is passed as path param in the URL
     */
    fetchExpenseById: (req, res, next) => {
        const serviceName = "fetchExpenseById";

        Expense.findById(req.params.expenseId)
            .then(doc => {
                signale.success(`Expense fetched successfully :  ${doc}`)
                return res.status(200).json(doc);
            })
            .catch(function (err) {
                signale.error(`${serviceName} :: Couldn't fetch the expense : ${err}`)
                console.log(err)
                return res.status(400).send({ error: "Sorry! Couldn't fetch the Expense" });
            });
    },

    /**
     * Edits and Updates single or multiple fields of the Expense Object in DB
     */
    editExpense: (req, res, next) => {
        const serviceName = "editExpense";

        Expense.findByIdAndUpdate(req.params.expenseId, {
            $set: req.body
        },
            { new: true , runValidators: true }, (err, updatedExpense) => {
                if (err) {
                    if(err.errors && err.errors.type && err.errors.type.kind && err.errors.type.kind == 'enum'){
                        signale.error(`${serviceName} :: Couldn't edit the expense ${err}`);
                         return res.status(400).json({ error: `Sorry! Couldn't edit the Expense : The type of expense should only belong to category Entertainment, Food, Bills, Transport, Other. Please try saving with one of the above options`});
                         }
                    else {
                        signale.error(`${serviceName} :: Couldn't edit the expense ${err}`);
                        return res.status(400).json({ error: `Sorry! Couldn't edit the Expense : Please try with a valid ID` });
                    }  
                }
                signale.success(`Updated the expense successfully :  ${updatedExpense}`)
                res.status(200).json({message: "Successfully updated the expense", expense: updatedExpense});
            })
    },

    /** 
     * Deletes the Expense Object from DB collection
     */
    deleteExpense: (req, res, next) => {
        const serviceName = "deleteExpense";

        Expense.findByIdAndRemove(req.params.expenseId, function (err, deletedExpense) {
            if (err) {
                signale.error(`${serviceName} :: Couldn't delete the expense`)
                return res.status(400).json({ error: `Sorry! Couldn't delete the Expense : Please try deleting with a valid expense ID` });
            }
            else if(!deletedExpense){
                signale.info("No expense existing with the given ID")
                return res.status(400).json({ error: "No expense existing with the given ID" });
            }
            signale.success("Expense deleted successfully" , deletedExpense)
            res.status(200).json({ message: `Expense with id ${req.params.expenseId} deleted successfully.` });
        });
    }
}