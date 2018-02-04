const mongoose = require('mongoose')

if ( process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

//const url = 'mongodb://fullstack:sekred@ds223578.mlab.com:23578/puhlo'
const url = process.env.MONGODB_URI

mongoose.connect(url)
mongoose.Promise = global.Promise

const formatPerson = (person) => {
    const formatted = { ...person._doc, id: person._id }
    delete formatted._id
    delete formatted.__v

    return formatted
}

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

personSchema.static('format', formatPerson)

const Person = mongoose.model('Person', personSchema)

module.exports = Person