import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import Blog from '../components/Blog.jsx'

test('renders content', () => {
    const blog = {
        title: 'Test number 1',
        author: 'James McDale',
        url: 'http://localhost.com',
        likes: 77,
        user: {
            id: 'slidxr'
        }
    }
    const user = {
        id: 'slidxr'
    }

    const {container} = render(<Blog blog={blog} user={user}/>)

    screen.debug()

    const div = container.querySelector('.hiddenBlog')

    expect(div).toHaveTextContent(
        'Test number 1 James McDale'
    )

    expect(div).toBeDefined()
})

test('content after clicking view button', async () => {
    const oneBlog = {
        title: 'Test number 2',
        author: 'James McDale',
        url: 'http://localhost.com',
        likes: 77,
        user:{
            id:'slidxr'
        }
    }
    const user = {
        id: 'slidxr'
    }

    const { container } = render(<Blog blog={oneBlog} user={user}/>)

    const div = container.querySelector('.shownBlog')

    expect(div).toHaveTextContent('http://localhost.com')
    expect(div).toHaveTextContent('77')
})

test('like button clicked twice', async () => {
    const oneBlog = {
        title: 'Test number 3',
        author: 'James McDale',
        url: 'http://localhost.com',
        likes: 77,
        user:{
            id:'slidxr'
        }
    }
    const user = {
        id: 'slidxr'
    }

    const mockHandler = jest.fn()

    render(<Blog blog={oneBlog} user={user} addLikes={mockHandler}/>)

    const users = userEvent.setup()
    const button = screen.getByText('like')
    await users.click(button)
    await users.click(button)

    expect(mockHandler.mock.calls).toHaveLength(2)
})