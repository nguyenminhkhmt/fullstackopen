/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const mongoose = require('mongoose')
mongoose.set('strictQuery', true)

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}
const password = process.argv[2]

const name = process.argv[3]
const number = process.argv[4]

const uri = `mongodb+srv://admin:${password}@phonebook.5zbr5hb.mongodb.net/phonebook?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
  id: Number,
  name: String,
  number: String
})

const Person = mongoose.model('Persons', personSchema)

if (name && number) {
  mongoose
    .connect(uri)
    .then((result) => {
      const person = new Person({
        name: name,
        number: number
      })

      return person.save()
    })
    .then(() => {
      console.log(`added ${name} number ${number} to phonebook`)
      return mongoose.connection.close()
    })
    .catch((err) => {
      console.log(err)
      mongoose.connection.close()
    })
} else {
  mongoose
    .connect(uri)
    .then(_ => {
      console.log('phonebook:')

      Person.find({}).then(result => {
        result.forEach(person => {
          console.log(person.name, person.number)
        })
        mongoose.connection.close()
      })
    })
    .catch((err) => {
      console.log(err)
      mongoose.connection.close()
    })
}