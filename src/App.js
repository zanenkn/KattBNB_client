import React, { Component, createRef, Suspense } from 'react'
import './semantic/dist/semantic.min.css'
import Navbar from './Components/Navbar'
import Menu from './Components/Menu/Menu'
import Search from './Components/Search'
import AboutUs from './Components/Menu/AboutUs'
import Blog from './Components/Menu/Blog'
import ContactUs from './Components/Menu/ContactUs'
import Faq from './Components/Menu/Faq'
import Legal from './Components/Menu/Legal'
import Login from './Components/Authentication/Login'
import SignUp from './Components/Authentication/SignUp'
import ScrollToTop from './Modules/ScrollToTop'
import { Container, Sticky, Sidebar, Button } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { Switch, Route } from 'react-router-dom'

class App extends Component {

  contextRef = createRef()

  render() {

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
                <Route exact path='/about-us' component={AboutUs}></Route>
                <Route exact path='/blog' component={Blog}></Route>
                <Route exact path='/contact-us' component={ContactUs}></Route>
                <Route exact path='/faq' component={Faq}></Route>
                <Route exact path='/legal' component={Legal}></Route>
                <Route exact path='/login' component={Login}></Route>
                <Route exact path='/sign-up' component={SignUp}></Route>
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
})

export default connect(mapStateToProps)(App)
