import {useEffect, useState} from 'react'
import axios from 'axios'

const Filter = ({ filter, handleFilterChange }) => {
    return (
        <div>
            Filter: <input value={filter} onChange={handleFilterChange} />
        </div>
    )
}

const Form = (props) => {
    return (
        <form onSubmit={props.addPerson}>
            <div>
                name: <input value={props.newName} onChange={props.handleNameChange} />
            </div>
            <div>
                number: <input value={props.newNumber} onChange={props.handleNumberChange} />
            </div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>
    )
}

const Persons = ({ personsToShow }) => {
    return (
        <div>
            {personsToShow.map(person =>
                <p
                    key={person.name}>{person.name} {person.number}
                </p>)}
        </div>
    )
}

const App = () => {

    useEffect(() => {
        axios
            .get('http://localhost:3001/persons')
            .then(response => {
                setPersons(response.data)
            })
    }, []);

    const [persons, setPersons] = useState([

    ])

    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [filter, setFilter] = useState('')

    const handleNameChange = (event) => setNewName(event.target.value)
    const handleNumberChange = (event) => setNewNumber(event.target.value)
    const handleFilterChange = (event) => setFilter(event.target.value)


    const addPerson = (event) => {
        event.preventDefault()
        const newPerson = {
            name: newName,
            number: newNumber
        }

        const checkPerson = persons.find(props => props.name.toLowerCase() === newPerson.name.toLowerCase())
        if (checkPerson ) {
            window.alert(`${newName} is already added to phonebook`)
            return
        }

        setPersons(persons.concat(newPerson))
        setNewName('')
        setNewNumber('')
    }

    const personsToShow = filter === ''
        ? persons
        : persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))


    return (
        <div>
            <h2>Phonebook</h2>
            <Filter filter={filter} handleFilterChange={handleFilterChange} />
            <h3>Add a new contact</h3>
            <Form
                addPerson={addPerson}
                newName={newName}
                handleNameChange={handleNameChange}
                newNumber={newNumber}
                handleNumberChange={handleNumberChange}
            />
            <h2>Numbers</h2>
            <Persons personsToShow={personsToShow}/>
        </div>
    )
}

export default App