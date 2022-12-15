import React from "react"
import { v4 } from 'uuid'

const Header = (props) => {
  return (
    <h1>{props.course}</h1>
  )
}

const Part = (props) => {
  const name = props.name
  const exercises = props.exercises
  return (
    <p>
      {name} {exercises}
    </p>
  )
}

const Content = (props) => {
  const loading = (<p>Loading...</p>)
  let container = []

  props.parts.forEach(part => {
    container.push(<Part key={v4()} name={part.name} exercises={part.exercises} />)
  });

  return (
    container.length > 0 ? container : loading
  )
}

const Total = (props) => {
  let total = 0
  const parts = props.parts
  parts.forEach(part => {
    total += part.exercises
  })
  return (
    <p>Number of exercises {total}</p>
  )
}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

export default App