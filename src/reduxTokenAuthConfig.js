import { generateAuthActions } from 'redux-token-auth'
const production = 'http://katt-bnb.herokuapp.com/api/v1/auth'
const development = 'http://localhost:3007/api/v1/auth'

const config = {
  authUrl: development,
  userAttributes: {
    uid: 'uid'
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
  signOutUser,
  verifyCredentials,
} = generateAuthActions(config)

export {
  registerUser,
  signInUser,
  signOutUser,
  verifyCredentials,
} 
