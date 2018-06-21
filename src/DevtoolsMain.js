import React, { PureComponent } from 'react'

import {
  ButtonAppBar,
  CampaignList,
  LoadingDialog,
  LoginDialog,
  SiteList
} from './components'
import { ApiClient } from './constructors'

const chrome = global.chrome

class DevtoolsMain extends PureComponent {
  constructor () {
    super()
    this.apiClient = new ApiClient(
      chrome.devtools.inspectedWindow.tabId
    )
    this.state = {
      isInitialized: false,
      isAuthenticated: false,
      page: 'loading',
      sites: [],
      pageData: {}
    }
    this.handleLogin = this.handleLogin.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
  }
  async componentDidMount () {
    // handle auth
    const isAuthenticated = await this.apiClient.reAuth()
    this.setState({
      isInitialized: true,
      isAuthenticated
    })
    this.showPage(isAuthenticated ? 'overview' : 'login')
  }
  async handleLogin (username, password, baseUrl) {
    await this.apiClient.auth(username, password, baseUrl)
    const isAuthenticated = this.apiClient.isAuthenticated()
    this.setState({ isAuthenticated })
    this.showPage(isAuthenticated ? 'overview' : 'login')
    return isAuthenticated
  }
  async handleLogout () {
    await this.apiClient.logout()
    this.setState({ isAuthenticated: false })
    this.showPage('login')
  }

  async showPage (page, pageData = {}) {
    // handle pageData
    switch (page) {
      case 'overview' :
        // list all sites
        const sites = await this.apiClient.getSites()
        pageData = { sites }
        break
      case 'site-detail' :
        const site = pageData
        const allCampaigns = await this.apiClient.getCampaings(site.ID)
        const campaigns = allCampaigns.filter(campaign =>
          campaign.Status !== 'ended' && campaign.Status !== 'archived'
        )
        pageData = {
          campaigns,
          site
        }
        break

      default:
        break
    }

    this.setState({
      page,
      pageData
    })
  }
  render () {
    const { pageData } = this.state
    return (
      <div>
        {this.state.page === 'loading' &&
          <LoadingDialog message='Connecting to SiteSpect...' />
        }
        {this.state.page === 'login' &&
          <LoginDialog
            open={this.state.isInitialized && !this.state.isAuthenticated}
            onLogin={this.handleLogin}
          />
        }
        {this.state.page === 'overview' &&
          <div>
            <ButtonAppBar
              isAuthenticated={this.state.isAuthenticated}
              onLogout={this.handleLogout}
            />
            <SiteList
              items={pageData.sites}
              onItemClick={item => {
                this.showPage('site-detail', item)
              }}
            />
          </div>
        }
        {this.state.page === 'site-detail' &&
          <div>
            <ButtonAppBar
              isAuthenticated={this.state.isAuthenticated}
              onLogout={this.handleLogout}
              onBack={() => this.showPage('overview')}
              title={pageData.site.Name}
            />
            <CampaignList
              site={pageData.site}
              items={pageData.campaigns}
              apiClient={this.apiClient}
              onItemClick={item => {}}
            />
          </div>
        }
      </div>
    )
  }
}

export default DevtoolsMain
