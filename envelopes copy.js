const envelopes = [
    {
        "category": "savings",
        "budget": 750
    },
    {
        "category": "Dinners",
        "budget": 250
    },
    {
        "category": "Grocery",
        "budget": 350
    }
]
/*For this project I will consider a budget envelope as an object with the next body:
{
    "category" : name of the category for the envelope
    "budget" : budget use for the category
}
*/
const axios = require('axios');
const instance = axios.create({
    baseURL: 'http://localhost:4001/',
    timeout: 10000
})
const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'envelopes',
  password: 'anubis4252',
  port: 5432,
})



const isValidEnvelope = (possibleEnvelope) => {
    if(possibleEnvelope){
        const {category, budget} = possibleEnvelope
        return typeof category === 'string' && !isNaN(budget)
    }
    return false
}

const envelopeExist = (category) => {
    return envelopes.findIndex((envelope) => {
        return envelope.category === category 
    })
}


const addEnvelope = (envelope) => {
    if (isValidEnvelope(envelope)){
        envelope.budget = parseFloat(envelope.budget)
        envelopes.push(envelope)
        return true
    }
    return false
}

const getAllEnvelopes =  (request, response) => {
    pool.query('SELECT * FROM envelope ORDER BY envelope_id ASC', (error, results) => {
        if (error) {
          throw error
        }
        const returningValues = {
            "registers" : results.rows
        }
        response.status(200).json(returningValues) 
    })
}




const getSpecificEnvelope = (category,request,response) => {
    const query = {
        text: 'SELECT * FROM envelope where envelope_name = $1 ORDER BY envelope_id ASC',
        values: [category]
    }
    pool.query(query, (error, results) => {
        if (error) {
          throw error
        }
        if (results.rows[0]){
            response.json(results.rows[0]) 
        } else {
            response.json({}) 
        }
    })
}

const updateEnvelope = (envelopeIndex, updatedEnvelope) => {
    axios.get('envelopes?name=savings')
    .then( response => {
        console.log(response);
    })
    .catch( error => {
        throw error
    });
    if (isValidEnvelope(updatedEnvelope)) {
        updatedEnvelope.budget = parseFloat(updatedEnvelope.budget)
        envelopes[envelopeIndex] = updatedEnvelope
        return true
    }
    return false
}

const deleteEnvelope = (envelopeIndex) => {
    envelopes.splice(envelopeIndex,1)
    return true
}


const transferEnvelope = (from, to, transferedBudget) => {
    if(!isNaN(transferedBudget)){
        transferedBudget = parseFloat(transferedBudget)
        envelopes[from].budget = envelopes[from].budget - transferedBudget
        envelopes[to].budget = envelopes[to].budget + transferedBudget
        return true
    }
    return false
}

module.exports = {addEnvelope, getAllEnvelopes
    , getSpecificEnvelope, envelopeExist, updateEnvelope, deleteEnvelope
    , transferEnvelope
}
