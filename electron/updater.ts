import { BrowserWindow, dialog, app, ipcMain } from "electron";
import { autoUpdater } from "electron-updater";
import logger from "electron-log";

export class Updater {
	constructor(window: BrowserWindow) {
		logger.transports.file.level = "debug";
		autoUpdater.logger = logger;
		autoUpdater.autoDownload = false;

		autoUpdater.on("checking-for-update", () => {
			window.setTitle(
				`${app.getName()} - Procurando por atualizações...`
			);
		});

		autoUpdater.on("update-available", () => {
			dialog
				.showMessageBox(window, {
					message: `Uma atualização para o ${app.getName()} está disponível.`,
					type: "info",
					buttons: ["Ignorar", "Atualizar"],
					title: "Atualização disponível!",
				})
				.then((response) => {
					if (response.response === 1) {
						ipcMain.emit("update-started");
						autoUpdater.downloadUpdate();
					}
				});
		});

		autoUpdater.on("download-progress", (info) => {
			ipcMain.emit("update-progress", info);
		});

		autoUpdater.on("update-downloaded", () => {
			ipcMain.emit("update-successful");
			autoUpdater.quitAndInstall();
		});

		autoUpdater.on("error", (err) => {
			ipcMain.emit("update-finished");
			dialog.showMessageBox(window, {
				message: err,
				type: "error",
				buttons: ["OK"],
				title: "A atualização falhou.",
			});
		});
	}

	update() {
		return autoUpdater.checkForUpdatesAndNotify();
	}
}
