import { useState } from 'react'

const Blog = (({blog}) => {
    const blogStyle = {
        paddingTop: 12,
        paddingLeft: 4,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 4
    }

    const [visible, setVisible] = useState(false)

    const hideWhenVisible = { display: visible ? 'none' : '' }
    const showWhenVisible = { display: visible ? '' : 'none' }

    const toggleVisibility = () => {
        setVisible(!visible)
    }

    return (
        <div style={blogStyle}>
            <div style={hideWhenVisible}>
                {blog.title} {blog.author}
                <button onClick={toggleVisibility}>view</button>
            </div>
            <div style={showWhenVisible}>
                {blog.title} {blog.author}
                <button onClick={toggleVisibility}>hide</button>
                <p>{blog.url}</p>
                <p>
                    Likes: {blog.likes}
                </p>
                <p>
                    {blog.user.username}
                </p>
            </div>
        </div>
    )})

export default Blog