const { app, BrowserWindow } = require("electron");
const { spawn } = require("child_process");
const path = require("path");
const electronReload = require("electron-reload");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      //   webSecurity: false,
      //   allowRunningInsecureContent: false,
      contentSecurityPolicy:
        "default-src 'unsafe-inline'; connect-src http://localhost:3000",
    },
  });

  win.webContents.openDevTools();

  win.loadFile("app/frontend/index.html");
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
