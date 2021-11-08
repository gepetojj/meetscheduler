import { BrowserWindow, Menu, Tray, app } from "electron";
import * as path from "path";
import * as url from "url";
import "v8-compile-cache";

import { config } from "./config";
import { Updater } from "./updater";

let window: BrowserWindow | null;
let updater: Updater | null;
let tray: Tray | null;
const ICON_NAME = "icon.ico";

function createTray() {
	tray = new Tray(path.resolve(__dirname, ICON_NAME));
	const trayMenu = Menu.buildFromTemplate([
		{ label: "MeetScheduler" },
		{ type: "separator" },
		{
			label: "Abrir",
			click: () => {
				if (window) {
					window.show();
				}
			},
		},
		{
			label: "Fechar",
			click: app.quit,
		},
	]);

	tray.setToolTip("MeetScheduler");
	tray.setContextMenu(trayMenu);

	tray.on("double-click", () => {
		if (window) {
			window.show();
		}
	});
	return tray;
}

function createWindow() {
	window = new BrowserWindow({
		width: 1200,
		minWidth: 330,
		height: 800,
		minHeight: 370,
		icon: path.resolve(__dirname, ICON_NAME),
		frame: false,
		webPreferences: {
			nodeIntegration: true,
			enableRemoteModule: true,
			contextIsolation: false,
		},
	});
	updater = new Updater(window);

	window.setMenu(null);
	if (config.dev) {
		window.loadURL("http://localhost:3000");
		window.webContents.openDevTools();
	} else {
		window.loadURL(
			url.format({
				pathname: path.join(__dirname, "index.html"),
				protocol: "file:",
				slashes: true,
			})
		);
	}

	window.on("minimize", ({ preventDefault }: Electron.Event) => {
		preventDefault();
		if (window) {
			window.hide();
			tray = createTray();
		}
	});

	window.on("restore", () => {
		if (window) {
			window.show();
		}
		if (tray) {
			tray.destroy();
		}
	});

	window.on("closed", () => {
		window = null;
		if (tray) {
			tray.destroy();
		}
	});

	window.webContents.on("ipc-message", (_, channel) => {
		if (channel === "minimize-program" && window) {
			window.minimize();
		}
		if (channel === "close-program" && window) {
			window.close();
		}
	});
}

app.on("ready", () => {
	createWindow();
	if (updater && !config.dev) {
		updater.update();
	}
});

app.on("activate", () => {
	if (!window) {
		createWindow();
	}
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});
