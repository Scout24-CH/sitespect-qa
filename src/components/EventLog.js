/* global chrome */
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { withStyles } from '@material-ui/core/styles'

import Grid from '@material-ui/core/Grid'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'

import { hasPreviewParams, tableStyles } from '../constructors'

const styles = theme => {
  return {
    root: {
      width: '100%'
    },
    highlight: {
      backgroundColor: theme.palette.grey[50]
    },
    ...tableStyles
  }
}

const extractCounter = header => {
  const num = parseInt((header.value.split('|')[6] || '').split(':').pop(), 10)
  return Number.isNaN(num)
    ? null
    : num
}

class EventLog extends PureComponent {
  constructor () {
    super()
    this.state = {
      log: []
    }
    this.eventCounterBaseline = 0
  }
  componentWillReceiveProps (nextProps) {
    const { active } = this.props
    if (active !== nextProps.active) {
      this.setState({ log: [] })
    }
  }
  componentDidMount () {
    const { site, campaign } = this.props
    const { UrlForPreview } = campaign
    const { DefaultUrlForPreview } = site

    if (!UrlForPreview && !DefaultUrlForPreview) { return }
    const url = new URL(UrlForPreview || DefaultUrlForPreview)
    chrome.devtools.network.onRequestFinished.addListener(({ request, response }) => {
      if (request.method !== 'GET') { return }

      const requestUrl = new URL(request.url)
      const infoHeader = response.headers
        .filter(header => header.name.toLowerCase() === 'sitespect-info')
        .pop()
      if (infoHeader && requestUrl.host === url.host) {
        if (hasPreviewParams(request.url)) {
          this.setState({ log: [] })
          return
        }
        const counter = extractCounter(infoHeader)
        // console.log(infoHeader.value, counter)
        if (requestUrl.pathname !== '/__ssobj/track' || counter <= this.eventCounterBaseline) {
          this.eventCounterBaseline = counter
          return
        }

        const name = requestUrl.searchParams.get('event')
        let value = requestUrl.searchParams.get('value')

        if (value === 'undefined') {
          value = ''
        }

        this.setState({
          log: this.state.log.concat({
            name,
            value
          })
        })
      }
    })
  }
  render () {
    const { classes, site, active, campaign, ...bulk } = this.props
    const { log } = this.state
    if (!log.length || !active) { return null }
    return (
      <Grid
        item xs={12}
        md={6}
        className={classes.highlight}
      >
        <Table className={classes.table} {...bulk}>
          <TableHead>
            <TableRow className={classes.trh}>
              <TableCell className={classes.th} padding='dense'>Events</TableCell>
              <TableCell className={classes.th} padding='dense' />
            </TableRow>
          </TableHead>
          <TableBody>
            {log.map((entry, i) => (
              <TableRow key={i}>
                <TableCell className={classes.td} padding='dense'>{entry.name}</TableCell>
                <TableCell className={classes.td} padding='dense'>{entry.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Grid>
    )
  }
}

EventLog.propTypes = {
  classes: PropTypes.object.isRequired,
  apiClient: PropTypes.object.isRequired
}
export default withStyles(styles)(EventLog)
