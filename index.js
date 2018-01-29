const express = require('express')
const app = express()

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
    const person = persons.find(person => person.id===id)

    person ?
    res.json(person):
    res.status(404).end()
})

const port=3001
app.listen(port, () => {
    console.log(`server running on port ${port}`)
})