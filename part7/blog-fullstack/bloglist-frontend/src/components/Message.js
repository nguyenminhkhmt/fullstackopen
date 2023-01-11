import { connect } from 'react-redux'
import { Alert } from 'react-bootstrap'

const Message = ({ message }) => {
  if (message === null || message === undefined) {
    return (null)
  }

  return (
    <Alert variant={message.type}>{message.body}</Alert>
  )
}

const mapStateToProps = (state) => {
  return {
    message: state.message
  }
}

const connectedMessage = connect(
  mapStateToProps
)(Message)

export default connectedMessage