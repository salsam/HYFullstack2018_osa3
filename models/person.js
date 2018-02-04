const mongoose = require('mongoose')

if ( process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const url = process.env.MONGODB_URI

mongoose.connect(url)
mongoose.Promise = global.Promise

const formatPerson = (person) => {
    return {
        name: person.name,
        number: person.number,
        id: person._id
    }
}

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

personSchema.static('format', formatPerson)

const Person = mongoose.model('Person', personSchema)

module.exports = Person