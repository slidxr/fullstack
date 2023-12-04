import { useDispatch, useSelector } from "react-redux";
import { addVote } from "../reducers/anecdoteReducer";
import { showNotification } from "../reducers/notificationReducer";

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
    const anecdotes = useSelector(state => {
        if (state.filter === null) {
            return state.anecdotes
                    .sort((a, b) => b.votes - a.votes)
        }
        return state.anecdotes.filter((anecdote) =>
            anecdote.content
                .toLowerCase()
                .includes(state.filter.toLowerCase()))
                .sort((a, b) => b.votes - a.votes)
        })

    const dispatch = useDispatch()
    const vote = (id, content) => {
        dispatch(addVote(id))
        dispatch(showNotification(`You voted for "${content}"`))
        setTimeout(()=> {
            dispatch(showNotification(''))
        }, 5000)
    }

    return(
        <div>
            {anecdotes.map(anecdote =>
                <Anecdote
                key={anecdote.id}
                anecdote={anecdote}
                handleClick={() => vote(anecdote.id, anecdote.content)
                }
                />
            )}
        </div>
)}

export default AnecdoteList
