const { app, BrowserWindow } = require("electron");
const { spawn } = require("child_process");
const path = require("path");
const electronReload = require("electron-reload");
const { autoUpdater } = require("electron-updater");

let win;
const createWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      //   webSecurity: false,
      //   allowRunningInsecureContent: false,
      contentSecurityPolicy:
        "default-src 'unsafe-inline'; connect-src http://localhost:4000; script-src 'self' http://localhost:4000;",
      // nodeIntegration: true,
      // contextIsolation: false,
    },
  });

  win.webContents.openDevTools();

  win.loadFile("app/frontend/index.html");
  // Check for updates
  autoUpdater.checkForUpdatesAndNotify();
};

app.whenReady().then(() => {
  console.log("\x1b[32m", "Electron Desktop APP Started !", "\x1b[0m");

  //launch server
  // Start the Express server
  const expressServer = spawn("node", ["app/server/expressServer.js"]);

  expressServer.stdout.on("data", (data) => {
    console.log(`Express server output: ${data}`);
  });

  expressServer.stderr.on("data", (data) => {
    console.error(`Express server error: ${data}`);
  });

  expressServer.on("close", (code) => {
    console.log(`Express server process exited with code ${code}`);
  });

  //   const express = require("express");
  //   const server = express();
  // Define server routes and middleware functions
  // ...
  //   server.listen(3000, () => {
  //     console.log("Express server is running on port 3000");
  //   });
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
  win.webContents.executeJavaScript('console.log("new version available", ua)');
});

autoUpdater.on("update-not-available", (una) => {
  // Handle update not available

  console.log("new update not available");
  win.webContents.executeJavaScript(
    'console.log("your app is up to date", una)'
  );
});

autoUpdater.on("error", (error) => {
  // Handle error
  console.log("new update error occure");
  win.webContents.executeJavaScript(
    'console.log("auto updater error ", error)'
  );
});

autoUpdater.on("download-progress", (progress) => {
  // Handle download progress
  console.log("downloading in progress");

  win.webContents.executeJavaScript(
    'console.log("download in progress ", progress)'
  );
});

autoUpdater.on("update-downloaded", () => {
  // Handle update downloaded
  console.log("new version downloaded");
  win.webContents.executeJavaScript('console.log("updated downloaded")');
  autoUpdater.quitAndInstall();
});
