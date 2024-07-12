import React from 'react'

const Blogdisplay = ({ blog }) => {

  return (
    <div className="try">
      {blog.title} by {blog.author}
      <button>View</button>
    </div>
  )}

export default Blogdisplay