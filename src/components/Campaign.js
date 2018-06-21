/* global chrome */
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import Radio from '@material-ui/core/Radio'

import { withStyles } from '@material-ui/core/styles'

import { hasPreviewParams, tableStyles } from '../constructors'

const appendPreviewParams = url => {
  url.searchParams.append('SS_PREVIEW_EXP', `${(new Date()).getFullYear() + 10}_DEC_31_1300GMT`)
  return url.toString()
}
const getTabUrl = tabId => new Promise((resolve, reject) => {
  chrome.tabs.executeScript(tabId, { code: 'document.location.href' }, (url, err) => err
    ? reject(err)
    : resolve(url)
  )
})

const styles = theme => {
  return {
    root: {
      width: '100%'
    },
    variation: {
      cursor: 'pointer'
    },
    ...tableStyles
  }
}

class Campaign extends PureComponent {
  constructor () {
    super()
    this.state = {
      variationGroups: null,
      variations: null,
      initialized: false,
      url: null,
      checkedVariation: null
    }
    this.lastClickedVariationGroup = null
    this.handleVariationClick = this.handleVariationClick.bind(this)
  }
  async componentDidMount () {
    if (this.state.variationGroups) { return }
    const { apiClient, site, campaign } = this.props
    let variationGroups = await apiClient.getVariationGroups(site.ID, campaign.ID) || []
    variationGroups = variationGroups.filter(variationGroup => variationGroup.Status === 'Active')
    const variationIds = new Set()

    variationGroups.forEach(group => {
      if (!group.Variations) { return }
      group.Variations.forEach(variation => {
        variationIds.add([site.ID, variation.FactorID, variation.VariationID])
      })
    })
    let variations = await Promise.all(Array.from(variationIds)
      .map(async args => apiClient.getVariation(...args)))

    const previewUrl = variations[0].UrlForPreview
    variations = variations.reduce((acc, variation) => {
      acc[variation.ID] = variation
      return acc
    }, {})

    this.setState({
      variationGroups,
      variations,
      initialized: true,
      previewUrl
    })

    chrome.webRequest.onBeforeSendHeaders.addListener(details => {
      const { tabId, requestHeaders, url } = details

      // add variattion group ids to headers, in order to start a preview session
      if (
        tabId === chrome.devtools.inspectedWindow.tabId &&
        this.lastClickedVariationGroup &&
        hasPreviewParams(url)
      ) {
        requestHeaders.push({
          name: 'X-SiteSpect-Preview',
          value: JSON.stringify({
            'VG_IDs': [ this.lastClickedVariationGroup ]
          })
        })
        this.lastClickedVariationGroup = null
      }

      return { requestHeaders }
    }, { urls: [`*://${(new URL(previewUrl)).host}/*`] }, [ 'blocking', 'requestHeaders' ])

    chrome.devtools.network.onRequestFinished.addListener(({ request, response }) => {
      // if (request.method !== 'GET') { return }

      // if (request.url === url) {
      //   // TODO find SiteSpect-Info header and display the interpreted result somewhere
      //   console.log(url, request.headers, response.headers)
      // }
    })
  }
  componentWillReceiveProps (nextProps) {
    if (!nextProps.expanded) {
      this.setState({ checkedVariation: null })
    }
  }
  handleVariationClick (groupId) {
    return async event => {
      // start preview
      const { previewUrl } = this.state
      const { tabId } = chrome.devtools.inspectedWindow
      this.lastClickedVariationGroup = groupId.toString() // don't refactor this, not into state, and don't touch the .toString()

      const preview = new URL(previewUrl)
      const tab = new URL(await getTabUrl(tabId))

      const url = tab.host === preview.host
        ? appendPreviewParams(tab)
        : appendPreviewParams(preview)

      chrome.tabs.update(tabId, { url })
      this.setState({
        checkedVariation: groupId
      })
    }
  }
  render () {
    const { classes, campaign, site, apiClient, ...bulk } = this.props
    const { variationGroups, initialized, checkedVariation } = this.state

    if (!initialized) { return 'Loading...' }

    return (
      <div className={classes.root} {...bulk}>
        {variationGroups &&
          <Table className={classes.table}>
            <TableHead>
              <TableRow className={classes.trh}>
                <TableCell className={classes.th} padding='dense'>&nbsp;</TableCell>
                <TableCell className={classes.th} padding='dense'>Name</TableCell>
                <TableCell className={classes.th} padding='dense' numeric>Variation Group</TableCell>
                <TableCell className={classes.th} padding='dense' numeric>Variations</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {variationGroups.map(variationGroup => {
                const checked = variationGroup.ID === checkedVariation
                return (
                  <TableRow
                    hover
                    key={variationGroup.ID}
                    onClick={this.handleVariationClick(variationGroup.ID)}
                    className={classes.variation}
                  >
                    <TableCell className={classes.td} padding='checkbox'>
                      <Radio checked={checked} />
                    </TableCell>
                    <TableCell className={classes.td} padding='dense'>{variationGroup.Name}</TableCell>
                    <TableCell className={classes.td} padding='dense' numeric>{variationGroup.ID}</TableCell>
                    <TableCell className={classes.td} padding='dense' numeric>
                      {variationGroup.Variations.map(variation => variation.VariationID).join(', ')}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        }
      </div>
    )
  }
}

Campaign.propTypes = {
  classes: PropTypes.object.isRequired,
  apiClient: PropTypes.object.isRequired
}
export default withStyles(styles)(Campaign)
