const express = require('express')
const transactionsRouter = express.Router()
const transactions = require('../model/transactions')

transactionsRouter.post('/', async (req, res, next) => {
    const [message, transactionDone ]= await transactions.addTransaction(req.body)
    if (transactionDone){
        return res.send({
            'response' : "Transaction added succesfully",
            'transactionDone' : transactionDone
        })
    }
    res.status(400).send({
        'response' : `Transaction not possible: ` + message
    })
})

transactionsRouter.get('/', async (req, res, next) => {
    var specificTransaction;
    if(!req.query.id){
        const allTransactions = await transactions.getTransactions()
        return res.send(
            {allTransactions}
            )
    }
    specificTransaction = await transactions.getSpecificTransaction(req.query.id)
    if (!specificTransaction){
        return  res.status(404).send({
            'response' : "Transaction doesn't exist"
        })
    }
    res.status(200).json(specificTransaction)
})

transactionsRouter.param('id', async (req,res,next,id) => {
    const transactionExists = await await transactions.getSpecificTransaction(id)
    if(!transactionExists){
      return  res.status(404).send({
        'response' : "Transaction doesn't exist"
        })
    }
    req.transactionExists = transactionExists
    next()
})

transactionsRouter.put('/:id', async (req, res, next) => {
    const actualTransaction = req.transactionExists
    const [message, updatedTransaction] = await transactions.updateTransaction(actualTransaction,req.body)
    if(updatedTransaction){
        return res.send({
            'response' : 'Transaction Updated',
            'updatedTransaction' : updatedTransaction
        })
    }
    res.status(400).send({
        'response' : "It wasn't possible to update the transaction: " + message
    })
})

transactionsRouter.delete('/:id', async (req, res, next) => {
    const actualTransaction = req.transactionExists
    const deletedTransaction = await transactions.deleteTransaction(actualTransaction)
    if (deletedTransaction){
        res.status(200).send({
            'response' : "Envelope Deleted",
            'deletedTransaction' : deletedTransaction
        })
    } 
})




module.exports = transactionsRouter