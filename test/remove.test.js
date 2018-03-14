const test = require('ava')
const sinon = require('sinon')
const plugin = require('../plugin')

test('removes onesignal', async t => {
  const removeModule = sinon.spy()
  

  // mock a context
  const context = {
    ignite: { addModule, patchInFile }
  }

  await plugin.remove(context)
  t.true(removeModule.calledWith('react-native-onesignal', { unlink: true }))

  // android manifest unpatching
  t.true(patchInFile.called)
  t.is(patchInFile.args[0][0], `${process.cwd()}/android/app/src/main/AndroidManifest.xml`)
  t.true(patchInFile.args[0][1].delete.length > 0)

  // gradle unpatching
  t.true(patchInFile.called)
  t.is(patchInFile.args[0][0], `${process.cwd()}/android/app/build.gradle`)
  t.true(patchInFile.args[0][1].delete.length > 0)
})
