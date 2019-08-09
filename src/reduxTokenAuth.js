import { generateAuthActions } from 'redux-token-auth'
const production = ''
const development = ''

const config = {
  authUrl: development,
  userAttributes: {
    uid: 'uid'
  },
  userRegistrationAttributes: {
    password_confirmation: 'password_confirmation'
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
