const _ = require('lodash')

const dummy = (blogs) => {
    return 1
  }


const totalLikes = (blogs) => {
    return blogs.length === 0
        ? 0
        : blogs.reduce((sum, item) => sum + item.likes, 0)
}

const favoriteBlog = (blogs) => {
    const findMax = () => {
        const max = blogs.reduce((acc, item) => {return Math.max(acc, item.likes)}, blogs[0].likes)
        const favBlog = blogs.find(item => item.likes === max)
        const output = {
            title: favBlog.title,
            author: favBlog.author,
            likes: favBlog.likes
        }
        return output
    }
    return blogs.length === 0 
        ? 0 
        : findMax()
}

const mostBlogs = (blogs) => {
    
    const result = _(blogs)
        .countBy("author")              
        .toPairs()                    
        .maxBy(1)  
            
    console.log(result)
    return {
        author: result[0],
        blogs: result[1]
      }
}

const mostLikes = (blogs) => {
    const result = _(blogs)
        .groupBy("author")              
        .map((objs, key) => ({
            'title': key,
            'totalLikes': _.sumBy(objs, 'likes') }))   
        .maxBy(n => n.totalLikes)
    console.log(result)
    return {
        author: result.title,
        likes: result.totalLikes
    }
    
}

  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
  }