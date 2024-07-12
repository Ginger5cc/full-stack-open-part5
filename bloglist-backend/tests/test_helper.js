const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlog = [
    {
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
    },
    {
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
    },
    {
        title: "Overreacting",
        author: "You know who",
        url: "https://overreacting.com/",
        likes: 10,
    },
    {
        title: "Promises do not always work",
        author: "Happy Pan",
        url: "http://promisesuse.html",
        likes: 3,
    },
  ]


const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlog,
  nonExistingId,
  blogsInDb,
  usersInDb,
}