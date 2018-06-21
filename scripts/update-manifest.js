const cwd = process.cwd()
const path = require('path')
const fs = require('fs-extra')
const manifestFile = path.join(cwd, 'public', 'manifest.json')
const manifest = require(manifestFile)
const pkg = require(path.join(cwd, 'package.json'))

const updateManifest = async () => {
  manifest.version = pkg.version
  await fs.writeFile(manifestFile, JSON.stringify(manifest, null, 2))
}

updateManifest()
