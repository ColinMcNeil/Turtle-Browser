const { app, BrowserWindow, webContents, ipcMain, session } = require('electron')
const { autoUpdater } = require("electron-updater")
const path = require('path')
const url = require('url')
const isDev = require('electron-is-dev');
const fs = require('fs')
const domains = fs.readFileSync(__dirname + '\\..\\adblock\\domains.csv', 'utf8').split('\n')
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow() {
    global.sharedObj = { args:process.argv }
    // Create the browser window.
    win = new BrowserWindow({ width: 800, height: 600, frame: false, transparent: true})
    autoUpdater.on('error', (error) => {
        win.webContents.send('log', { msg: error.toString() });
    })
    autoUpdater.on('checking-for-update', () => {
        win.webContents.send('log', { msg: 'Checking for updates!' });
    })
    // and load the index.html of the app.
    win.loadURL(url.format({
        pathname: path.resolve(__dirname+'/../index.html'),
        protocol: 'file:',
        slashes: true
    }))

    // Open the DevTools.
    

    if (isDev) {
        win.webContents.openDevTools()
    }
    

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null
    })
    session.defaultSession.webRequest.onBeforeRequest(['*://*./*'], function (details, callback) {
        let url = details.url;
        for (let i = 0; i < domains.length; i++) {
            if (url.includes(domains[i])) {
                callback({ cancel: true })
                return;
            }
        }
        callback({cancel:false})

    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow()
    }
})
ipcMain.on('synchronous-message', (event, arg) => {
    //win.loadURL('https://google.com/');
    console.log('revieved event '+arg)
    if (arg == 'close') {
        app.quit()
    }
    if (arg == 'min') {
        
        win.minimize();
    }
    if (arg == 'max') {
        if (win.isMaximized()) {
            win.unmaximize();
        }
        else {
            win.maximize();
        }
    }
    event.returnValue = 'Loading'
})
