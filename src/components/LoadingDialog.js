import React, { PureComponent } from 'react'
import LinearProgress from '@material-ui/core/LinearProgress'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import Typography from '@material-ui/core/Typography'

class LoadingContent extends PureComponent {
  render () {
    const { message, ...bulk } = this.props
    return (
      <Dialog
        {...bulk}
        open
        disableBackdropClick
        disableEscapeKeyDown
      >
        <DialogContent>
          <DialogContentText>
            {message}
            <Typography component='p'>
              <br />
              <LinearProgress />
            </Typography>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    )
  }
}

export default LoadingContent
