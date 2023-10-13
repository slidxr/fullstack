import { useState } from 'react'


const Statistics = (props) => {
    if (props.good === 0 && props.neutral === 0 && props.bad === 0) {
        return (
            <div>
                <p>No feedback given</p>
            </div>
        )
    }

    return (
        <table>
            <tbody>
                <StatisticLine text={'Good: '} value={props.good} />
                <StatisticLine text={'Neutral: '} value={props.neutral} />
                <StatisticLine text={'Bad: '} value={props.bad} />
                <StatisticLine text={'All: '} value={props.good + props.neutral + props.bad} />
                <StatisticLine text={'Average: '} value={(props.good - props.bad) / (props.good + props.neutral + props.bad)} />
                <StatisticLine text={'Positive: '} value={(props.good / (props.good + props.neutral + props.bad)) * 100 + ' %'} />
            </tbody>
        </table>
    )
}

const StatisticLine = (props) => {
    return (
        <tr>
            <td>{props.text}</td>
            <td>{props.value}</td>
        </tr>
    )
}

const Button = (props) => {
    return (
        <button onClick={props.handleClick}>
            {props.text}
        </button>
    )
}
const App = () => {
    // save clicks of each button to its own state
    const [good, setGood] = useState(0)
    const [neutral, setNeutral] = useState(0)
    const [bad, setBad] = useState(0)

    return (
        <div>
            <h1>Give Feedback </h1>
            <div>
                <Button handleClick={() => setGood(good + 1)} text={'good'} />
                <Button handleClick={() => setNeutral(neutral + 1)} text={'neutral'} />
                <Button handleClick={() => setBad(bad + 1)} text={'bad'} />
            </div>
            <h1>Statistics</h1>
            <Statistics good={good} neutral={neutral} bad={bad} />
        </div>
    )
}

export default App