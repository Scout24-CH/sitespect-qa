/* global localStorage */

const handleApiEmbedResponse = ({_embedded, errors}) => {
  if (errors || !_embedded) {
    console.error(errors) // TODO: handle them
    return null
  }
  if (Object.keys(_embedded).length === 1) {
    return _embedded[Object.keys(_embedded).shift()]
  }
  return _embedded
}
const persistCredentials = (username, password, baseUrl) => {
  localStorage.setItem('apiClient', JSON.stringify({ username, password, baseUrl }))
}
const readCredentials = () => {
  try {
    const { username, password, baseUrl } = JSON.parse(localStorage.getItem('apiClient'))
    return { username, password, baseUrl }
  } catch (e) {
    return {}
  }
}

class ApiClient {
  constructor (tabId) {
    this.baseUrl = null
    this.token = null
    this.tokenLastUsed = 0
    this.tokenMaxAge = 14 * 60 * 1000 // token lasts 15min after last usage, let's use 14
    this.logoutPrevention = null
  }

  getUrl (url = '') {
    if (url.indexOf('http') === 0) { return url }
    return `${this.baseUrl}${url}`
  }

  bareApiCall (url, init = {}) {
    return global.fetch(this.getUrl(url), init)
      .then(response => response.json())
  }

  apiCall (url, init = {}) {
    if (!this.token) {
      throw new Error('token is undefined')
    }
    init.headers = {
      ...init.headers,
      'X-API-TOKEN': this.token
    }
    this.tokenLastUsed = Date.now()
    return this.bareApiCall(url, init)
  }

  async auth (username, password, url) {
    try {
      url = new URL(url)
      this.baseUrl = `${url.protocol || 'https:'}//${url.host}/api`
    } catch (e) {}
    username = username.trim()
    if (!username || !password || !this.baseUrl) { return false }

    url = new URL(url)
    this.baseUrl = `${url.protocol}//${url.host}/api`

    const { token, errors } = await this.bareApiCall('/token', {
      body: JSON.stringify({ username, password }),
      method: 'POST'
    })

    if (errors || !token) {
      console.error(errors) // TODO: handle them
      return false
    }

    this.token = token
    this.tokenLastUsed = Date.now()

    persistCredentials(username, password, this.baseUrl)

    this.logoutPrevention = global.setInterval(() => {
      if (!this.isAuthenticated()) {
        return global.clearInterval(this.logoutPrevention)
      }
      this.getSites()
    }, this.tokenMaxAge - 1000)

    return true
  }

  async reAuth () {
    try {
      const { username, password, baseUrl } = readCredentials()
      if (username && password && baseUrl) {
        await this.auth(username, password, baseUrl)
      }
    } catch (e) {}
    return this.isAuthenticated()
  }

  async logout () {
    persistCredentials('', '', '')
    this.baseUrl = null
    this.token = ''
    this.tokenLastUsed = 0
  }

  isAuthenticated () {
    return this.token && (Date.now() - this.tokenLastUsed < this.tokenMaxAge)
  }

  async getSites () {
    this._authCheck()
    return this.apiCall('/sites')
      .then(handleApiEmbedResponse)
  }

  async getCampaings (siteId) {
    this._authCheck()
    return this.apiCall(`/site/${siteId}/campaigns`)
      .then(handleApiEmbedResponse)
  }

  async getCampaignVariations (siteId, campaignId) {
    this._authCheck()
    return this.apiCall(`/site/${siteId}/campaign/${campaignId}/campaignvariations`)
      .then(handleApiEmbedResponse)
  }

  async getVariationGroups (siteId, campaignId) {
    this._authCheck()
    return this.apiCall(`/site/${siteId}/campaign/${campaignId}/variationgroups`)
      .then(handleApiEmbedResponse)
  }

  async getFactor (siteId, factorId) {
    this._authCheck()
    return this.apiCall(`/site/${siteId}/factor/${factorId}`)
      .then(handleApiEmbedResponse)
  }

  async getVariation (siteId, factorId, variationId) {
    this._authCheck()
    return this.apiCall(`/site/${siteId}/factor/${factorId}/variation/${variationId}`)
  }

  _authCheck () {
    if (!this.isAuthenticated()) {
      throw new Error('User not authenticated')
    }
  }
}

export default ApiClient
