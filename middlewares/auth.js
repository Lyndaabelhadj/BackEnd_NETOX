import  jwt  from 'jsonwebtoken';
import createError from 'http-errors';
 



export function  signAccessToken (userId) {
    return new Promise((resolve, reject) => {
      const payload = {}
      const secret = 'verySecretValue'
      const options = {
        expiresIn: '1h',
        audience: userId,
      }
      jwt.sign(payload, secret, options, (err, token) => {
        if (err) {
          console.log(err.message)
          reject(createError.InternalServerError())
          return
        }
          resolve(token)
        })
      })
    }