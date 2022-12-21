
const Header = ({ header }) => {
    return (
      <p className='header'>
        {header}
      </p>
    )
  }
  
  const Part = ({ part }) => {
    // console.log(part)
  
    return (
      <tr>
        <td>{part.name}</td>
        <td>{part.exercises}</td>
      </tr>
    )
  }
  
  const Content = ({ parts }) => {
    return (
      <tbody>
        {parts.map(part => <Part key={part.id} part={part} />)}
      </tbody>
    )
  }
  
  const Course = (props) => {
    const { id, name, parts } = props.course
    return (
      <div>
        <Header header={name} />
        <table>
          <Content parts={parts} />        
        </table>
        <Total key={id} parts={parts} />
      </div>
    )
  }
  
  const Total = ({ parts }) => {
    const total = parts.reduce((sum, part) => sum + part.exercises, 0)
    return (
      <p className='footer'>
        total of {total} exercises
      </p>
    )
  }
  
  export default Course