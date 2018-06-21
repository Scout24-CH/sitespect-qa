import React, { Component } from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'

import Devtools from './Devtools'
import DevtoolsMain from './DevtoolsMain'
import Popup from './Popup'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#2196f3',
      light: '#6ec6ff',
      dark: '#0069c0',
      contrastText: '#FFF'
    },
    secondary: {
      main: '#8bc34a',
      light: '#bef67a',
      dark: '#5a9216',
      contrastText: '#000'
    }
  }
})

class App extends Component {
  constructor () {
    super()
    this.state = {
      route: null
    }
  }
  componentDidMount () {
    const rootElem = global.document.getElementById('root')
    const route = rootElem && rootElem.getAttribute('data-route')
    if (route) {
      this.setState({ route })
    }
  }
  render () {
    let Page
    switch (this.state.route) {
      case '/devtools':
        Page = Devtools
        break
      case '/devtools/main':
        Page = DevtoolsMain
        break
      case '/popup':
        Page = Popup
        break
      default:
        Page = 'initializing'
    }
    return (
      <div>
        <CssBaseline />
        <MuiThemeProvider theme={theme}>
          <Page />
        </MuiThemeProvider>
      </div>
    )
  }
}

export default App
