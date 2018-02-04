const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(cors())
app.use(express.static('build'))

morgan.token('data', (req, res) => (
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

const formatPerson = (person) => {
    const formatted = { ...person._doc, id: person._id }
    delete formatted._id
    delete formatted.__v

    return formatted
}

app.get('/api/persons', (req, res) => {
    Person
        .find({})
        .then(persons => {
            res.json(persons.map(person => formatPerson(person)))
        })
})

app.get('/info', (req, res) => {
    res.send(`<div>puhelinluettelossa ${persons.length} henkilöä</div><div>${new Date}</div>`)
})

app.get('/api/persons/:id', (req, res) => {
    Person
        .findById(req.params.id)
        .then(person => {
            res.json(formatPerson(person))
        })
})

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id
    Person.findById(id)
        .then(person => {
            person
                .remove()
                .then(a => console.log(a))
        })
    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (body.name === '') {
        return res.status(400).json({ error: 'Nimi ei saa olla tyhjä!' })
    }

    if (body.number === '') {
        return res.status(400).json({ error: 'Numero ei saa olla tyhjä!' })
    }

    if (persons.find(old => old.name === body.name)) {
        return res.status(400).json({ error: 'Nimi on jo käytössä!' })
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person
        .save()
        .then(saved => {
            res.json(formatPerson(saved))
        })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})
