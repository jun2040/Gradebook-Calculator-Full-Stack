const axios = require("axios")

exports.login = (payload) => {
  return axios.post('/auth/login', payload)
    .then((res) => {
      if (res.data.accessToken) {
        localStorage.setItem('user', JSON.stringify(res.data))
      }

      return res.data
    })
    .catch((err) => {
      console.log(err)
    })

}

exports.logout = () => {
  return localStorage.removeItem('user')
}

exports.register = (payload) => {
  return axios.post('/auth/register', payload)
}

exports.authHeader = () => {
  let user = JSON.parse(localStorage.getItem('user'));

  if (user && user.accessToken) {
    return { 'x-access-token': user.accessToken };
  } else {
    return {};
  }
}
