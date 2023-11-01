const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const helper = require('./test_helper.test')

const api = supertest(app)

const initialBlogs = [
    {
        title: 'Test Blog 1',
    },
    {
        title: 'Test Blog 2',
    }];

beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash("testpass", 10)
    const user = new User({
        username: "slidxr11",
        name: "slidxr123",
        blogs: [],
        passwordHash
    })

    await user.save()
})



beforeEach(async () => {
    await Blog.deleteMany({})

    const users = await User.find({})
    const user = users[0]

    const blogObjects = helper.initialBlogs
        .map(blog => new Blog({
            title: blog.title,
            author: blog.author,
            url: blog.url,
            user: user._id,
            likes: blog.likes ? blog.likes : 0
        }))

    const promiseArray = blogObjects.map(blog => {
        blog.save()
        user.blogs = user.blogs.concat(blog._id)
    })
    await Promise.all(promiseArray)
    await user.save()
})


describe('Blogs are saved in database', () => {
    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body).toHaveLength(initialBlogs.length)
    })

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
})

describe('Spesific blog', () => {
    test('a valid blog can be added by authorized user', async () => {

            const user = {
                username: "slidxr11",
                password: "testpass",
            }

            const loginUser = await api
                .post('/api/login')
                .send(user)

        const newBlog = {
            title: 'Test Blog 3',
            author: 'Test Author 3',
            url: 'Test URL 3',
            likes: 3
        }

        const test_post = await api
            .post('/api/blogs')
            .send(newBlog)
            .set('Authorization', `Bearer ${loginUser.body.token}`)
        expect(test_post.status).toBe(201)

    })

    test('a blog cannot be added by unauthorized user', async () => {

            const newBlog = {
                title: 'Test Blog 3',
                author: 'Test Author 3',
                url: 'Test URL 3',
                likes: 3
            }

            await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(401)
                .expect('Content-Type', /application\/json/)
    })

    test('if the likes property is missing from the request, it will default to the value 0', async () => {

        const user = {
            username: "slidxr11",
            password: "testpass",
        }

        const loginUser = await api
            .post('/api/login')
            .send(user)

        const newBlog = {
            title: 'Test Blog 4',
            author: 'Test Author 4',
            url: 'Test URL 4'
        }

        const test_post = await api
            .post('/api/blogs')
            .send(newBlog)
            .set('Authorization', `Bearer ${loginUser.body.token}`)
        expect(test_post.status).toBe(201)
        const response = await api.get('/api/blogs')
        expect(response.body[response.body.length - 1].likes).toBe(0)

    })

    test('if the title or url properties are missing from the request data, ' +
        'the backend responds to the request with the status code 400 Bad Request.', async () => {

        const user = {
            username: "slidxr11",
            password: "testpass",
        }

        const loginUser = await api
            .post('/api/login')
            .send(user)

        const newBlog = {
            author: 'Test Author 5',
        }

        const test_post = await api
            .post('/api/blogs')
            .send(newBlog)
            .set('Authorization', `Bearer ${loginUser.body.token}`)
        expect(test_post.status).toBe(400)
    })

    afterAll(async () => {
        await mongoose.connection.close()
    })
})

describe('deletion of a blog', () => {
    test('a blog can be deleted', async () => {

        const user = {
            username: "slidxr11",
            password: "testpass",
        }

        const loginUser = await api
            .post('/api/login')
            .send(user)

        const blogsAtStart = await Blog.find({})

        const blogToDelete = blogsAtStart[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204)
            .set('Authorization', `Bearer ${loginUser.body.token}`)

        const blogsAtEnd = await Blog.find({})

        const contents = blogsAtEnd.map(r => r.title)
        expect(contents).not.toContain(blogToDelete.title)
    })
})

describe('update of a blog', () => {
    test('the information of an individual blog post is updated', async () => {
        const blogsAtStart = await Blog.find({})
        const blogToUpdate = blogsAtStart[0]

        const newBlog = {
            title: blogsAtStart[0].title,
            author: blogsAtStart[0].author,
            url: blogsAtStart[0].url,
            likes: 200
        }

        await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(newBlog)
            .expect(200)

        const blogsAtEnd = await Blog.find({})
        expect(blogsAtEnd[0].likes).toBe(200)
    })
})

test('creation fails with proper status code and send message if username or password too short', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
        username: 'slidxr12',
        name: 'Slidxr 12',
        password: 'te',
    }

const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/ )

expect(result.body.error).toContain('username or password too short')

const usersAtEnd = await helper.usersInDb()
expect(usersAtEnd).toEqual(usersAtStart)
})