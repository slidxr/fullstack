
const Header = (props) => {
    return (
        <div>
            <h1>{props.course.name}</h1>
        </div>
    )
}

const Part = (props) => {
    return (
        <p>{props.parts.name} {props.parts.exercises}</p>
    )
}

const Content = (props) => {
    const parts = props.parts.map(part =>  { return <Part parts={part} key={part.id} /> } )
    return (
        <div>
            {parts}
        </div>
    )
}

const Total = (props) => {

    const totalNumber = props.parts.reduce((sum, part) => sum + part.exercises, 0)

    return (
        <div>
            <p>Total of {totalNumber} exercises </p>
        </div>
    )
}

export const Course = (props) => {
    return (
        <>
            <Header course={props.course} />
            <Content parts={props.course.parts} />
            <Total parts={props.course.parts} />
        </>
    )
}