import { useState } from 'react'
import { Routes, Route, Link, useMatch, useNavigate, Navigate } from 'react-router-dom'
import { useField } from './hooks'
// import { Navbar, Nav } from 'react-bootstrap'
import { Container, TableContainer, Paper, Table, TableBody, TableCell, TableRow } from '@mui/material'
import { TextField, Button, Alert, AppBar, Toolbar, IconButton } from '@mui/material'

const Menu = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu"></IconButton>
        <Button color="inherit" component={Link} to="/anecdotes">
          anecdotes
        </Button>
        <Button color="inherit" component={Link} to="/create">
          create new
        </Button>
        <Button color="inherit" component={Link} to="/about">
          about
        </Button>
      </Toolbar>
    </AppBar>
  )
}

const AnecdoteList = ({ anecdotes }) => (
  <div>
    <h2>Anecdotes</h2>
    <TableContainer component={Paper}>
      <Table>
        <TableBody>
          {anecdotes.map(anecdote =>
            <TableRow key={anecdote.id} >
              <TableCell>
                <Link to={`/anecdotes/${anecdote.id}`}>{anecdote.content}</Link>
              </TableCell>
              <TableCell>{anecdote.author}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  </div>
)

const Anecdote = ({ anecdote, vote }) => {
  const handleVote = (event) => {
    event.preventDefault()
    vote(anecdote.id)
  }

  return (
    < div >
      <h2>{anecdote.content} by {anecdote.author}</h2>
      has {anecdote.votes} votes <button onClick={handleVote}>vote</button>
    </div >
  )
}

const About = () => (
  <div>
    <h2>About anecdote app</h2>
    <p>According to Wikipedia:</p>

    <em>An anecdote is a brief, revealing account of an individual person or an incident.
      Occasionally humorous, anecdotes differ from jokes because their primary purpose is not simply to provoke laughter but to reveal a truth more general than the brief tale itself,
      such as to characterize a person by delineating a specific quirk or trait, to communicate an abstract idea about a person, place, or thing through the concrete details of a short narrative.
      An anecdote is "a story with a point."</em>

    <p>Software engineering is full of excellent anecdotes, at this app you can find the best and add more.</p>
  </div>
)

const Footer = () => (
  <div>
    <br />
    Anecdote app for <a href='https://fullstackopen.com/'>Full Stack Open</a>.
    <br />
    See <a href='https://github.com/nguyenminhkhmt/fullstackopen/blob/main/part7/routed-anecdotes/src/App.js'>https://github.com/nguyenminhkhmt/fullstackopen/blob/main/part7/routed-anecdotes/src/App.js</a> for the source code.
  </div>
)

const CreateNew = (props) => {
  const navigate = useNavigate()
  const content = useField('text')
  const author = useField('text')
  const info = useField('text')

  const handleSubmit = (e) => {
    e.preventDefault()
    const newAnecdote = {
      content: content.value,
      author: author.value,
      info: info.value
    }
    props.addNew(newAnecdote)
    navigate('/anecdotes')
  }

  const handleReset = (e) => {
    e.preventDefault()
    content.reset()
    author.reset()
    info.reset()
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit} onReset={handleReset}>
        {/* <Form.Group> */}
        <div>
          <TextField label='content' value={content.value} type={content.type} onChange={content.onChange} />
        </div>
        <br />
        <div>
          <TextField label='author' value={author.value} type={author.type} onChange={author.onChange} />
        </div>
        <br />
        <div>
          <TextField label='url for more info' value={info.value} type={info.type} onChange={info.onChange} />
        </div>
        <br />
        <div>
          <Button style={{ marginRight: '10px' }} variant='contained' color='primary' type='submit'>create</Button>
          <Button variant='contained' color='secondary' type='reset'>reset</Button>
        </div>
        {/* </Form.Group> */}
      </form>
    </div>
  )
}

const Notification = (props) => {
  const notification = props.notification
  return (
    <div>
      {(notification &&
        <Alert variant="success">
          {notification}
        </Alert>
      )}
    </div>
  )
}

const App = () => {
  const [anecdotes, setAnecdotes] = useState([
    {
      content: 'If it hurts, do it more often',
      author: 'Jez Humble',
      info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
      votes: 0,
      id: 1
    },
    {
      content: 'Premature optimization is the root of all evil',
      author: 'Donald Knuth',
      info: 'http://wiki.c2.com/?PrematureOptimization',
      votes: 0,
      id: 2
    }
  ])

  const idMatch = useMatch('anecdotes/:id')
  const anecdote = idMatch ? anecdotes.find(n => n.id === Number(idMatch.params.id)) : null

  const [notification, setNotification] = useState('')

  const addNew = (anecdote) => {
    anecdote.id = Math.round(Math.random() * 10000)
    setAnecdotes(anecdotes.concat(anecdote))
    setNotification(`a new anecdote ${anecdote.content} created!`)
    setTimeout(() => {
      setNotification('')
    }, 5000)
  }

  const anecdoteById = (id) =>
    anecdotes.find(a => a.id === id)

  const vote = (id) => {
    const anecdote = anecdoteById(id)

    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1
    }

    setAnecdotes(anecdotes.map(a => a.id === id ? voted : a))
    setNotification(`you voted ${anecdote.content}`)
    setTimeout(() => {
      setNotification('')
    }, 5000)
  }

  return (
    <Container>
      <Menu />
      <h1>Software anecdotes</h1>
      <Notification notification={notification} />

      <Routes>
        <Route path='/' element={<AnecdoteList anecdotes={anecdotes} />} />
        <Route path='/anecdotes' element={<AnecdoteList anecdotes={anecdotes} />} />
        <Route path='/create' element={<CreateNew addNew={addNew} />} />
        <Route path='/about' element={<About />} />
        <Route path='/anecdotes/:id' element={anecdote !== undefined ? <Anecdote anecdote={anecdote} vote={vote} /> : <Navigate replace to='/anecdotes' />} />
      </Routes>

      <div>
        <Footer />
      </div>
    </Container>
    // <div className='container'>

    // </div>
  )
}

export default App
