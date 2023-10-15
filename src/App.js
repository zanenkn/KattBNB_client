import { Route, Routes } from 'react-router-dom';

import './Styles/global.css';
import Landing from './Components/Landing';
import Responsive from './common/Responsive';
import MobileNav from './Components/Navbar/Mobile';
import DesktopNav from './Components/Navbar/Desktop';
import Menu from './Components/Menu';
import Search from './Components/Search';
import SearchResults from './Components/SearchResults';
import AboutUs from './Components/AboutUs';
import ContactUs from './Components/ContactUs';
import Faq from './Components/FAQ';
import Legal from './Components/Legal';
import Guidelines from './Components/Guidelines';
import SuccessScreenAuth from './common/SuccessScreenAuth';
import Login from './Components/Authentication/Login';
import SignUp from './Components/Authentication/SignUp';
import PasswordReset from './Components/Authentication/PasswordReset';
import ChangePassword from './Components/Authentication/ChangePassword';
import UserPage from './Components/UserPage';
import SuccessfulRequest from './Components/SearchResults/request/successfulRequest';
import AllBookings from './Components/Bookings/AllBookings';
import OutgoingBookings from './Components/Bookings/OutgoingBookings';
import IncomingBookings from './Components/Bookings/IncomingBookings';
import RequestAcceptedSuccessfully from './Components/Bookings/IncomingBookings/requestAcceptedSuccessfully';
import BookingDetails from './Components/Bookings/OutgoingBookings/bookingDetails';
import AllConversations from './Components/Messenger/AllConversations';
import Conversation from './Components/Messenger/SingleConversation';
import UserInfo from './Components/UserInfo';
import Error503 from './common/Error503';
import HostEn from './Components/BecomeHost/HostEn';
import HostSe from './Components/BecomeHost/HostSe';
import LeaveReview from './Components/Reviews/leaveReview';
import SuccessfulReview from './Components/Reviews/successfulReview';
import Receipt from './Components/Bookings/OutgoingBookings/receipt';
import AreaList from './Components/AreaList';
import BlogListing from './Components/Blog/BlogListing';
import BlogPost from './Components/Blog/BlogPost';
import ScrollToTop from './Modules/ScrollToTop';
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
        <Routes>
          <Route path='/' element={<Landing />}></Route>

          <Route path='/search' element={<Search />}></Route>
          <Route path='/search-results' element={SearchResults}></Route>
          <Route path='/about-us' element={<AboutUs />}></Route>
          <Route path='/contact-us' element={<ContactUs />}></Route>
          <Route path='/faq' element={<Faq />}></Route>
          <Route path='/legal' element={<Legal />}></Route>
          <Route path='/login' element={<Login />}></Route>
          <Route path='/sign-up' element={<SignUp />}></Route>
          <Route
            path='/signup-success'
            render={(props) => <SuccessScreenAuth {...props} translationFile={'SignupSuccess'} />}
          />
          <Route path='/password-reset' element={<PasswordReset />}></Route>
          <Route path='/change-password' element={<ChangePassword />}></Route>
          <Route
            path='/password-reset-success'
            render={(props) => <SuccessScreenAuth {...props} translationFile={'PasswordResetSuccess'} />}
          />
          <Route path='/successful-request' element={<SuccessfulRequest />}></Route>
          <Route path='/request-accepted-success' element={<RequestAcceptedSuccessfully />}></Route>
          <Route path='/booking-details' element={<BookingDetails />}></Route>
          <Route path='/user/:userId' element={<UserInfo />}></Route>
          <Route path='/guidelines' element={<Guidelines />}></Route>
          <Route path='/is-not-available' element={<Error503/>}></Route>
          <Route path='/become-host' element={<HostEn />}></Route>
          <Route path='/bli-kattvakt' element={<HostSe/>}></Route>
          <Route path='/successful-review' element={<SuccessfulReview/>}></Route>
          <Route path='/user-page' element={<UserPage />}></Route>
          <Route path='/all-bookings' element={<AllBookings/>}></Route>
          <Route path='/outgoing-bookings' element={<OutgoingBookings />}></Route>
          <Route path='/incoming-bookings' element={<IncomingBookings/>}></Route>
          <Route path='/messenger' element={<AllConversations />}></Route>
          <Route path='/conversation/:conversationId' element={<Conversation />}></Route>
          <Route path='/leave-a-review' element={<LeaveReview/>}></Route>
          <Route path='/booking-receipt' element={<Receipt />}></Route>
          <Route path='/area-list' element={<AreaList/>}></Route>
          <Route path='/create-host-profile' element={<HostProfileForm/>}></Route>
          <Route path='/blog/:category/:page' element={<BlogListing/>}></Route>
          <Route path={'/blog/:uid'} element={<BlogPost/>}></Route>
        </Routes>
      </ScrollToTop>
      <Menu />
    </Theme>
  );
};

export default App;
