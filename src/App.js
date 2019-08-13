import React, { Component, createRef } from 'react'
import './semantic/dist/semantic.min.css'
import Navbar from './Components/Navbar'
import Menu from './Components/Menu'
import Search from './Components/Search'
import AboutUs from './Components/AboutUs'
import Blog from './Components/Blog'
import ContactUs from './Components/ContactUs'
import Faq from './Components/Faq'
import Legal from './Components/Legal'
import Login from './Components/Login'
import SignUp from './Components/SignUp'
import SignupSuccess from './Components/SignupSuccess'
import PasswordReset from './Components/PasswordReset'
import ChangePassword from './Components/ChangePassword'
import ScrollToTop from './Components/ScrollToTop'
import { Container, Sticky, Sidebar } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { Switch, Route } from 'react-router-dom'


class App extends Component {
  contextRef = createRef()
  render() {
    return (
      <div ref={this.contextRef}>
        <Sticky context={this.contextRef}>
          <Navbar />
        </Sticky>

        <div style={{ 'minHeight': '100vh' }} onClick={this.props.menuVisible ? () => { this.props.dispatch({ type: 'CHANGE_VISIBILITY' }) } : () => { }}>
          <Sidebar.Pushable
            as={Container}
            id='app-content'
            className='disable-scrollbars'
          >
            <ScrollToTop>
              <Switch>
                <Route exact path='/' component={Search}></Route>
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
  menuVisible: state.animation.menuVisible
})

export default connect(mapStateToProps)(App)
