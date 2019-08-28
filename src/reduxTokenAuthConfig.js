import { generateAuthActions } from 'redux-token-auth'


const production = 'https://katt-bnb.herokuapp.com/api/v1/auth'
const development = 'http://localhost:3007/api/v1/auth'

const config = {
  authUrl: development,
  userAttributes: {
    id: 'id',
    uid: 'uid',
    location: 'location',
    username: 'nickname'
  },
  userRegistrationAttributes: {
    password_confirmation: 'password_confirmation',
    location: 'location',
    nickname: 'nickname',
    url: 'confirm_success_url'
  },
}

const {
  registerUser,
  signInUser,
  verifyCredentials,
} = generateAuthActions(config)

export {
  registerUser,
  signInUser,
  verifyCredentials,
} 
