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
    res.send(envelopes.getAllEnvelopes())
})



module.exports = envelopeRouter