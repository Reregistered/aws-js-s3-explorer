const { app, BrowserWindow } = require("electron");
const { session } = require("electron");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1280,
    height: 1024,
  });

  win.loadFile("index.html");
};

app.whenReady().then(() => {
  const ses = session.fromPartition("persist:aws-browser");
  ses.on("will-download", (event, item, webContents) => {
    event.preventDefault();
    const val = item.getURL();
    require("request")(item.getURL(), (data) => {
      require("fs").writeFileSync(val, data);
    });
  });

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
