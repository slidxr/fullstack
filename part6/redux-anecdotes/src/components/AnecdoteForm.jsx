import { useDispatch } from "react-redux" 
import { addAnecdote } from "../reducers/anecdoteReducer"
import { showNotification } from "../reducers/notificationReducer"

const AnecdoteForm = () => {
    const dispatch = useDispatch()

    const createAnecdote = (event) => {
        event.preventDefault()
        const content = event.target.anecdote.value
        event.target.anecdote.value = ''
        dispatch(addAnecdote(content))
        dispatch(showNotification(`You added ${content}`))
        setTimeout(()=> {
            dispatch(showNotification(''))
        }, 5000)
    }


    return(
        <div>
        <h2>create new</h2>
        <form onSubmit={createAnecdote}>
        <div>
        <input name='anecdote'/>
        </div>
        <button type='submit'>create</button>
        </form>
        </div>
    )
}

export default AnecdoteForm
