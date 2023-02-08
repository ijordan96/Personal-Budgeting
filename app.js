const express = require('express')
const app = express()
const envelopeRouter = require('./routes')



const cors = require('cors');
app.use(cors());


const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use('/envelope', envelopeRouter)

app.get('/', (req,res,next) => {
    res.send('Hi')

})

app.listen(4001, () => {
    console.log('listening on port 4001')
})