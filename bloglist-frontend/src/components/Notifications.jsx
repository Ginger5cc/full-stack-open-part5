
const Notification = ({ errorMessage }) => {
  if (errorMessage === null) {
    return null
  }

  return (
    <div className={errorMessage.type} >
      {errorMessage.content}
    </div>
  )

}


export default Notification