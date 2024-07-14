import jwt from 'jsonwebtoken'

export const validateToken = (secretToken) => {
  return (req, res, next) => {
    try {
      //get token from request header.
      const authHeader = req.headers['authorization']
      const token = authHeader.split(' ')[1]
      // the request header contains the token "Bearer <token>", split the string and use the second value in the split array.
      if (token == null) {
        res.sendStatus(400).send('Please provide a valid session token or login again.')
        return
      }
      jwt.verify(token, secretToken, (err, user) => {
        if (err) {
          res.status(403).send('Session expired. Please login again.')
        } else {
          req.user = user
          next() //proceed to the next action in the calling function
        }
      }) //end of jwt.verify()
    } catch (error) {
      res.status(403).send('No Session Token provided.')
    }

  }}
 //end of function
