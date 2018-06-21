import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'

import ArrowBack from '@material-ui/icons/ArrowBack'

const styles = {
  root: {
    flexGrow: 1
  },
  flex: {
    flex: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  }
}

const ButtonAppBar = props => {
  const {
    classes,
    title,
    isAuthenticated,
    onLogout,
    onBack,
    ...bulk
  } = props
  return (
    <div className={classes.root} {...bulk}>
      <AppBar position='static'>
        <Toolbar>
          {onBack &&
            <IconButton
              className={classes.menuButton}
              color='inherit'
              onClick={onBack}
            >
              <ArrowBack />
            </IconButton>
          }
          <Typography variant='title' color='inherit' className={classes.flex}>
            {title || 'Sitespect'}
          </Typography>
          {isAuthenticated &&
            <Button color='inherit' onClick={onLogout}>Logout</Button>
          }
        </Toolbar>
      </AppBar>
    </div>
  )
}

ButtonAppBar.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(ButtonAppBar)
