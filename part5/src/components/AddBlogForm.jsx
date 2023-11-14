import { useState } from 'react'


const AddBlogForm = ({ createBlog }) => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')
    const [likes, setLikes] = useState('')

    const handleTitleChange = (event) => {
        setTitle(event.target.value)
    }

    const handleAuthorChange = (event) => {
        setAuthor(event.target.value)
    }

    const handleUrlChange = (event) => {
        setUrl(event.target.value)
    }

    const handleLikesChange = (event) => {
        setLikes(event.target.value)
    }

    const addBlog = (event) => {
        event.preventDefault()
        createBlog({
            title: title,
            author: author,
            url: url,
            likes: likes
        })
        setTitle('')
        setAuthor('')
        setUrl('')
        setLikes('')
    }

    return (
        <div>
            <h2>create new</h2>
            <form onSubmit={addBlog}>
                <div>
                    title:
                    <input
                        type="text"
                        value={title}
                        name="Title"
                        onChange={handleTitleChange}
                        placeholder={'Title'}
                    />
                </div>
                <div>
                    author:
                    <input
                        type="text"
                        value={author}
                        name="Author"
                        onChange={handleAuthorChange}
                        placeholder={'Author'}
                    />
                </div>
                <div>
                    url:
                    <input
                        type="url"
                        value={url}
                        name="url"
                        onChange={handleUrlChange}
                        placeholder={'Url'}
                    />
                </div>
                <div>
                    likes:
                    <input
                        type="likes"
                        value={likes}
                        name="likes"
                        onChange={handleLikesChange}
                        placeholder={'likes'}
                    />
                </div>
                <button type="submit">create</button>
            </form>
        </div>
    )
}
export default AddBlogForm