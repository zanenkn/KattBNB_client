import React, { Component } from 'react'
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
import Error503 from './Components/ReusableComponents/Error503'
import Partners from './Components/Menu/Partners'
import HostEn from './Components/HostEn'
import HostSe from './Components/HostSe'
import LeaveReview from './Components/Reviews/LeaveReview'
import SuccessfulReview from './Components/Reviews/SuccessfulReview'
import ScrollToTop from './Modules/ScrollToTop'
import { Container, Sidebar } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { Switch, Route } from 'react-router-dom'

class App extends Component {

  render() {
    return (
      <>
        <Navbar />
        <Sidebar.Pushable
          onClick={this.props.menuVisible ? () => { this.props.dispatch({ type: 'CHANGE_VISIBILITY' }) } : () => { }}
          as={Container}
          id='app-content'
          className='disable-scrollbars'
        >
          <ScrollToTop>
            <Switch>
              <Route exact path='/' component={Landing}></Route>
              <Route exact path='/search' component={Search}></Route>
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
              <Route exact path='/successful-review' component={SuccessfulReview}></Route>
              <Route exact path='/user-page' component={UserPage}></Route>
              <Route exact path='/all-bookings' component={AllBookings}></Route>
              <Route exact path='/outgoing-bookings' component={OutgoingBookings}></Route>
              <Route exact path='/incoming-bookings' component={IncomingBookings}></Route>
              <Route exact path='/messenger' component={AllConversations}></Route>
              <Route exact path='/conversation' component={Conversation}></Route>
              <Route exact path='/leave-a-review' component={LeaveReview}></Route>
            </Switch>
          </ScrollToTop>
          <Menu />
        </Sidebar.Pushable>
      </>
    )
  }
}

const mapStateToProps = state => ({
  menuVisible: state.animation.menuVisible,
})

export default connect(mapStateToProps)(App)
