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

app.get('/api/persons', (req, res) => {
    Person
        .find({})
        .then(persons => {
            res.json(persons.map(Person.format))
        })
        .catch(error => {
            console.log(error)
            res.status(404).end()
        })
})

app.get('/info', (req, res) => {
    Person.count({}, (err, count) => {
        err ?
        res.send('Error connecting to database!') :
        res.send(`<div>puhelinluettelossa ${count} henkilöä</div><div>${new Date}</div>`) 
    })
})

app.get('/api/persons/:id', (req, res) => {
    Person
        .findById(req.params.id)
        .then(person => {
            person ?
                res.status(200).json(Person.format(person)) :
                res.status(404).end()
        })
        .catch(error => {
            console.log(error)
            res.status(400).send({ message: {text: 'malformatted id', type: 'error' }})
        })
})

app.delete('/api/persons/:id', (req, res) => {
    console.log("remove: ",req.params.id)
    Person.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => {
            console.log(error)
            res.status(400).send({ message: {text: 'malformatted id', type: 'error' }})
        })
})

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (body.name === '') {
        return res.status(400).json({ message: {text: 'Nimi ei saa olla tyhjä!', type: 'error' }})
    }

    if (body.number === '') {
        return res.status(400).json({ message: {text: 'Numero ei saa olla tyhjä!', type: 'error' }})
    }

    console.log(body)

    const person = new Person({
        name: body.name,
        number: body.number
    })

    console.log(person)

    person
        .save()
        .then(saved => {
            res.json(Person.format(saved))
        })
        .catch(error => console.log(error))
})

app.put('/api/persons/:id', (req, res) => {
    const body = req.body
    console.log("PUT")
    console.log(body)

    const person = {
        name: body.name,
        number: body.number
    }

    console.log(person)

    Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedNote => {
        res.json(Person.format(updatedNote))
    })
    .catch(error => {
        console.log(error)
        res.status(400).send({ error: 'malformatted id'})
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})
