const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(express.json())
app.use(express.static('dist'))

app.use(cors())

morgan.token('body', (req, res) => JSON.stringify(req.body))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

const persons = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-1234567"
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]

const currentdate = new Date();

app.get('/info', (req, res) => {
  res.send(`<p>Phonebook has info for ${persons.length} people </p> ${currentdate}`)
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id);

  if (!person) {
    res.status(404).end()
    return
  }

  res.json(person);
})

app.post('/api/persons', (req, res) => {

  const person = {
    id: Math.floor(Math.random()*1000),
    name: req.body.name,
    number: req.body.number
  }

  if (!person.name || !person.number) {
    res.status(400).json({ error: 'bad request - missing entry value' }).end()
    return
  }

  const checkname = persons.filter(person => person.name === req.body.name);

  if (checkname.length > 0) {
    res.status(400).json({ error: 'name must be unique' }).end()
    return
  }
  res.json(person)
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id);
  const personsDel = persons.filter(person => person.id !== id)
  if (!person) {
    res.status(404).end()
    return
  }
  res.json(personsDel).status(204).end()
})


const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)