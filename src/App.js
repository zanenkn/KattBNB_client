import React from 'react'
import './semantic/dist/semantic.min.css'
import Navbar from './Components/Navbar'
import {Header} from 'semantic-ui-react'

function App() {
  return (
    <>
      <Navbar />
      <Header>
        <div id='test'>
          Meow!
        </div>
      </Header>
    </>
  )
}

export default App;
