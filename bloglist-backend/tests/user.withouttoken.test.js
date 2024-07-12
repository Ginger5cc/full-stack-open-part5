const bcrypt = require('bcrypt')


const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')
const api = supertest(app)
const _ = require('lodash')

describe('test user api usage without token', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
  
    const blogObjects = helper.initialBlog
      .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
  })
 
  test.only('add a new post with a token', async() => {
    /* 
    const newUser = {
      username: 'test01',
      name: 'testtest',
      password: '123456789',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    */

    const loginuser = {
      username: 'test01',
      password: '123456789'
    }
    let token = "";
    const response = await api
      .post("/api/login")
      .send(loginuser)

    token = response.body.token

    const newBlog = {
      title: 'Blog with a token 2',
      author: 'Happy Testing',
      url: 'www.url123.com',
      likes: 87
    }
  
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
  
    const blogsAtEnd = await helper.blogsInDb()
  
    assert.strictEqual(blogsAtEnd.length, helper.initialBlog.length + 1)
    const titles = blogsAtEnd.map(n => n.title)
    assert(titles.includes('Blog with a token 2'))
  })

  test('add a new post without token', async() => {
    const newBlog = {
      title: 'This blog will be added without a token',
      author: 'Ariel Pink',
      url: 'www.url.com',
      likes: 9
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
  
    const blogsAtEnd = await helper.blogsInDb()
  
    assert.strictEqual(blogsAtEnd.length, helper.initialBlog.length)
  })

  test('delete a new post without token', async() => {
    await api
      .delete('/api/blogs/668c4d5ae4e75f041f07fea5')
      .expect(401)
  
    const blogsAtEnd = await helper.blogsInDb()
  
    assert.strictEqual(blogsAtEnd.length, helper.initialBlog.length)
  })

})

after(async () => {
    await mongoose.connection.close()
  })