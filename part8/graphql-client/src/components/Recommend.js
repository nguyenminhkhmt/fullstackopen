import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'

const RecommendBooks = (props) => {
  const { user } = props
  const allBookQuery = useQuery(ALL_BOOKS, {
    variables: { genre: user ? user.favouriteGenre : '' }
  })

  if (!props.show) {
    return null
  }

  if (allBookQuery.loading) {
    return (
      <div>
        loading...
      </div>
    )
  }

  if (allBookQuery.error) {
    return (<div>{allBookQuery.error}</div>)
  }

  const books = allBookQuery.data.allBooks

  return (
    <div>
      <h2>recommendations</h2>
      <label>book in your favorite genre <b>{props.user ? props.user.favouriteGenre : ''}</b></label>
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

export default RecommendBooks