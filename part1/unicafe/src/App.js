import { useState } from "react";
import './App.css'

const Statistics = ({good, neutral, bad}) => {
  const all = good + neutral + bad

  if (all === 0) {
    return (
      <div>
        <p className="header">statistics</p>
        No feedback given
      </div>
    )
  }

  const avg = (good - bad)/all
  const positive = good/all*100

  return (
    <div>
      <p className="header">statistics</p>
      <table>
        <thead></thead>
        <tbody>
        <tr>
          <td>good</td>
          <td>{good}</td>
        </tr>
        <tr>
          <td>neutral</td>
          <td>{neutral}</td>
        </tr>
        <tr>
          <td>bad</td>
          <td>{bad}</td>
        </tr>
        <tr>
          <td>all</td>
          <td>{all}</td>
        </tr>
        <tr>
          <td>average</td>
          <td>{avg}</td>
        </tr>
        <tr>
          <td>positive</td>
          <td>{positive} %</td>
        </tr>
        </tbody>
      </table>
    </div>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleButtonClicked = (handler, value) => {
    handler(value + 1)
  }

  return (
    <div>
      <p className="header">give feedback</p>
      <p>
        <button onClick={() => {handleButtonClicked(setGood, good)}}>good</button>
        <button onClick={() => {handleButtonClicked(setNeutral, neutral)}}>neutral</button>
        <button onClick={() => {handleButtonClicked(setBad, bad)}}>bad</button>
      </p>
      <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

export default App;