/* eslint-env mocha */

import tmp from 'tmp'
import Ctl from 'ipfsd-ctl'

import { join } from 'path'

const factory = Ctl.createFactory({
  type: 'go',
  remote: false,
  disposable: true,
  test: true // run on random ports
})

async function makeRepository ({ start = false }) {
  const { name: repoPath } = tmp.dirSync({ prefix: 'tmp_IPFS_PATH_', unsafeCleanup: true })
  const configPath = join(repoPath, 'config')

  const ipfsd = await factory.spawn({
    ipfsOptions: { repo: repoPath },
    init: false,
    start: false
  })

  // manual init
  await ipfsd.init({
    bits: 1024,
    profiles: ['test'],
    directory: repoPath
  })

  const { id } = await ipfsd.api.id()
  if (start) await ipfsd.start()
  return { ipfsd, repoPath, configPath, peerId: id }
}

module.exports = {
  makeRepository
}
