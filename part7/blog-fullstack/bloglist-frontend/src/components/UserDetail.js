import { useEffect, useState } from 'react'
import SimpleBlogList from './SimpleBlogList'
import usersService from '../services/users'
import { connect } from 'react-redux'

const useUser = (id, users) => {
  const [user, setUser] = useState(null)
  useEffect(() => {
    if (users) {
      const data = users.find(user => user.id === id)
      if (data) {
        setUser(data)
        return
      }
    }

    usersService.getUser(id).then(data => {
      setUser(data)
    })
  }, [id])

  return user
}

const UserDetail = (props) => {
  const { userId, users } = props
  const user = useUser(userId, users)
  if (user === null) {
    return (
      <div>
        User not found
      </div>
    )
  }

  const blogs = user.blogs
  return (
    <div>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <SimpleBlogList blogs={blogs} />
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    users: state.users
  }
}

const connectedUserDetail = connect(mapStateToProps)(UserDetail)
export default connectedUserDetail