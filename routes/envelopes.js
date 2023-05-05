const express = require('express')
const envelopeRouter = express.Router()
const envelopes = require('../model/envelopes')

envelopeRouter.post('/', async (req, res, next) => {
    const [message, addition] = await envelopes.addEnvelope(req.body)
    if(addition){
        return res.send({
            'response' : 'Envelope Added',
            'addedEnvelop' : addition
        })
    }
    res.status(400).send({
        'response' : "It wasn't possible to add an envelope: " + message
    })
})



envelopeRouter.get('/', async (req, res, next) => {
    var specificEnvelope;
    if(!req.query.name && !req.query.id){
        const allEvenlopes = await envelopes.getAllEnvelopes()
        return res.status(200).json(allEvenlopes)
    }
    if(req.query.id){
        specificEnvelope = await envelopes.getSpecificEnvelope('id',req.query.id)
    }
    if(req.query.name){
        specificEnvelope = await envelopes.getSpecificEnvelope('category',req.query.name)
    }
    if (!specificEnvelope){
        return  res.status(404).send({
            'response' : "Envelope doesn't exist"
        })
    }
    res.status(200).json(specificEnvelope)
})

envelopeRouter.param('id', async (req,res,next,id) => {
    const envelopeExists = await envelopes.getSpecificEnvelope('id',id)
    if(!envelopeExists){
      return  res.status(404).send({
        'response' : "Envelope doesn't exist"
        })
    }
    req.envelopeFound = envelopeExists
    next()
})



envelopeRouter.put('/:id', async (req, res, next) => {
    const actualEnvelope = req.envelopeFound
    const [message, updatedEnvelope] = await envelopes.updateEnvelope(actualEnvelope,req.body)
    if(updatedEnvelope){
        return res.send({
            'response' : 'Envelope Updated',
            'newEnvelope' : updatedEnvelope
        })
    }
    res.status(400).send({
        'response' : "It wasn't possible to update an envelope: " + message
    })
})

envelopeRouter.delete('/:id', async (req, res, next) => {
    const actualEnvelope = req.envelopeFound
    const deletedEnvelope = await envelopes.deleteEnvelope(actualEnvelope)
    if (deletedEnvelope){
        res.status(200).send({
            'response' : "Envelope Deleted",
            'deletedEnvelope' : deletedEnvelope
        })
    } 
})


envelopeRouter.param('from', async (req,res,next,id) => {
    const envelopeExists = await envelopes.getSpecificEnvelope('id',id)
    if(!envelopeExists){
      return  res.status(404).send({
        'response' : "Envelope to substract budget doesn't exist"
    })
    }
    req.from = envelopeExists
    next()
})

envelopeRouter.param('to', async (req,res,next,id) => {
    const envelopeExists = await envelopes.getSpecificEnvelope('id',id)
    if(!envelopeExists){
      return  res.status(404).send({
        'response' : "Envelope to transfer doesn't exist"
    })
    }
    req.to = envelopeExists
    next()
})
envelopeRouter.post('/transfer/:from/:to', async (req, res, next) => {
    const budgetToTransfer = req.body.budget
    const [message,transferMoney] = await envelopes.transferEnvelope(req.from,req.to,budgetToTransfer)
    if (transferMoney){
        return res.send({
            'response' : "Envelope transfer succesful",
            'updates' : {
                'updatedFromEnvelope' : transferMoney.updatedFrom,
                'updatedToEnvelope' : transferMoney.updatedTo
            }
        })
    }
    res.status(500).send({
        'response' : `Envelope transfer was not possible: ` + message
    })
})



module.exports = envelopeRouter