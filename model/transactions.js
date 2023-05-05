const envelopes = require('../model/envelopes')

const Pool = require('pg').Pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'envelopes',
    password: 'XXXXX',
    port: 5432,
})

const isValidTransaction = async (possibleTransaction) => {
    if(possibleTransaction){
        const {amount,recipient,envelope_id} = possibleTransaction
        const amountRecipient = typeof recipient === 'string' && !isNaN(amount)
        if (amountRecipient){
            const actualEnvelope = await envelopes.getSpecificEnvelope('id',envelope_id)
            return actualEnvelope
        } else {
            return null
        }
    }
    return null
}

const updateEnevelopeProcess = async (category, budget, envelopeToUpdate) => {
    const update = {
        "category" : category,
        "budget" : budget
    }
    await envelopes.updateEnvelope(envelopeToUpdate, update)
    return
}

const addTransaction = async (transaction) => {
    const actualEnvelope = await isValidTransaction(transaction)
    if (!actualEnvelope) return ["envelope doesn't exist", null]
    const envelopeBudget = parseFloat(actualEnvelope.amount)
    const transactionBudget = parseFloat(transaction.amount)
    if (transactionBudget > envelopeBudget) return ["envelope doesn't have the budget",null]
    const updatedEnvelope = {
        "category" : actualEnvelope.envelope_name,
        "budget" : envelopeBudget - transactionBudget
    }
    try {
        const timestampQuery = {
            text: 'select now()'
        }
        const timestamp = await pool.query(timestampQuery)
        const insertQuery = {
            text: 'INSERT INTO transactions (payment_date,payment_amount,payment_recipient,envelope_id) VALUES ($1,$2,$3,$4) RETURNING *',
            values: [/*timestamp.rows[0].now*/'2016-06-22 19:10:25',transaction.amount,transaction.recipient,transaction.envelope_id]
        }
        const [message,newEnvelope] = await envelopes.updateEnvelope(actualEnvelope,updatedEnvelope)
        if(!newEnvelope) return [message,null]
        const insertion = await envelopes.queryGenerator(insertQuery) 
        return ['ok',insertion]
        
    } catch (error) {
        throw error
    }
}


const getTransactions = async () => {
    try {
        var elementsQueried = await pool.query('SELECT * FROM transactions ORDER BY payment_id ASC')
        return elementsQueried.rows;
    } catch (error) {
        throw error
    }
}

const getSpecificTransaction = async (id) => {
    try {
        const query = {
            text: 'SELECT * FROM transactions where payment_id = $1',
            values: [id]
        }
        const specificTransaction = await pool.query(query)
        return specificTransaction.rows[0]
        
    } catch (error) {
        throw error
    }
}


const deleteTransaction = async (actualTransaction) => {
    const query = {
        text: 'DELETE FROM transactions where payment_id = $1 RETURNING *',
        values: [actualTransaction.payment_id]
    }
    const deletedTransaction = await envelopes.queryGenerator(query)
    if(deletedTransaction){
        const actualEnvelope = await envelopes.getSpecificEnvelope('id',deletedTransaction.envelope_id)
        const restoredBudget = deletedTransaction.payment_amount + actualEnvelope.amount
        updateEnevelopeProcess(actualEnvelope.envelope_name,restoredBudget,actualEnvelope)
    }
    return deletedTransaction
}



const updateTransaction = async (actualTransaction,updatedTransaction) => {
    const envelopeTransaction = await isValidTransaction(updatedTransaction)
    if (envelopeTransaction) {
        const envelopeBudget = envelopeTransaction.amount
        const updateTransactionBudget = updatedTransaction.amount
        const actualTransactionBudget = actualTransaction.payment_amount
        if (actualTransaction.envelope_id != envelopeTransaction.envelope_id){
            if (updateTransactionBudget > envelopeBudget) return ["envelope doesn't have the budget",null]
            const envelopeToUpdate = await envelopes.getSpecificEnvelope('id',actualTransaction.envelope_id)
            // const update = {
            //     "category" : envelopeToUpdate.envelope_name,
            //     "budget" : envelopeToUpdate.amount + actualTransactionBudget
            // }
            // await envelopes.updateEnvelope(envelopeToUpdate, update)
            const restoredBudget = envelopeToUpdate.amount + actualTransactionBudget
            updateEnevelopeProcess(envelopeToUpdate.envelope_name, restoredBudget , envelopeToUpdate)
            const updatedBudget = envelopeBudget - updateTransactionBudget
            // const updatedEnvelope = {
            //     "category" : envelopeTransaction.envelope_name,
            //     "budget" : envelopeBudget - updateTransactionBudget
            // }
            // await envelopes.updateEnvelope(envelopeTransaction,updatedEnvelope)
            updateEnevelopeProcess(envelopeTransaction.envelope_name, updatedBudget , envelopeTransaction)
        } else {
            const transactionVariation = updateTransactionBudget - actualTransactionBudget
            if (transactionVariation != 0){
                if(transactionVariation > envelopeBudget) return ["envelope doesn't have the budget",null]
                // const newUpdate = {
                //     "category" : envelopeTransaction.envelope_name,
                //     "budget" : envelopeBudget - transactionVariation
                // }
                // await envelopes.updateEnvelope(envelopeTransaction, newUpdate)
                const budgetCorrection = envelopeBudget - transactionVariation
                updateEnevelopeProcess(envelopeTransaction.envelope_name, budgetCorrection , envelopeTransaction)
            }
        }
        const query = {
            text: 'UPDATE transactions SET payment_amount = $2, payment_recipient = $3, envelope_id = $4 where payment_id = $1 RETURNING *',
            values: [actualTransaction.payment_id,updateTransactionBudget,updatedTransaction.recipient, updatedTransaction.envelope_id]
        }
        const upToDateTransaction = await envelopes.queryGenerator(query)
        return ['ok',upToDateTransaction]
    }
    return ['Not valid transaction format',null]
}

module.exports = {
    addTransaction,
    getTransactions,
    getSpecificTransaction,
    deleteTransaction,
    updateTransaction
}