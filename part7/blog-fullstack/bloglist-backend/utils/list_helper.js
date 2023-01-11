const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => { return sum + item.likes }
  return blogs.length === 0 ? 0 : blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0)
    return null

  const reducer = (maxItem, item) => { return maxItem.likes < item.likes ? item : maxItem }
  let result = blogs.reduce(reducer, blogs[0])
  delete result.url
  delete result._id
  delete result.__v
  console.log(result)
  return result
}

const groupBy = (x, f) => x.reduce((a, b, i) => ((a[f(b, i, x)] ||= []).push(b), a), {})
const groupByAuthor = (blogs) => {
  return groupBy(blogs, blog => blog.author)
}

const mostBlogs = (blogs) => {
  const groupedItems = groupByAuthor(blogs)
  let comparedArr = []
  for (const author in groupedItems) {
    comparedArr.push({ 'author': author, 'blogs': groupedItems[author].length })
  }
  console.log(comparedArr)

  const reducer = (maxItem, item) => { return maxItem.blogs < item.blogs ? item : maxItem }
  let result = comparedArr.reduce(reducer, comparedArr[0])
  console.log(result)
  return result
}

const mostLikes = (blogs) => {
  const groupedItems = groupByAuthor(blogs)
  let comparedArr = []
  for (const author in groupedItems) {
    comparedArr.push({ 'author': author, 'likes': groupedItems[author].reduce((sum, blog) => sum + blog.likes, 0) })
  }
  console.log(comparedArr)

  const reducer = (maxItem, item) => { return maxItem.likes < item.likes ? item : maxItem }
  let result = comparedArr.reduce(reducer, comparedArr[0])
  console.log(result)
  return result
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}