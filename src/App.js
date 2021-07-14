import React, { useState, useEffect } from 'react';
import Landing from './Components/Landing';
import Navbar from './Components/Navbar/';
import Menu from './Components/Menu/Menu';
import Search from './Components/Search';
import SearchResults from './Components/SearchResults';
import AboutUs from './Components/Menu/AboutUs';
import ContactUs from './Components/Menu/ContactUs';
import Faq from './Components/Menu/Faq';
import Legal from './Components/Menu/Legal';
import Guidelines from './Components/Menu/Guidelines';
import SuccessScreenAuth from './Components/ReusableComponents/SuccessScreenAuth';
import Login from './Components/Authentication/Login';
import SignUp from './Components/Authentication/SignUp';
import PasswordReset from './Components/Authentication/PasswordReset';
import ChangePassword from './Components/Authentication/ChangePassword';
import UserPage from './Components/UserPage';
import RequestToBook from './Components/Bookings/RequestToBook';
import SuccessfulRequest from './Components/Bookings/SuccessfulRequest';
import AllBookings from './Components/Bookings/AllBookings';
import OutgoingBookings from './Components/Bookings/OutgoingBookings';
import IncomingBookings from './Components/Bookings/IncomingBookings';
import RequestAcceptedSuccessfully from './Components/Bookings/RequestAcceptedSuccessfully';
import BookingDetails from './Components/Bookings/BookingDetails';
import AllConversations from './Components/Messenger/AllConversations';
import Conversation from './Components/Messenger/SingleConversation';
import HostProfileViewWrapper from './Components/HostProfileView/HostProfileViewWrapper';
import Error503 from './Components/ReusableComponents/Error503';
import Partners from './Components/Menu/Partners';
import HostEn from './Components/HostEn';
import HostSe from './Components/HostSe';
import LeaveReview from './Components/Reviews/LeaveReview';
import SuccessfulReview from './Components/Reviews/SuccessfulReview';
import Receipt from './Components/Bookings/Receipt';
import AreaList from './Components/AreaList';
import BlogListing from './Components/Blog/BlogListing';
import BlogPost from './Components/Blog/BlogPost';
import ScrollToTop from './Modules/ScrollToTop';
import { Switch, Route } from 'react-router-dom';
import Prismic from 'prismic-javascript';
import { useTranslation } from 'react-i18next';
import GlobalStyles from './Styles/global';
import Theme from './Styles/theme';
import { ContentWrapper } from './UI-Components';

const App = () => {
  const [uids, setUids] = useState([]);
  const { t } = useTranslation();

  const fetchData = async () => {
    const Client = Prismic.client(process.env.REACT_APP_PRISMIC_REPO);
    const response = await Client.query(Prismic.Predicates.at('document.type', 'post'), { fetch: 'post.uid' });
    setUids(response.results.map((result) => result.uid));
  };

  useEffect(() => {
    try {
      fetchData();
    } catch (error) {
      window.alertwindow.alert(t('reusable:errors:500'));
    }
    // eslint-disable-next-line
  }, []);

  return (
    <Theme>
      <GlobalStyles />
      <Navbar />
      <ContentWrapper>
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
            <Route
              exact
              path='/signup-success'
              render={(props) => (
                <SuccessScreenAuth
                  {...props}
                  translationFile={'SignupSuccess'}
                  translationTitle={'SignupSuccess:title'}
                  translationKey={'SignupSuccess:p'}
                />
              )}
            />
            <Route exact path='/password-reset' component={PasswordReset}></Route>
            <Route exact path='/change-password' component={ChangePassword}></Route>
            <Route
              exact
              path='/password-reset-success'
              render={(props) => (
                <SuccessScreenAuth
                  {...props}
                  translationFile={'PasswordResetSuccess'}
                  translationTitle={'PasswordResetSuccess:title'}
                  translationKey={'PasswordResetSuccess:p'}
                />
              )}
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
            <Route exact path='/blog' component={BlogListing}></Route>
            {uids.map((uid) => (
              <Route exact path={`/blog/${uid}`} key={uid} component={BlogPost}></Route>
            ))}
          </Switch>
        </ScrollToTop>
      </ContentWrapper>
      <Menu />
    </Theme>
  );
};

export default App;
