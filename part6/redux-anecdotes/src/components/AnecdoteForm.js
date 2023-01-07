import { connect } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteForm = (props) => {
  const handleSave = async (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    await props.createAnecdote(content)
    props.setNotification(`'${content}' is added`, 5)
  }

  return (
    <form onSubmit={handleSave}>
      <div><input name='note' /></div>
      <button>create</button>
    </form>
  )
}

const mapDispatchToProps = {
  createAnecdote,
  setNotification
}

const ConnectedAnecdoteForm = connect(
  null,
  mapDispatchToProps
)(AnecdoteForm)

export default ConnectedAnecdoteForm