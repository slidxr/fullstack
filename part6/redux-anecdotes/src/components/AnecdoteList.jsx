import { useDispatch, useSelector } from "react-redux";
import { addVote } from "../reducers/anecdoteReducer";

const Anecdote = ({ anecdote, handleClick }) => {
    return(
        <div key={anecdote.id}>
            <div>
                {anecdote.content}
            </div>
            <div>
                has {anecdote.votes}
            <button onClick={handleClick}>
                vote
            </button>
            </div>
        </div>
    )}

const AnecdoteList = () => {
    const dispatch = useDispatch()
    const anecdotes = useSelector(state => state.sort((a,b) => b.votes - a.votes))
    const vote = (id) => {
        dispatch(addVote(id))
    }

    return(
        <div>
            {anecdotes.map(anecdote =>
                <Anecdote
                key={anecdote.id}
                anecdote={anecdote}
                handleClick={() => vote(anecdote.id)
                }
                />
            )}
        </div>
)}

export default AnecdoteList
