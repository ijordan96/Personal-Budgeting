const express = require('express')
const app = express()
const envelopeRouter = require('./routes/envelopes')
const transactionsRouter = require('./routes/transactions')



const cors = require('cors');
app.use(cors());


const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use('/envelopes', envelopeRouter)
app.use('/transactions', transactionsRouter)


app.listen(4001, () => {
    console.log('listening on port 4001')
})