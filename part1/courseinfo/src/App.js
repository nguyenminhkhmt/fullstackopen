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

  props.courses.forEach(course => {
    // console.log(course)
    container.push(<Part key={v4()} name={course.name} exercises={course.exercises}/>)
  });

  return (
    container.length > 0 ? container : loading
  )
}

const Total = (props) => {
  return (
    <p>Number of exercises {props.total}</p>
  )
}

const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14
  const courses = [
    {name:[part1], exercises:[exercises1]},
    {name:[part2], exercises:[exercises2]},
    {name:[part3], exercises:[exercises3]}
  ]

  return (
    <div>
      <Header course={course} />
      <Content courses={courses} />
      <Total total={exercises1 + exercises2 + exercises3} />
    </div>
  )
}

export default App