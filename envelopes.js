const envelopes = []
/*For this project I will consider a budget envelope as an object with the next body:
{
    "category" : name of the category for the envelope
    "budget" : budget use for the category
}
*/

const isValidEnvelope = (possibleEnvelope) => {
    const {category, budget} = possibleEnvelope
    return typeof category === 'string' && !isNaN(budget)

}


const addEnvelope = (envelope) => {
    if (!envelope){
        envelopes.push(envelope)
    }
}

module.exports = envelopes
