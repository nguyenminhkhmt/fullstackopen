import { useEffect, useState } from 'react'
import update from 'immutability-helper';
import './App.css'

const MostVote = ({index, anecdote, vote}) => {
  if (index < 0) {
    return null    
  }

  return (
    <div>
      <p className='header'>Anecdote with most votes</p>
      {anecdote}<br/>
      has {vote} votes
    </div>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.'
  ]
  const defaultVotes = Array(anecdotes.length).fill(0)

  const getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
  }

  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(defaultVotes)
  const [mostVoteIndex, setMostVoteIndex] = useState(-1)

  const nextAnecdote = () => {
    const random = getRandomInt(anecdotes.length)
    // console.log(random)
    setSelected(random)
  }

  const voteAnecdote = () => {
    let newVotes = update(votes, {
      [selected]: { $set: votes[selected] + 1 }
    })
    // console.log(newVotes)
    setVotes(newVotes)
  }

  useEffect(
    () => {
      const maxValue = Math.max(...votes)
      if (maxValue === 0) {
        return
      }

      const isMaxValue = (value) => {
        return value === maxValue
      }

      const mostVoteIndex = votes.findIndex(isMaxValue)
      setMostVoteIndex(mostVoteIndex)
    },
    [votes]
  )

  return (
    <div>
      <p className='header'>Anecdote of the day</p>
      {anecdotes[selected]}
      <br />
      has {votes[selected]} votes
      <br />
      <button onClick={voteAnecdote}>vote</button>
      <button onClick={nextAnecdote}>next anecdote</button>
      <br/>
      <MostVote index={mostVoteIndex} anecdote={anecdotes[mostVoteIndex]} vote={votes[mostVoteIndex]}/>
    </div>
  )
}

export default App