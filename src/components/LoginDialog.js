import React, { PureComponent } from 'react'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextField from '@material-ui/core/TextField'

class LoginDialog extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      username: '',
      password: '',
      url: props.defaultUrl || '',
      hasError: false,
      loading: false
    }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleLogin = this.handleLogin.bind(this)
  }

  async handleLogin () {
    const { onLogin = () => {} } = this.props
    const { username, password, url } = this.state
    this.setState({ loading: true })
    const success = await onLogin(username, password, url)
    this.setState({
      hasError: !success,
      loading: false
    })
  }

  handleInputChange (name) {
    return ({ target }) => {
      this.setState({ [name]: target.value })
    }
  }

  render () {
    return (
      <Dialog
        open={this.props.open}
        disableBackdropClick
        disableEscapeKeyDown
      >
        <DialogTitle id='form-dialog-title'>Login</DialogTitle>
        <DialogContent>
          <form action='/' onSubmit={event => {
            event.preventDefault()
            this.handleLogin()
          }}>
            <TextField
              autoFocus
              margin='dense'
              id='url'
              name='url'
              label='SiteSpect URL'
              helperText='e.g. https://sitespect.your-company.com/'
              error={this.state.hasError}
              onChange={this.handleInputChange('url')}
              defaultValue={this.state.url || 'https://'}
              type='text'
              fullWidth
            />
            <TextField
              margin='dense'
              id='username'
              name='username'
              label='Username'
              error={this.state.hasError}
              onChange={this.handleInputChange('username')}
              defaultValue={this.state.username}
              type='text'
              fullWidth
            />
            <TextField
              margin='dense'
              id='password'
              name='password'
              label='Password'
              error={this.state.hasError}
              onChange={this.handleInputChange('password')}
              defaultValue={this.state.password}
              type='password'
              fullWidth
            />
            <input type='submit' style={{position: 'absolute', left: '-9999px'}} />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleLogin} color='primary' type='submit'>
            {this.state.loading &&
              <span>
                <CircularProgress size={15} />
                &nbsp;
              </span>
            }
            Login
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

export default LoginDialog
