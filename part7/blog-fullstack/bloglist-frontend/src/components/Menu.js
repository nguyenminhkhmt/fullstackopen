import { connect } from 'react-redux'
import { logout } from '../reducers/userReducer'
import { Nav, Dropdown, ButtonGroup, Button } from 'react-bootstrap'

const DropdownMenu = ({ user, handleLogout }) => {
  const style = {
    marginTop: '-12px'
  }

  return (
    <Dropdown style={style} as={ButtonGroup}>
      <Button variant="link">{user.name}</Button>
      <Dropdown.Toggle variant="link" id="dropdown-split-basic" />

      <Dropdown.Menu>
        <Dropdown.Item>Profile</Dropdown.Item>
        <Dropdown.Item href="#" onClick={handleLogout}>Logout</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  )
}

const Menu = (props) => {
  const { user } = props

  const handleLogout = (event) => {
    event.preventDefault()
    if (window.confirm('Are you sure to logout?')) {
      props.logout()
    }
  }

  return (
    <Nav className="custom_nav justify-content-end" activeKey="/home">
      <Nav.Item>
        <Nav.Link href="/">Home</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href='/blogs'>Blogs</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href='/users'>Users</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link>
          {
            user !== null ? <DropdownMenu user={user} handleLogout={handleLogout} /> :
              null
          }
        </Nav.Link>
      </Nav.Item>
    </Nav>
  )
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}

const mapDispatchToProps = {
  logout
}

const connectedMenu = connect(
  mapStateToProps,
  mapDispatchToProps
)(Menu)
export default connectedMenu