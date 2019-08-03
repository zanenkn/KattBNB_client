import React, {Component, createRef} from 'react'
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
      <div ref={this.contextRef}>
        <Sticky context={this.contextRef}>
          <Navbar />
        </Sticky>
        <Sidebar.Pushable
          as={Container}
          id='app-content'
          className='disable-scrollbars'>

          <Search />
          <Menu />

        </Sidebar.Pushable>
      </div>
    )
  }
}

export default connect()(App)
