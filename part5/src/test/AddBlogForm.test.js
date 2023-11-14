import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import AddBlogForm from "../components/AddBlogForm.jsx";
import userEvent from '@testing-library/user-event'

test('AddBlogForm call onSubmit and update the state', async() => {
    const createBlog = jest.fn()
    const user = userEvent.setup()

    render (
        <AddBlogForm createBlog={createBlog}/>
    )

    const title = screen.getByPlaceholderText('Title')
    const author = screen.getByPlaceholderText('Author')
    const url = screen.getByPlaceholderText('Url')
    const form = screen.getByText('create')

    await user.type(title, 'Test number 4')
    await user.type(author, 'James McDale')
    await user.type(url, 'http://localhost.com')
    await user.click(form)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('Test number 4')
    expect(createBlog.mock.calls[0][0].author).toBe('James McDale')
    expect(createBlog.mock.calls[0][0].url).toBe('http://localhost.com')
})
