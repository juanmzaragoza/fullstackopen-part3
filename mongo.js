const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://juanm02:${password}@cluster0.2t6p2qv.mongodb.net/note-app?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
    console.log('phonebook:')
    Person.find({}).then(persons => {
        persons.forEach(person => {
            console.log(person.name, " ", person.number)
        })
        mongoose.connection.close()
    })
} else {
    const person = new Person({ name, number })
    person.save().then(result => {
        console.log('person saved!')
        mongoose.connection.close()
    })
}