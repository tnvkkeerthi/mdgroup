const express = require('express');
const router = express.Router();
const expense = require('../controllers/expense.controller');


router.use(function (err, req, res, next) {
    res.status(err.status || 500).json({ status: err.status, message: "Page not found" })
});


//health check 
router.get('/health', (req, res) => {
    const healthcheck = {
      uptime: process.uptime(),
      message: 'Ok',
      date: new Date()
    }
    try {
		res.send(healthcheck);
	} catch (e) {
		healthcheck.message = e;
		res.status(503).send(healthcheck);
	}
});

router.get('/expenses', expense.fetchAllExpenses);
router.get('/expenses/:expenseId', expense.fetchExpenseById);
router.post('/expenses', expense.createExpense);
router.put('/expenses/:expenseId', expense.editExpense);
router.delete('/expenses/:expenseId', expense.deleteExpense);

router.all('/*', (req, res) => {
    res.status(404).json({error: 'No page existing in this path'})
})

module.exports = router;