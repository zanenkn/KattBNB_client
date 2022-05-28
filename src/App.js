import './Styles/global.css'
import withFooter from './HOC/withFooter';
import Landing from './Components/Landing';
import Responsive from './common/Responsive';
import MobileNav from './Components/Navbar/Mobile';
import DesktopNav from './Components/Navbar/Desktop';
import Menu from './Components/Menu';
import Search from './Components/Search';
import SearchResults from './Components/SearchResults';
import AboutUs from './Components/AboutUs';
import ContactUs from './Components/ContactUs';
import Faq from './Components/Faq';
import Legal from './Components/Legal';
import Guidelines from './Components/Guidelines';
import SuccessScreenAuth from './common/SuccessScreenAuth';
import Login from './Components/Authentication/Login';
import SignUp from './Components/Authentication/SignUp';
import PasswordReset from './Components/Authentication/PasswordReset';
import ChangePassword from './Components/Authentication/ChangePassword';
import UserPage from './Components/UserPage';
import RequestToBook from './Components/RequestToBook';
import SuccessfulRequest from './Components/RequestToBook/SuccessfulRequest';
import AllBookings from './Components/Bookings/AllBookings';
import OutgoingBookings from './Components/Bookings/OutgoingBookings';
import IncomingBookings from './Components/Bookings/IncomingBookings';
import RequestAcceptedSuccessfully from './Components/Bookings/IncomingBookings/requestAcceptedSuccessfully';
import BookingDetails from './Components/Bookings/OutgoingBookings/bookingDetails';
import AllConversations from './Components/Messenger/AllConversations';
import Conversation from './Components/Messenger/SingleConversation';
import HostProfileViewWrapper from './Components/HostProfileView/HostProfileViewWrapper';
import Error503 from './common/Error503';
import Partners from './Components/Partners';
import HostEn from './Components/HostEn';
import HostSe from './Components/HostSe';
import LeaveReview from './Components/Reviews/LeaveReview';
import SuccessfulReview from './Components/Reviews/SuccessfulReview';
import Receipt from './Components/Bookings/OutgoingBookings/receipt';
import AreaList from './Components/AreaList';
import BlogListing from './Components/Blog/BlogListing';
import BlogPost from './Components/Blog/BlogPost';
import ScrollToTop from './Modules/ScrollToTop';
import { Switch, Route } from 'react-router-dom';
import GlobalStyles from './Styles/global';
import Theme from './Styles/theme';
import HostProfileForm from './Components/HostProfileForm';

const App = () => {
  return (
    <Theme>
      <GlobalStyles />
      <Responsive displayIn={['mobile']}>
        <MobileNav />
      </Responsive>
      <Responsive displayIn={['tablet', 'laptop', 'desktop']}>
        <DesktopNav />
      </Responsive>
      <ScrollToTop>
        <Switch>
          <Route exact path='/' component={withFooter(Landing)}></Route>
          <Route exact path='/search' component={Search}></Route>
          <Route exact path='/search-results' component={SearchResults}></Route>
          <Route exact path='/about-us' component={withFooter(AboutUs)}></Route>
          <Route exact path='/contact-us' component={withFooter(ContactUs)}></Route>
          <Route exact path='/faq' component={Faq}></Route>
          <Route exact path='/legal' component={Legal}></Route>
          <Route exact path='/login' component={Login}></Route>
          <Route exact path='/sign-up' component={SignUp}></Route>
          <Route
            exact
            path='/signup-success'
            render={(props) => <SuccessScreenAuth {...props} translationFile={'SignupSuccess'} />}
          />
          <Route exact path='/password-reset' component={PasswordReset}></Route>
          <Route exact path='/change-password' component={ChangePassword}></Route>
          <Route
            exact
            path='/password-reset-success'
            render={(props) => <SuccessScreenAuth {...props} translationFile={'PasswordResetSuccess'} />}
          />
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
          <Route exact path='/booking-receipt' component={Receipt}></Route>
          <Route exact path='/area-list' component={AreaList}></Route>
          <Route exact path='/create-host-profile' component={HostProfileForm}></Route>
          <Route exact path='/blog/:category/:page' component={withFooter(BlogListing)}></Route>
          <Route exact path={'/blog/:uid'} component={withFooter(BlogPost)}></Route>
        </Switch>
      </ScrollToTop>
      <Menu />
    </Theme>
  );
};

export default App;
