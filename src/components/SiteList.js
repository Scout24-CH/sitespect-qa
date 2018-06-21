import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { withStyles } from '@material-ui/core/styles'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Avatar from '@material-ui/core/Avatar'

import WebIcon from '@material-ui/icons/Web'

const styles = theme => ({
  root: {
    width: '100%',
    // maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  }
})

class SiteList extends PureComponent {
  constructor () {
    super()
    this.handleItemClick = this.handleItemClick.bind(this)
  }
  handleItemClick (item) {
    return event => {
      this.props.onItemClick(item)
    }
  }
  render () {
    const { classes, items, ...bulk } = this.props
    return (
      <div className={classes.root} {...bulk}>
        <List>
          {items.map(item => (
            <ListItem
              onClick={this.handleItemClick(item)}
              button
            >
              <Avatar>
                <WebIcon />
              </Avatar>
              <ListItemText
                primary={item.Name}
                secondary={`Status: ${item.Status}`}
              />
            </ListItem>
          ))}
        </List>
      </div>
    )
  }
}

SiteList.propTypes = {
  classes: PropTypes.object.isRequired,
  onItemClick: PropTypes.func.isRequired
}
export default withStyles(styles)(SiteList)
