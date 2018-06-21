import { PureComponent } from 'react'

class Devtools extends PureComponent {
  componentDidMount () {
    global.chrome.devtools.panels.create('Sitespect',
      'icon-48.png',
      'devtools-main.html',
      panel => {
        // main panel done
      }
    )
  }
  render () {
    return null
  }
}

export default Devtools
