function authorize(req, res, next) {
  if (req.headers.authorization === 'Bearer bla bla bla') {
    next();
  } else {
    res.status(403).send({
      status: 403,
      message: "Unauthorized"
    });
  }
}

module.exports = authorize