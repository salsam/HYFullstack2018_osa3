const mongoose = require('mongoose')

const url = 'mongodb://fullstack:sekred@ds223578.mlab.com:23578/fullstack-notes'

mongoose.connect(url)
mongoose.Promise = global.Promise

const Person = mongoose.model('Person', {
    name: String,
    number: String
})

if (process.argv.length === 4) {
    const person = new Person({
        name: process.argv[2],
        number: process.argv[3]
    })
    person.save()
        .then(result => {
            mongoose.connection.close()
        })
    console.log(`lisätään henkilö ${person.name} numero ${person.number} luetteloon`)
} else {
    console.log("puhelinluettelo:")
    Person.find({})
        .then(result => {
            result.forEach(person => {
                console.log(`${person.name} ${person.number}`)
            })
            mongoose.connection.close()
        })
}