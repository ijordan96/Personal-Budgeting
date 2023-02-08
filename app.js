const express = require('express')
const app = express()
const envelopeRouter = require('./routes')
const cors = require('cors');
app.use(cors());



app.get('/', (req,res,next) => {
    res.send('Hi')

})

app.listen(4001, () => {
    console.log('listening on port 4001')
})