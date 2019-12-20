import { generateAuthActions } from 'redux-token-auth'

const config = {
  authUrl: (process.env.NODE_ENV === 'development' ? 'http://localhost:3007/api/v1/auth' : `${process.env.REACT_APP_API_ENDPOINT}/api/v1/auth`),
  userAttributes: {
    id: 'id',
    uid: 'uid',
    location: 'location',
    username: 'nickname',
    avatar: 'avatar'
  },
  userRegistrationAttributes: {
    passwordConfirmation: 'password_confirmation',
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
