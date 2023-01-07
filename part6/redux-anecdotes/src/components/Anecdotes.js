import { connect } from 'react-redux'
import { upVotesAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const Anecdote = (props) => {
  const { anecdote, upVotesAnecdote, setNotification } = props
  const vote = (anecdote) => {
    upVotesAnecdote(anecdote.id)
    setNotification(`you voted '${anecdote.content}'`, 5)
  }
  return (
    <div key={anecdote.id}>
      <div>
        {anecdote.content}
      </div>
      <div>
        has {anecdote.votes}
        <button onClick={() => vote(anecdote)}>vote</button>
      </div>
    </div>
  )
}

const Anecdotes = (props) => {
  const { filter, anecdotes, upVotesAnecdote, setNotification } = props
  let filterAnecdotes = anecdotes
  if (filter !== '') {
    filterAnecdotes = anecdotes.filter(note => note.content.toLowerCase().includes(filter.toLowerCase()))
  }

  return (
    <div>
      {filterAnecdotes.map(anecdote => <Anecdote
        key={anecdote.id}
        anecdote={anecdote}
        upVotesAnecdote={upVotesAnecdote}
        setNotification={setNotification}
      />)}
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    filter: state.filter,
    anecdotes: state.anecdotes
  }
}

const mapDispatchToProps = {
  upVotesAnecdote,
  setNotification
}

const ConnectedAnecdotes = connect(
  mapStateToProps,
  mapDispatchToProps
)(Anecdotes)

export default ConnectedAnecdotes