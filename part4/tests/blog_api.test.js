const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
    {
        title: 'Test Blog 1',
    },
    {
        title: 'Test Blog 2',
    }];

beforeEach(async () => {
    await Blog.deleteMany({})
    let noteObject = new Blog(initialBlogs[0])
    await noteObject.save()
    noteObject = new Blog(initialBlogs[1])
    await noteObject.save()})

test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogs.length)})

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('there are two blogs', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(2)
})

test('unique identifier property of the blog posts is named id', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body[0].id).toBeDefined()
})

test('HTTP POST request to the /api/blogs URL successfully creates a new blog post', async () => {

    const newBlog = {
        title: 'Test Blog 3',
        author: 'Test Author 3',
        url: 'Test URL 3',
        likes: 3
    }

    const test_post = await api.post('/api/blogs').send(newBlog)
    expect(test_post.status).toBe(201)
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogs.length + 1)

})

test('if the likes property is missing from the request, it will default to the value 0', async () => {

        const newBlog = {
            title: 'Test Blog 4',
            author: 'Test Author 4',
            url: 'Test URL 4'
        }

        const test_post = await api.post('/api/blogs').send(newBlog)
        expect(test_post.status).toBe(201)
        const response = await api.get('/api/blogs')
        expect(response.body[response.body.length - 1].likes).toBe(0)

})

test('if the title or url properties are missing from the request data, ' +
    'the backend responds to the request with the status code 400 Bad Request.', async () => {

            const newBlog = {
                author: 'Test Author 5',
            }

            const test_post = await api.post('/api/blogs').send(newBlog)
            expect(test_post.status).toBe(400)
    })

afterAll(async () => {
    await mongoose.connection.close()
})