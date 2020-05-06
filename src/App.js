import React, { Component, createRef } from 'react'
import './semantic/dist/semantic.min.css'
import Navbar from './Components/Navbar'
import Menu from './Components/Menu/Menu'
import Search from './Components/Search'
import SearchResults from './Components/SearchResults'
import AboutUs from './Components/Menu/AboutUs'
import ContactUs from './Components/Menu/ContactUs'
import Faq from './Components/Menu/Faq'
import Legal from './Components/Menu/Legal'
import Guidelines from './Components/Menu/Guidelines'
import Login from './Components/Authentication/Login'
import SignUp from './Components/Authentication/SignUp'
import SignupSuccess from './Components/Authentication/SignupSuccess'
import PasswordReset from './Components/Authentication/PasswordReset'
import ChangePassword from './Components/Authentication/ChangePassword'
import PasswordResetSuccess from './Components/Authentication/PasswordResetSuccess'
import UserPage from './Components/UserPage/UserPage'
import RequestToBook from './Components/Bookings/RequestToBook'
import SuccessfulRequest from './Components/Bookings/SuccessfulRequest'
import AllBookings from './Components/Bookings/AllBookings'
import OutgoingBookings from './Components/Bookings/OutgoingBookings'
import IncomingBookings from './Components/Bookings/IncomingBookings'
import RequestAcceptedSuccessfully from './Components/Bookings/RequestAcceptedSuccessfully'
import BookingDetails from './Components/Bookings/BookingDetails'
import AllConversations from './Components/Messenger/AllConversations'
import Conversation from './Components/Messenger/SingleConversation'
import HostProfileViewWrapper from './Components/HostProfileView/HostProfileViewWrapper'
import NoAccess from './Components/ReusableComponents/NoAccess'
import Error503 from './Components/ReusableComponents/Error503'
import Partners from './Components/Menu/Partners'
import Counter from './Components/Counter'
import HostEn from './Components/HostEn'
import HostSe from './Components/HostSe'
import ScrollToTop from './Modules/ScrollToTop'
import { Container, Sticky, Sidebar } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { Switch, Route } from 'react-router-dom'

class App extends Component {

  contextRef = createRef()

  render() {
    let userPageRoute, allBookingsRoute, outgoingBookingsRoute, incomingBookingsRoute, messengerRoute, conversationRoute, landingRoute

    if (this.props.currentUserIn) {
      userPageRoute = (
        <Route exact path='/user-page' component={UserPage}></Route>
      )

      allBookingsRoute = (
        <Route exact path='/all-bookings' component={AllBookings}></Route>
      )

      outgoingBookingsRoute = (
        <Route exact path='/outgoing-bookings' component={OutgoingBookings}></Route>
      )

      incomingBookingsRoute = (
        <Route exact path='/incoming-bookings' component={IncomingBookings}></Route>
      )

      messengerRoute = (
        <Route exact path='/messenger' component={AllConversations}></Route>
      )

      conversationRoute = (
        <Route exact path='/conversation' component={Conversation}></Route>
      )
    } else {
      userPageRoute = (
        <NoAccess />
      )

      allBookingsRoute = (
        <NoAccess />
      )

      outgoingBookingsRoute = (
        <NoAccess />
      )

      incomingBookingsRoute = (
        <NoAccess />
      )

      messengerRoute = (
        <NoAccess />
      )

      conversationRoute = (
        <NoAccess />
      )
    }

    if (process.env.REACT_APP_OFFICIAL === 'yes' && process.env.NODE_ENV === 'production') {
      landingRoute = (
        <Route exact path='/' component={Counter}></Route>
      )
    } else {
      landingRoute = (
        <Route exact path='/' component={Search}></Route>
      )
    }

    return (
      <div ref={this.contextRef} style={{'minHeight': '100vh'}}>
        <Sticky context={this.contextRef}>
          <Navbar />
        </Sticky>
        <div onClick={this.props.menuVisible ? () => { this.props.dispatch({ type: 'CHANGE_VISIBILITY' }) } : () => { }} style={{'minHeight': '90vh'}}>
          <Sidebar.Pushable
            as={Container}
            id='app-content'
            className='disable-scrollbars'
          >
            <ScrollToTop>
              <Switch>
                {landingRoute}
                <Route exact path='/search-results' component={SearchResults}></Route>
                <Route exact path='/about-us' component={AboutUs}></Route>
                <Route exact path='/contact-us' component={ContactUs}></Route>
                <Route exact path='/faq' component={Faq}></Route>
                <Route exact path='/legal' component={Legal}></Route>
                <Route exact path='/login' component={Login}></Route>
                <Route exact path='/sign-up' component={SignUp}></Route>
                <Route exact path='/signup-success' component={SignupSuccess}></Route>
                <Route exact path='/password-reset' component={PasswordReset}></Route>
                <Route exact path='/change-password' component={ChangePassword}></Route>
                <Route exact path='/password-reset-success' component={PasswordResetSuccess}></Route>
                <Route exact path='/request-to-book' component={RequestToBook}></Route>
                <Route exact path='/successful-request' component={SuccessfulRequest}></Route>
                <Route exact path='/request-accepted-success' component={RequestAcceptedSuccessfully}></Route>
                <Route exact path='/booking-details' component={BookingDetails}></Route>
                <Route exact path='/host-profile' component={HostProfileViewWrapper}></Route>
                <Route exact path='/partners' component={Partners}></Route>
                <Route exact path='/guidelines' component={Guidelines}></Route>
                <Route exact path='/is-not-available' component={Error503}></Route>
                <Route exact path='/become-host' component={HostEn}></Route>
                <Route exact path='/bli-kattvakt' component={HostSe}></Route>
                {userPageRoute}
                {allBookingsRoute}
                {outgoingBookingsRoute}
                {incomingBookingsRoute}
                {messengerRoute}
                {conversationRoute}
              </Switch>
            </ScrollToTop>
            <Menu />
          </Sidebar.Pushable>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  menuVisible: state.animation.menuVisible,
  currentUserIn: state.reduxTokenAuth.currentUser.isSignedIn
})

export default connect(mapStateToProps)(App)
