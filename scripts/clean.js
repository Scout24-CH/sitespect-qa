const cwd = process.cwd()
const path = require('path')
const fs = require('fs-extra')

const clean = async () => {
  await fs.remove(path.join(cwd, 'build'))
  await fs.remove(path.join(cwd, 'extension.zip'))
  await fs.emptyDir(path.join(cwd, 'extension'))
}

clean()
