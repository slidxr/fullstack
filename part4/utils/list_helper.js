const lodash = require('lodash')
const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    const blogLikes = blogs.map(blog => blog.likes)
    const indexBlog = blogLikes.indexOf(Math.max(...blogLikes))

    return {
        title: blogs[indexBlog].title,
        author: blogs[indexBlog].author,
        likes: blogs[indexBlog].likes
    }
}

const mostBlogs = (blogs) => {
    const authors = blogs.map(blog => blog.author)
    const authorCount = lodash.countBy(authors)
    const authorCountArray = lodash.toPairs(authorCount)
    const authorCountSorted = lodash.sortBy(authorCountArray, [1])
    const authorCountSortedReversed = lodash.reverse(authorCountSorted)

    return {
        author: authorCountSortedReversed[0][0],
        blogs: authorCountSortedReversed[0][1]
    }
}

const mostLikes = (blogs) => {
    const authorLikes = {}
    blogs.forEach(blog => {
        if (authorLikes[blog.author]) {
            authorLikes[blog.author] += blog.likes
        } else {
            authorLikes[blog.author] = blog.likes
        }
    })

    let mostLikedAuthor = ''
    let mostLikes = 0

    for (let author in authorLikes) {
        if (authorLikes[author] > mostLikes) {
            mostLikedAuthor = author
            mostLikes = authorLikes[author]
        }
    }

    return {
        author: mostLikedAuthor,
        likes: mostLikes
    }

}


module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}