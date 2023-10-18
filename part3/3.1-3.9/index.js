const express = require('express')
const app = express()

app.use(express.json())

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
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

// Using express

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    response.send(`Phonebook has info for ${persons.length} people <br/> ${new Date()}`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find( person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.statusMessage = `Person with id ${id} not found`
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter( person => person.id !== id)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    const id = Math.floor(Math.random() * 100)

    if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    }

    if (!body.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    }

    if (persons.find( person => person.name === body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        id: id,
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)
    response.json(person)
})


const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})


// using clear node.js
// const app = http.createServer((request, response) => {
//     if (request.method === 'GET') {
//         if (request.url === '/api/persons') {
//             response.writeHead(200, { 'Content-Type': 'application/json' })
//             response.end(JSON.stringify(persons))
//         }
//         else if (request.url === '/info') {
//             response.writeHead(200, { 'Content-Type': 'application/json' })
//             response.end(`Phonebook has info for ${persons.length} people \n${new Date()}`)
//         }
//     }
//
//
// })
//
// const PORT = 3001
// app.listen(PORT)
// console.log(`Server running on port ${PORT}`)


