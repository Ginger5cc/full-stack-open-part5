const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const api = supertest(app)
const _ = require('lodash')


beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlog
    .map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})



//ex 4.8
test('notes are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

//ex 4.9
test('whether the unique identifier property is named id', async () => {
  const response = await api.get('/api/blogs').expect(200)
  const checkID = response.body.every(n => 'id' in n)
  assert.strictEqual(checkID, true)
})

//ex 4.10
test('a valid blog can be added ', async () => {
  const newBlog = {
    title: "Testing Blog",
    author: "Dr. you know who",
    url: "https://testingblogpost.com/",
    likes: 11,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlog.length + 1)

  const titles = blogsAtEnd.map(n => n.title)
  assert(titles.includes('Testing Blog'))
})

//ex 4.12
test('Blog without title is not added', async () => {
  const newBlog = {
    author: 'Happy Birthday'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()

  assert.strictEqual(blogsAtEnd.length, helper.initialBlog.length)
})

//ex 4.12
test('Blog without url is not added', async () => {
  const newBlog = {
    title: 'This blog does not have url',
    author: 'Ariel Pink'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()

  assert.strictEqual(blogsAtEnd.length, helper.initialBlog.length)
})

//4.11
test('Like assign to zero if not given', async () => {
  const newBlog = {
    title : 'Happy Happy World',
    author: 'Mary Pop Pie',
    url: 'http://happyhappyworld.com'
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  const addedBlog = blogsAtEnd.find( n=> n.title === newBlog.title)
  assert.strictEqual(addedBlog.likes, 0)

})

//ex 4.13
test('delete a blog', async() => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()
  const titles = blogsAtEnd.map(r => r.title)

  assert(!titles.includes(blogToDelete.title))
  
  assert.strictEqual(blogsAtEnd.length, helper.initialBlog.length - 1)
})

//ex 4.14
test('update the author and likes of a blog with the same title', async() => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = _.find(blogsAtStart, {title: "Promises do not always work"})

  const updateBlog = {
    title: "Promises do not always work",
    author: "Sad Pan",
    url: "http://promisesuse.html",
    likes: 30
  }
  
  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updateBlog)
    .expect(200)
  
  const blogsAtEnd = await helper.blogsInDb()
  const authors = blogsAtEnd.map(n => n.author)
  assert(authors.includes(updateBlog.author))
  assert(!authors.includes(blogToUpdate.author))
  assert.strictEqual(blogsAtEnd.length, helper.initialBlog.length )
})

//ex 4.14
test('update the likes of a blog with the same title and author', async() => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = _.find(blogsAtStart, {title: "Promises do not always work"})
  
  const updateBlog = {
    title: "Promises do not always work",
    author: "Happy Pan",
    url: "http://promisesuse.html",
    likes: 59
  }
  
  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updateBlog)
    .expect(200)
  
  const blogsAtEnd = await helper.blogsInDb()
  const blogUpdated = _.find(blogsAtEnd, {id: blogToUpdate.id})
  assert.strictEqual(blogUpdated.likes, updateBlog.likes)
  assert.strictEqual(blogsAtEnd.length, helper.initialBlog.length )
})

after(async () => {
  await mongoose.connection.close()
})

