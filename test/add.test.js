const test = require('ava')
const sinon = require('sinon')
const plugin = require('../plugin')
const { T } = require('ramda')

console.log(process.cwd());

test('adds the proper npm module, patches a file', async t => {
  // spy on few things so we know they're called
  const addModule = sinon.spy()
  const patchInFile = sinon.spy()
  
  // mock a context
  const context = {
    ignite: { addModule, patchInFile },
    print: {
      warning: T,
      info: T,
      colors: { cyan: T, bold: T }
    }
  }

  await plugin.add(context)
  t.true(
    addModule.calledWith('react-native-onesignal', {
      link: true,
      version: '3.0.5'
    })
  )
  // android manifest patching
  t.true(patchInFile.called)
  t.is(patchInFile.args[0][0], `${process.cwd()}/android/app/src/main/AndroidManifest.xml`)
  t.true(patchInFile.args[0][1].insert.length > 0)
  t.true(patchInFile.args[0][1].after.length > 0)

  // gradle patching
  t.true(patchInFile.called)
  t.is(patchInFile.args[0][0], `${process.cwd()}/android/app/build.gradle`)
  t.true(patchInFile.args[0][1].insert.length > 0)
  t.true(patchInFile.args[0][1].before.length > 0)
})
