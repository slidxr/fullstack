require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const {request} = require("express");
const cors = require('cors')
const Person = require('./models/person')
const app = express()


app.use(express.static('dist'))
app.use(cors())
morgan.token('body', function (request) { return JSON.stringify(request.body) })
app.use(express.json())
app.use(morgan('tiny'))


app.get('/api/persons', (request, response) => {
    Person.find({}).then(result => {
        response.json(result)
    })
})

app.get('/info', (request, response) => {
    response.send(`Phonebook has info for ${Person.length} people <br/> ${new Date()}`)
})

app.get('/api/persons/:id', (request, response) => {
    Person
        .findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => {
            response.status(400).send({error: 'malformatted id'})
        })
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    person = Person.filter( person => person.id !== id)
    response.status(204).end()
})

const postMorgan = morgan(':method :url :status :res[content-length] - :response-time ms :body')

app.post('/api/persons', postMorgan, (request, response, next) => {
    const body = request.body

    if(!body.name || !body.number){
        return response.status(400).json({
            error: 'name or number missing'
        })
    }else{
        const person = new Person({
            name: body.name,
            number: body.number,
        })

        person.save()
            .then(person => {
                response.json(person)
            })
            .catch(error => next(error))
    }
})


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

