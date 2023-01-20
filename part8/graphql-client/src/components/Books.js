import { useQuery } from "@apollo/client"
import { useState } from "react"
import { ALL_BOOKS, ALL_GENRES } from "../queries"

const ALL_GENRES_KEY = 'all genres'
let previousButton = null

const useBookFilter = () => {
  const [filter, setFilter] = useState(null)
  const updateFilter = (value) => {
    setFilter(value)
  }
  return {
    filter,
    operations: { updateFilter }
  }
}

const Books = (props) => {
  const { setQueryFilter } = props
  const { filter, operations } = useBookFilter('')
  const { data, loading, error, refetch } = useQuery(ALL_BOOKS)
  const allGenres = useQuery(ALL_GENRES)

  if (!props.show) {
    return null
  }

  if (loading || allGenres.loading) {
    return (
      <div>
        loading...
      </div>
    )
  }
  if (error) {
    return (<div>{error}</div>)
  }

  const books = data.allBooks
  const genres = allGenres.data.allGenres.concat(ALL_GENRES_KEY)

  const handleButtonGenres = (event) => {
    if (previousButton !== null) {
      previousButton.classList.remove('btn-active')
    }

    event.target.classList.add('btn-active')
    let filter = event.target.value
    if (filter === ALL_GENRES_KEY) {
      filter = ''
    }
    operations.updateFilter(filter)
    setQueryFilter({ genre: filter })
    refetch({ genre: filter })

    previousButton = event.target
  }

  return (
    <div>
      <h2>books</h2>
      <div>
        {genres.map(genre => <button className={genre === filter || (filter === '' && genre === ALL_GENRES_KEY) ? 'btn-active' : ''} value={genre} key={genre} onClick={handleButtonGenres}>{genre}</button>)}
      </div>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Books