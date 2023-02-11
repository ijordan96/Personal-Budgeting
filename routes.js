const express = require('express')
const envelopeRouter = express.Router()
const envelopes = require('./envelopes')

envelopeRouter.post('/', (req, res, next) => {
    const addition = envelopes.addEnvelope(req.body)
    if(addition){
        return res.send({
            'response' : 'Envelope Added'
        })
    }
    res.status(400).send({
        'response' : "It wasn't possible to add an envelope"
    })
})

envelopeRouter.get('/', (req, res, next) => {
    if(!req.query.name){
        return res.send(envelopes.getAllEnvelopes())
    }
    res.send(envelopes.getSpecificEnvelope(req.query.name))
})

envelopeRouter.param('category', (req,res,next,id) => {
    const envelopePos = envelopes.envelopeExist(id)
    if(envelopePos === -1){
      return  res.status(404).send('Envelope doesn not exist')
    }
    req.categoryIndex = envelopePos
    next()
})

envelopeRouter.put('/:category', (req, res, next) => {
    const envelopePos = req.categoryIndex
    const updatedEnvelope = envelopes.updateEnevelope(envelopePos, req.body)
    if(updatedEnvelope){
        return res.send({
            'response' : 'Envelope Updated'
        })
    }
    res.status(400).send({
        'response' : "It wasn't possible to update an envelope"
    })
})


module.exports = envelopeRouter