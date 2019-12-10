import React, { Component, createRef, Suspense } from 'react'
import './semantic/dist/semantic.min.css'
import Navbar from './Components/Navbar'
import Menu from './Components/Menu/Menu'
import Search from './Components/Search'
import SearchResults from './Components/SearchResults'
import AboutUs from './Components/Menu/AboutUs'
import Blog from './Components/Menu/Blog'
import ContactUs from './Components/Menu/ContactUs'
import Faq from './Components/Menu/Faq'
import Legal from './Components/Menu/Legal'
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
import NoAccess from './Components/ReusableComponents/NoAccess'
import ScrollToTop from './Modules/ScrollToTop'
import { Container, Sticky, Sidebar } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { Switch, Route } from 'react-router-dom'

class App extends Component {

  contextRef = createRef()

  render() {
    let userPageRoute, allBookingsRoute, outgoingBookingsRoute, incomingBookingsRoute

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
    }

    return (
      <Suspense fallback={(<div>Loading</div>)}>
        <div ref={this.contextRef}>
          <Sticky context={this.contextRef}>
            <Navbar />
          </Sticky>
          <div onClick={this.props.menuVisible ? () => { this.props.dispatch({ type: 'CHANGE_VISIBILITY' }) } : () => { }}>
            <Sidebar.Pushable
              as={Container}
              id='app-content'
              className='disable-scrollbars'
            >
              <ScrollToTop>
                <Switch>
                  <Route exact path='/' component={Search}></Route>
                  <Route exact path='/search-results' component={SearchResults}></Route>
                  <Route exact path='/about-us' component={AboutUs}></Route>
                  <Route exact path='/blog' component={Blog}></Route>
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
                  {userPageRoute}
                  {allBookingsRoute}
                  {outgoingBookingsRoute}
                  {incomingBookingsRoute}
                </Switch>
              </ScrollToTop>
              <Menu />
            </Sidebar.Pushable>
          </div>
        </div>
      </Suspense>
    )
  }
}

const mapStateToProps = state => ({
  menuVisible: state.animation.menuVisible,
  currentUserIn: state.reduxTokenAuth.currentUser.isSignedIn
})

export default connect(mapStateToProps)(App)
