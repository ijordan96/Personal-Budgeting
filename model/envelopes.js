
/*For this project I will consider a budget envelope as an object with the next body:
{
    "category" : name of the category for the envelope
    "budget" : budget use for the category
}
*/


const Pool = require('pg').Pool
const pool = new Pool({
  user: 'XXXXX',
  host: 'localhost',
  database: 'envelopes',
  password: 'XXXXXX',
  port: 5432,
})

const isValidEnvelope = (possibleEnvelope) => {
    if(possibleEnvelope){
        const {category, budget} = possibleEnvelope
        return typeof category === 'string' && !isNaN(budget)
    }
    return false
}

const queryGenerator = async (query) => {
    const client = await pool.connect()
    try {
        await client.query('BEGIN')
        const newEnvelope = await client.query(query)
        await client.query('COMMIT')
        return newEnvelope.rows[0]
        
    } catch (error) {
        await client.query('ROLLBACK')
        throw error
    } finally{
        client.release()
    }

}


const getAllEnvelopes = async() => {
    try {
        var elementsQueried = await pool.query('SELECT * FROM envelopes ORDER BY envelope_id ASC')
        return elementsQueried.rows;
    } catch (error) {
        throw error
    }
}

const getSpecificEnvelope = async (type, id) => {
    var text;
    if (type === 'id') {
        text = 'SELECT * FROM envelopes where envelope_id = $1 ORDER BY envelope_id ASC'
    } else {
        text = 'SELECT * FROM envelopes where envelope_name = $1 ORDER BY envelope_id ASC'
    }
    try {
        const query = {
            text: text,
            values: [id]
        }
        const specifcEnvelope = await pool.query(query)
        return specifcEnvelope.rows[0]
        
    } catch (error) {
        throw error
    }
}

const addEnvelope = async (envelope) => {
    if (isValidEnvelope(envelope)){
        envelope.budget = parseFloat(envelope.budget)
        const query = {
            text: 'INSERT INTO envelopes (envelope_name,amount) VALUES ($1,$2) RETURNING *',
            values: [envelope.category,envelope.budget]
        } 
        const newEnvelope = await queryGenerator(query)
        return ['ok',newEnvelope]
    }
    return ['Not valid envelope format',null]
}


const updateEnvelope = async (actualEnvelope, updatedEnvelope) => {
    if (isValidEnvelope(updatedEnvelope)) {
        updatedEnvelope.budget = parseFloat(updatedEnvelope.budget)
        const query = {
            text: 'UPDATE envelopes SET envelope_name = $2, amount = $3 where envelope_id = $1 RETURNING *',
            values: [actualEnvelope.envelope_id,updatedEnvelope.category,updatedEnvelope.budget]
        }
        const newEnvelope = await queryGenerator(query)
        return ['ok',newEnvelope]
    }
    return ['Not valid envelope format',null]
}

const deleteEnvelope = async (actualEnvelope) => {
    const query = {
        text: 'DELETE FROM envelopes where envelope_id = $1 RETURNING *',
        values: [actualEnvelope.envelope_id]
    }
    const deletedEnvelope = await queryGenerator(query)
    return deletedEnvelope
}


const transferEnvelope = async (from, to, transferBudget) => {
    const resolvedValues = {}
    var updatedFrom;
    var updatedTo;
    if(!isNaN(transferBudget)){
        transferBudget = parseFloat(transferBudget)
        const newFromAmount = from.amount - transferBudget
        if (newFromAmount > 0){
            const newFrom = {
                "category" : from.envelope_name,
                "budget" : newFromAmount
            }
            updatedFrom = await updateEnvelope(from,newFrom)
            const newToAmount = to.amount + transferBudget
            const newTo = {
                "category" : to.envelope_name,
                "budget" : newToAmount
            }
            updatedTo = await updateEnvelope(to,newTo)
            resolvedValues.updatedFrom = updatedFrom
            resolvedValues.updatedTo = updatedTo
            return ['ok',resolvedValues]
        }
        [`transfer amount is higher than actual amount on envelope '${from.envelope_id}'`,null]
    }
    return ['Not valid transfer budget',null]
}




module.exports = {
    getSpecificEnvelope,
    getAllEnvelopes, 
    addEnvelope,
    updateEnvelope, 
    deleteEnvelope, 
    transferEnvelope,
    queryGenerator
}
