const Message = ({ message }) => {
  if (message === null || message === undefined) {
    return (null)
  }

  const messageClass = `message ${message.type}`

  return (
    <p className={messageClass}>{message.body}</p>
  )
}

export default Message