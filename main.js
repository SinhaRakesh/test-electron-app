const { app, BrowserWindow, ipcMain, ipcRenderer } = require("electron");
// const { spawn } = require("child_process");
const path = require("path");
const electronReload = require("electron-reload");
const { autoUpdater,AppUpdater } = require("electron-updater");
const express = require("express");
// const userApiRoute = require("./app/server/api.js");

let win;
let isAppReady = false;

autoUpdater.autoDownload=false;
autoUpdater.autoInstallOnAppQuit=true;

const createWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // preload: path.join(__dirname, "./preload.js"),
      //   webSecurity: false,
      //   allowRunningInsecureContent: false,
      contentSecurityPolicy:
        "default-src 'unsafe-inline'; connect-src http://localhost:4000; script-src 'self' http://localhost:4000;",
      // nodeIntegration: true,
      contextIsolation: false
    },
  });

  win.webContents.openDevTools();

  win.loadFile("app/frontend/index.html");
  // Check for updates
};

app.whenReady().then(() => {
  if (isAppReady) return;
  isAppReady = true;
  console.log("\x1b[32m", "Electron Desktop APP Started !", "\x1b[0m");

  //launch server
  // Start the Express server
  // const expressServer = spawn(process.execPath, [
  //   path.join(process.cwd(), "app/server/expressServer.js"),
  // ]);

  /*
  const expressServer = spawn("node", ["app/server/expressServer.js"]);
  expressServer.on("error", (err) => {
    console.error("Error starting Express server:", err);
    win.webContents.executeJavaScript('console.log("express server on error")');
    const serializedError = JSON.stringify(err.message);
    win.webContents.executeJavaScript(`console.error(${serializedError})`);
  });

  expressServer.stdout.on("data", (data) => {
    console.log(`Express server output: ${data}`);
    win.webContents.executeJavaScript(
      'console.log("express server success output")'
    );
  });

  expressServer.stderr.on("data", (data) => {
    console.error(`Express server error: ${data}`);
    win.webContents.executeJavaScript('console.log("express server error")');
    const serializedError = JSON.stringify(data);
    win.webContents.executeJavaScript(`console.error(${serializedError})`);
  });

  expressServer.on("close", (code) => {
    console.log(`Express server process exited with code ${code}`);
    win.webContents.executeJavaScript('console.log("express server on close")');
    const serializedError = JSON.stringify(code);
    win.webContents.executeJavaScript(`console.error(${serializedError})`);
  });
  */

  // manually loaded here

  const api = express();
  // Define server routes and middleware functions
  // ...
  // api.use("/api", userApiRoute);
  api.use("/", function (req, res, next) {
    res.send({ res: "express api " });
  });

  api.listen(4000, () => {
    console.log(
      "\x1b[32m",
      `Express server is running on port 4000 `,
      "\x1b[0m"
    );
  });
  //----------------------

  createWindow();

  electronReload(__dirname, {
    electron: path.join(__dirname, "node_modules", ".bin", "electron"),
  });

  // console from frontend to backedn main.js file
  // win.webContents.on("console-message", (event, level, message) => {
  //   console.log(`Renderer console (${level}): ${message}`);
  // });

  // console from main.js to frontend devetool console
  win.webContents.executeJavaScript('console.log("Message from main process")');

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  autoUpdater.checkForUpdatesAndNotify();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Auto-update event listeners
autoUpdater.on("update-available", (ua) => {
  // Handle update available
  console.log("new version available", ua);
  win.webContents.executeJavaScript('console.log("new version available")');
});

autoUpdater.on("update-not-available", (una) => {
  // Handle update not available

  console.log("new update not available");
  win.webContents.executeJavaScript('console.log("your app is up to date")');
});

autoUpdater.on("error", (error) => {
  // Handle error
  console.log("new update error occure", error);
  win.webContents.executeJavaScript('console.log("auto updater error ")');
  const serializedError = JSON.stringify(error);
  win.webContents.executeJavaScript(`console.error(${serializedError})`);
});

autoUpdater.on("download-progress", (progress) => {
  // Handle download progress
  console.log("downloading in progress");

  win.webContents.executeJavaScript('console.log("download in progress ")');
});

autoUpdater.on("update-downloaded", () => {
  // Handle update downloaded
  console.log("new version downloaded");
  win.webContents.executeJavaScript('console.log("updated downloaded")');
  autoUpdater.quitAndInstall();
});
