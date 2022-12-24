import { useState, useEffect } from 'react'
import './App.css'
import _ from 'lodash'
import services from './Phones'

const Person = (props) => {
  const { person, persons, setPersons, setMessage } = props

  const msg = `Delete ${person.name}?`

  const handleDelete = (event) => {
    if (window.confirm(msg)) {
      services.deleteContact(person.id)
        .then(_ => {
          const message = { body: `${person.name} has been removed from server!`, type: 'success' }
          setMessage(message)
          setPersons(persons.filter(p => p.id !== person.id))
        })
        .catch(error => {
          console.log(error)
          const message = { body: `Information of ${person.name} has already been removed from server!`, type: 'failed' }
          setMessage(message)
          setPersons(persons.filter(p => p.id !== person.id))
        })
    }
  }

  return (
    <span>{person.name} {person.number} <button id={person.id} onClick={handleDelete}>delete</button><br /></span>
  )
}

const Persons = ({ persons, setPersons, filterName, setMessage }) => {
  const filter = filterName.trim().toLowerCase()
  const filterPersons = filter.length > 0 ? persons.filter(person => person.name.toLowerCase().startsWith(filter)) : persons
  console.log(filterPersons.map(person => person.name))
  return (
    <p>
      {filterPersons.map(person => <Person key={person.id} person={person} persons={persons} setPersons={setPersons} setMessage={setMessage} />)}
    </p>
  )
}

const PersonForm = (props) => {
  let { newName, newNumber, setNewName, setNewNumber, persons, setPersons, setMessage } = props
  const handleNameInputChanged = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberInputChanged = (event) => {
    setNewNumber(event.target.value)
  }

  const onSubmit = (event) => {
    event.preventDefault()
    const newPerson = { name: newName, number: newNumber }
    const foundPersons = persons.filter(person => _.isEqual(person.name, newPerson.name))
    if (foundPersons.length > 0) {
      newPerson.id = foundPersons[0].id
      const msg = `${newName} is already added to phonebook, replace the old number with a new one?`
      if (window.confirm(msg)) {
        console.log(newPerson)
        services.update(newPerson.id, newPerson)
          .then((aPerson) => {
            setPersons(persons.map(person => person.id !== aPerson.id ? person : aPerson))
            const message = { body: `${aPerson.name}'s number is updated!`, type: 'success' }
            setMessage(message)
          })
          .catch(error => {
            console.log(error)
            const message = { body: `Information of ${newPerson.name} hasn't been updated on server!`, type: 'failed' }
            setMessage(message)
          })
      }
      return
    }

    console.log(persons)
    console.log("heyeyeyeye", newPerson)

    services.add(newPerson)
      .then(person => setPersons(persons.concat(person)))
      .catch(error => {
        console.log(error)
        const message = { body: `${error.response.data.error}`, type: 'failed' }
        setMessage(message)
      })
  }

  return (
    <form onSubmit={onSubmit}>
      <div>
        name: <input value={newName} onChange={handleNameInputChanged} />
        <br />
        number: <input value={newNumber} onChange={handleNumberInputChanged} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Filter = ({ filterName, setFilterName }) => {
  const handlerFilterNameChanged = (event) => {
    setFilterName(event.target.value)
  }

  return (
    <form>
      <div>
        filter shown with <input value={filterName} onChange={handlerFilterNameChanged} />
      </div>
    </form>
  )
}

const Message = ({ message }) => {
  if (message === null || message === undefined) {
    return (null)
  }

  const messageClass = `message ${message.type}`

  return (
    <p className={messageClass}>{message.body}</p>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setFilterName] = useState('')
  const [message, setMessage] = useState(null)

  const hook = () => {
    console.log(services)
    services.getAll().then(persons => {
      console.log('promise fulfilled', persons)
      setPersons(persons)
    }).catch(error => {
      console.log(error)
      const message = { body: `${error.response.data.error}`, type: 'failed' }
      setMessage(message)
      setPersons([])
    })
  }

  useEffect(hook, [])

  return (
    <div>
      <h2>Phonebook</h2>
      <Message message={message} />
      <Filter filterName={filterName} setFilterName={setFilterName} />
      <h2>Add a new</h2>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        setNewName={setNewName}
        setNewNumber={setNewNumber}
        persons={persons}
        setPersons={setPersons}
        setMessage={setMessage}
      />
      <h2>Numbers</h2>
      <Persons persons={persons} setPersons={setPersons} filterName={filterName} setMessage={setMessage} />
    </div>
  )
}

export default App