import React, { Component, createRef } from 'react'
import './semantic/dist/semantic.min.css'
import Navbar from './Components/Navbar'
import Menu from './Components/Menu'
import Search from './Components/Search'
import { Container, Sticky, Sidebar } from 'semantic-ui-react'
import { connect } from 'react-redux'

class App extends Component {
  contextRef = createRef()
  render() {
    return (
      <div ref={this.contextRef} style={{ 'min-height': '100vh' }} onClick={this.props.menuVisible ? () => { this.props.dispatch({ type: 'CHANGE_VISIBILITY' }) } : () => { }}>
        <Sticky context={this.contextRef}>
          <Navbar />
        </Sticky>

        <Sidebar.Pushable
          as={Container}
          id='app-content'
          className='disable-scrollbars'
        >

          <Search />
          <Menu />
        </Sidebar.Pushable>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  menuVisible: state.animation.menuVisible
})

export default connect(mapStateToProps)(App)
