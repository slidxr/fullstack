import {useEffect, useState} from 'react'
import personService from './services/persons'

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
            {personsToShow}
        </div>
    )
}

const Notification = ({ message }) => {
    if (message === null) {
        return null
    }

    return (
        <div className="notification">
            {message}
        </div>
    )
}


const App = () => {

    useEffect(() => {
        personService
            .getAll()
            .then(response => {
                setPersons(response.data)
            })
    }, []);

    const [persons, setPersons] = useState([])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [filter, setFilter] = useState('')
    const [NotificationMessage, setNotificationMessage] = useState(null)

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
        if (checkPerson && checkPerson.number === newPerson.number ) {
            window.alert(`${newName} is already added to phonebook`)
            return
        } else if (checkPerson && checkPerson.number !== newPerson.number) {
            if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
                personService
                    .updatePerson(checkPerson.id, newPerson)
                    .then(response => {
                        setPersons(persons.map(person => person.id !== checkPerson.id ? person : response.data))
                        setNewName('')
                        setNewNumber('')
                    })
                    .catch(error => {
                        setNotificationMessage(`Error: ${newName} was already deleted from server`)
                    })
            }
        }
        else {
            personService
            .create(newPerson)
            .then(response => {
                setPersons(persons.concat(newPerson))
                setNewName('')
                setNewNumber('')
                setNotificationMessage(`Successfully added ${newName}`)
                setTimeout(() => {
                    setNotificationMessage(null)
                }, 5000)})
            .catch(error => {
                setNotificationMessage(`Error: ${error.response.data.error}`)
            })
        }

    }


    const deletePerson = (id) => {
        const person = persons.find(p => p.id === id)
        if (window.confirm(`Delete ${person.name}?`)) {
            personService
                .deletePerson(id)
                .then(response => {
                    setPersons(persons.filter(p => p.id !== id))
                    setNotificationMessage(`Successfully deleted ${person.name}`)
                })
                .catch(error => {
                    setNotificationMessage(`Error: ${person.name} was already deleted from server`)
                })
        }
    }



    const filterPersons = persons.map(props => props.name.toLowerCase().includes(filter.toLowerCase()))?
        persons.filter(props => props.name.toLowerCase().includes(filter.toLowerCase()))
        : persons


    const Person = ({name, number, id}) => {
        return(
            <li>
                {name} {number} <button onClick={() => deletePerson(id)}>delete</button>
            </li>
        )
    }

    const personsToShow = filterPersons.map( props =>
        <Person key={props.id} name={props.name} number={props.number} id={props.id} />
    )


    return (
        <div>
            <h2>Phonebook</h2>
            <Notification message={NotificationMessage} />
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