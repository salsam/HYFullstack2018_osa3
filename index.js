const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())
app.use(express.static('build'))

morgan.token('data', (req,res) => (
    JSON.stringify(req.body)
))

app.use(bodyParser.json())
app.use(morgan(':method :url :data :status :res[content-length] :response-time ms'))

let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Martti Tienari",
        "number": "040-123456",
        "id": 2
    },
    {
        "name": "Arto Järvinen",
        "number": "040-123456",
        "id": 3
    },
    {
        "name": "Lea Kutvonen",
        "number": "040-123456",
        "id": 4
    },
    {
        "name": "aasfaf",
        "number": "1",
        "id": 5
    },
    {
        "name": "b",
        "number": "2",
        "id": 7
    },
    {
        "name": "a",
        "number": "2",
        "id": 8
    }
]

app.get('/api/persons', (req, res) => {
    res.status(200).json(persons)
})

app.get('/info', (req, res) => {
    res.send(`<div>puhelinluettelossa ${persons.length} henkilöä</div><div>${new Date}</div>`)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)

    person ?
        res.json(person) :
        res.status(404).end()
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const person = req.body
    console.log(person)
    person.id=Math.floor(1000*Math.random())

    if (person.name==='') {
        return res.status(400).json({error: 'Nimi ei saa olla tyhjä!'})
    }

    if (person.number==='') {
        return res.status(400).json({error: 'Numero ei saa olla tyhjä!'})       
    }

    if (persons.find(old=>old.name===person.name)) {
        return res.status(400).json({error: 'Nimi on jo käytössä!'})
    }

    persons = persons.concat(person)
    res.json(person)
})

const PORT = process.env.PORT | 3001
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})
