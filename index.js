const { app, BrowserWindow } = require('electron');

const express = require('./app/express.js')();
require('electron-debug')({
    //enabled: false
});

app.on('ready', function() {
    mainWindow = new BrowserWindow({
        width: 830,
        height: 650,
        autoHideMenuBar: true,
        useContentSize: true,
        resizable: false,
        webPreferences: {
            webSecurity: false
        }
    });
    mainWindow.loadURL('http://localhost:3003/');
    mainWindow.focus();
    //mainWindow.webContents.openDevTools();
});
