import { useMutation, useQuery } from "@apollo/client"
import { useState } from "react"
import { ALL_AUTHORS, EDIT_AUTHOR } from "../queries"

const UpdateAuthor = ({ authors, updateAuthor }) => {
  const [name, setName] = useState(authors[0].name ?? '')
  const [born, setBorn] = useState(authors[0].born ?? 0)

  const handleSelectChanged = (event) => {
    const name = event.target.value
    setName(name)
    const author = authors.find(author => author.name === name)
    setBorn(author.born ?? 0)
  }

  const handleNumberChanged = (event) => {
    const text = event.target.value
    const num = Number(text)
    setBorn(num)
  }

  const handelUpdateAuthor = (event) => {
    event.preventDefault()
    updateAuthor(name, born)
  }

  return (
    <div>
      <form onSubmit={handelUpdateAuthor}>
        <select onChange={handleSelectChanged}>
          {authors.map(author => <option key={author.name} value={author.name}>{author.name}</option>)}
        </select>
        <input type='number' value={born} onChange={handleNumberChanged} />
        <br />
        <input type='submit' value='update author' />
      </form>
    </div>
  )
}

const Authors = (props) => {
  const result = useQuery(ALL_AUTHORS)
  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    onError: (error) => {
      props.handleError(error.graphQLErrors[0].message)
    }
  })

  if (!props.show) {
    return null
  }

  if (result.loading) {
    return (
      <div>
        loading...
      </div>
    )
  }
  const authors = result.data.allAuthors

  const updateAuthor = (name, born) => {
    editAuthor({ variables: { name, 'setBornTo': born } })
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Set birthyear</h2>
      <UpdateAuthor authors={authors} updateAuthor={updateAuthor} />
    </div>
  )
}

export default Authors