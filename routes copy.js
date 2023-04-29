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
        return envelopes.getAllEnvelopes(req,res)
    }
    var test = envelopes.getSpecificEnvelope(req.query.name, req,res)
    console.log(test)
})

envelopeRouter.param('category', (req,res,next,id) => {
    console.log('test')
    const envelopePos = envelopes.getSpecificEnvelope(id, req,res)
    if(!envelopePos){
      return  res.status(404).send({
        'response' : "Envelope doesn't exist"
    })
    }
    req.categoryIndex = envelopePos
    next()
})



envelopeRouter.put('/:category', (req, res, next) => {
    const envelopePos = req.categoryIndex
    const updatedEnvelope = envelopes.updateEnvelope(envelopePos, req.body)
    if(updatedEnvelope){
        return res.send({
            'response' : 'Envelope Updated'
        })
    }
    res.status(400).send({
        'response' : "It wasn't possible to update an envelope"
    })
})

envelopeRouter.delete('/:category', (req, res, next) => {
    const envelopePos = req.categoryIndex
    const deletedEnvelope = envelopes.deleteEnvelope(envelopePos)
    if (deletedEnvelope) res.status(204).send({
        'response' : "Envelope Deleted"
    })
})


envelopeRouter.param('from', (req,res,next,id) => {
    const envelopePos = envelopes.envelopeExist(id)
    if(envelopePos === -1){
      return  res.status(404).send({
        'response' : "Envelope to substract budget doesn't exist"
    })
    }
    req.fromIndex = envelopePos
    next()
})

envelopeRouter.param('to', (req,res,next,id) => {
    const envelopePos = envelopes.envelopeExist(id)
    if(envelopePos === -1){
      return  res.status(404).send({
        'response' : "Envelope to transfer doesn't exist"
    })
    }
    req.toIndex = envelopePos
    next()
})
envelopeRouter.post('/transfer/:from/:to', (req, res, next) => {
    const budgetToTransfer = req.body.budget
    const transferMoney = envelopes.transferEnvelope(req.fromIndex,req.toIndex,budgetToTransfer)
    if (transferMoney){
        return res.send({
            'response' : "Envelope transfer succesful"
        })
    }
    res.status(500).send({
        'response' : "Envelope transfer was not possiblez"
    })
})
module.exports = envelopeRouter