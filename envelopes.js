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

const getAllEnvelopes = () => {
    return envelopes
}

const getSpecificEnvelope = (category) => {
    return envelopes.find((envelope) =>  envelope.category === category )
}

const updateEnvelope = (envelopeIndex, updatedEnvelope) => {
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

module.exports = {addEnvelope, getAllEnvelopes, getSpecificEnvelope, envelopeExist, updateEnvelope, deleteEnvelope, transferEnvelope}
