const fs = require('fs-extra')

const routes = [
  { name: '/devtools', filename: 'devtools.html' },
  { name: '/devtools/main', filename: 'devtools-main.html' },
  { name: '/popup', filename: 'popup.html' }
]

const create = async () => {
  // don't refactor this, so we can keep the extension
  // folder reference in chrome for reloading the unpacked extension
  await fs.ensureDir('./extension')
  await fs.copy('./build', './extension')
  await fs.remove('./build')

  // read index html
  const indexFile = './extension/index.html'
  const content = await fs.readFile(indexFile, 'utf8')
  await fs.remove(indexFile)

  // write routes
  routes.forEach(async route => {
    await fs.writeFile(`./extension/${route.filename}`, content.replace('##NAME##', route.name))
  })
}

create()
