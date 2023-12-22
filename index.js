require('dotenv').config()
const express = require('express')
const morgan = require('morgan')

const Person = require('./models/person')
const errorHandler = require('./middlewares/errorHandler')

const app = express()

app.use(express.json())
app.use(express.static('build'))

morgan.token('body', function (req, res) { 
  if(req.method === 'POST') {
    return JSON.stringify(req.body) 
  } else{
    return 
  }
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/info', (request, response, next) => {
  const date = new Date();
  Person.find({})
    .then(persons => response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`))
    .catch(error => next(error))
})

app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(persons => response.json(persons))
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (!person) {
        response.status(404).end()
      } else {
        response.json(person)
      }
    })
    .catch(error => {
      console.error("error", error)
      next(error)
    })
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  const updatePerson = {
    name: body.name,
    number: body.number
  }
  Person.findByIdAndUpdate(request.params.id, updatePerson, { new: true, runValidators: true })
    .then(result => {
      console.log("result: ", result)
      response.json(result)
    })
    .catch((error) => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => response.status(204).end())
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  const newPerson = {
    name: body.name,
    number: body.number
  }

  const person = new Person(newPerson)
  person.save()
    .then(result => response.json(result))
    .catch(error => next(error))
})

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})