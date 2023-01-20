import { useEffect, useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import RecommendBooks from './components/Recommend'
import { useApolloClient, useSubscription, useQuery } from '@apollo/client'
import './App.css'
import { ALL_BOOKS, BOOK_ADDED, ME } from './queries'

let previousButton = null

const Message = ({ error }) => {
  if (!error) return (null)

  const errorStyle = {
    "backgroundColor": "red",
    "borderWidth": "1px",
    "color": "black"
  }

  return (
    <div style={errorStyle}>
      {error}
    </div>
  )
}

export const updateCache = (cache, query, bookAdded) => {
  const uniqByName = (a) => {
    let seen = new Set()
    return a.filter((item) => {
      let k = item.title
      return seen.has(k) ? false : seen.add(k)
    })
  }

  cache.updateQuery(query, (props) => {
    if (props) {
      const { allBooks } = props
      return {
        allBooks: uniqByName(allBooks.concat(bookAdded))
      }
    } else {
      return null
    }
  })
}

const notify = (message) => {
  window.alert(message)
}

const App = () => {
  const [queryFilter, setQueryFilter] = useState({ query: ALL_BOOKS })
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [page, setPage] = useState('authors')
  const [error, setError] = useState(null)
  const client = useApolloClient()
  const meQuery = useQuery(ME)

  useEffect(() => {
    const token = localStorage.getItem('user-token')
    setToken(token)
    meQuery.refetch().then(response => {
      setUser(response.data.me)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const bookAdded = data.data.bookAdded
      console.log(bookAdded)
      updateCache(client.cache, { query: ALL_BOOKS }, bookAdded)
      bookAdded.genres.forEach(genre => {
        updateCache(client.cache, { query: ALL_BOOKS, variables: { genre: genre } }, bookAdded)
      })
      notify(`${bookAdded.title} by ${bookAdded.author.name} is added!`)
    }
  })

  const handleLogout = () => {
    setToken(null)
    window.localStorage.clear()
    client.resetStore()
    setPage('login')
  }

  const handleLogin = (token) => {
    setToken(token)
    localStorage.setItem('user-token', token)
    setPage('books')
  }

  const handleError = (message) => {
    setError(message)
    setTimeout(() => {
      setError(null)
    }, 5000)
  }

  const handleButtonClicked = (event) => {
    const button = event.target
    if (previousButton !== null) {
      previousButton.classList.remove('btn-nav-active')
    }
    button.classList.add('btn-nav-active')
    setPage(button.value)
    previousButton = button
  }

  return (
    <div>
      <Message error={error} />
      <div>
        <button className='nav-btn' value='authors' onClick={handleButtonClicked}>authors</button>
        <button className='nav-btn' value='books' onClick={handleButtonClicked}>books</button>
        {
          token ? <span>
            <button className='nav-btn' value='add' onClick={handleButtonClicked}>add book</button>
            <button className='nav-btn' value='recommend' onClick={handleButtonClicked}>recommend</button>
            <button className='nav-btn' value='logout' onClick={handleLogout}>logout</button>
          </span>
            :
            <button className='nav-btn' value='login' onClick={handleButtonClicked}>login</button>
        }
      </div>

      <Authors handleError={handleError} show={page === 'authors'} />

      <Books show={page === 'books'} setQueryFilter={setQueryFilter} />

      <NewBook handleError={handleError} show={page === 'add'} user={user} queryFilter={queryFilter} />

      <LoginForm show={page === 'login'} handleError={handleError} handleLogin={handleLogin} />

      <RecommendBooks show={page === 'recommend'} handleError={handleError} user={user} />
    </div >
  )
}

export default App