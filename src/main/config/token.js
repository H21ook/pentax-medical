import jwt from 'jsonwebtoken'

export const getAccessToken = (data) => {
  const token = jwt.sign(data, 'PENTAX_PASSWORD_SECRET', {
    expiresIn: '10h',
    audience: data.id.toString(),
    issuer: 'bitsup.mn'
  })

  return token
}

export const verifyToken = (token) => {
  const tokenData = jwt.verify(token, 'PENTAX_PASSWORD_SECRET')
  return tokenData
}
