const envelopes = []
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

module.exports = {addEnvelope, getAllEnvelopes}