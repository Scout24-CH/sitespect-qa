import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { withStyles } from '@material-ui/core/styles'

import Chip from '@material-ui/core/Chip'
import Grid from '@material-ui/core/Grid'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import Typography from '@material-ui/core/Typography'

import ExpandMore from '@material-ui/icons/ExpandMore'

import Campaign from './Campaign'
import EventLog from './EventLog'

const styles = theme => {
  return {
    root: {
      width: '100%',
      backgroundColor: theme.palette.background.paper
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      paddingTop: '6px'
    },
    status: {
      color: theme.palette.text.secondary,
      flexBasis: '130px',
      flexShrink: 0,
      minWidth: '130px'
    },
    running: {
      backgroundColor: theme.palette.secondary.main
    }
  }
}

class CampaignList extends PureComponent {
  constructor () {
    super()
    this.state = {
      expanded: null
    }
    this.handleChange = this.handleChange.bind(this)
  }
  handleChange (name) {
    return (event, expanded) => {
      this.setState({
        expanded: expanded ? name : null
      })
    }
  }
  render () {
    const { classes, items, site, apiClient, ...bulk } = this.props
    const { expanded } = this.state
    return (
      <div className={classes.root} {...bulk}>
        {items.map(item => {
          const isExpanded = expanded === item.ID
          return (
            <ExpansionPanel
              elevation={1}
              key={item.ID}
              onChange={this.handleChange(item.ID)}
              expanded={isExpanded}
            >
              <ExpansionPanelSummary
                expandIcon={<ExpandMore />}
              >
                <Typography className={classes.status}>
                  <Chip
                    label={item.Status}
                    className={item.Status === 'active-running' && classes.running}
                  />
                </Typography>
                <Typography className={classes.heading}>
                  {item.Name}
                  <span> (ID {item.ID})</span>
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Grid container spacing={16}>
                  <Grid item xs={12} md={6}>
                    <Campaign
                      campaign={item}
                      site={site}
                      apiClient={apiClient}
                      expanded={isExpanded}
                    />
                  </Grid>
                  <EventLog
                    site={site}
                    campaign={item}
                    active={isExpanded}
                  />
                </Grid>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          )
        })}
      </div>
    )
  }
}

CampaignList.propTypes = {
  classes: PropTypes.object.isRequired,
  onItemClick: PropTypes.func.isRequired
}
export default withStyles(styles)(CampaignList)
