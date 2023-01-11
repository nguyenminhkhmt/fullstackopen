import { useState } from 'react'
import loginService from '../services/login'
import { connect } from 'react-redux'
import { setMessageWithTimeout } from '../reducers/messageReducer'
import { setLogin } from '../reducers/userReducer'
import { Form, Button } from 'react-bootstrap'

const LoginForm = (props) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      props.setLogin(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      props.setMessageWithTimeout({ type: 'failed', body: 'Wrong credentials' }, 5)
    }
  }

  return (
    <div>
      <h2>Login</h2>
      <Form onSubmit={handleLogin}>
        <Form.Label>username</Form.Label>
        <Form.Control id='username' value={username} onChange={({ target }) => setUsername(target.value)} />
        <Form.Label>password</Form.Label>
        <Form.Control id='password' type="password" value={password} onChange={({ target }) => setPassword(target.value)} />
        <Button id='login-button' type="submit">login</Button>
      </Form>
    </div>
  )
}

const mapDispatchToProps = {
  setMessageWithTimeout,
  setLogin
}

const connectedLoginForm = connect(null, mapDispatchToProps)(LoginForm)
export default connectedLoginForm