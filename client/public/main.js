/* eslint-disable no-undef */
import { app, BrowserWindow } from "electron/main";
// import path from "path";

function createWindow() {
  const win = new BrowserWindow({
    // icon: path.join(__dirname, "..", "build", "icon.png"),

    width: 800,
    height: 600,
    webPreferences: {
      enableRemoteModule: true,
    },
  });

  win.loadURL("http://localhost:5173/");
}

app.whenReady().then(() => {
  createWindow();

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
