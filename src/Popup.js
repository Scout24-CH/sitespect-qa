import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

const styles = theme => ({
  root: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
    margin: 0
  })
})

class Popup extends PureComponent {
  componentDidMount () {
    global.document.body.style.height = 'auto'
    global.document.body.style.width = '600px'
    global.document.body.style.overflow = 'hidden'
  }
  render () {
    const { classes } = this.props
    return (
      <div>
        <Paper className={classes.root} elevation={4}>
          <Typography variant='headline' component='h3'>
            This extension lives in the devtools
          </Typography>
          <Typography component='p'>
            Hit Alt+Command+I (macOS) or F12 (Windows) to open them.
            <br />
            You can hide this icon, by right click and selecting <strong>"Hide in chrome menu"</strong>.
          </Typography>
        </Paper>
      </div>
    )
  }
}

Popup.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Popup)
