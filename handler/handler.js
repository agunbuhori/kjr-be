function errorHandler(data) {
  return {
    status: "error",
    message: data 
  }
}

function succesHandler(data) {
  return {
    status: "success",
    message: data 
  }
}

module.exports = {succesHandler, errorHandler}