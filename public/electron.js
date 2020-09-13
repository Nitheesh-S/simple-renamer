// Modules to control application life and create native browser window
const {app, BrowserWindow, session} = require('electron')
const path = require('path')


app.on('ready',
  async () => {
    // await session.defaultSession.loadExtension(path.join('../node_modules/react-devtools'))
    // await session.defaultSession.loadExtension(path.join('%LOCALAPPDATA%\\Local\\Google\\Chrome\\User Data\\Default\\Extensions\\fmkadmapgofadopljbjfkapdkoienihi\\4.7.0_0'))
    
    const mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true
      }
    })

    mainWindow.loadURL('http://localhost:8080/')
    // mainWindow.loadFile('dist/index.html')

    // Open the DevTools.
    mainWindow.webContents.openDevTools({mode:'detach'})
    mainWindow.show()

    app.on('activate', function () {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  }
)

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
