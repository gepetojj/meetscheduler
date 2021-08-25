import { BrowserWindow, dialog, app } from "electron";
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
					buttons: ["Atualizar", "Ignorar"],
					title: "Atualização disponível!",
				})
				.then((response) => {
					if (response.response === 0) {
						window.webContents.emit("update-started");
						autoUpdater.downloadUpdate();
					}
				});
		});

		autoUpdater.on("download-progress", (info) => {
			window.webContents.emit("update-progress", info);
		});

		autoUpdater.on("update-downloaded", () => {
			window.webContents.emit("update-finished");
			autoUpdater.quitAndInstall();
		});

		autoUpdater.on("error", (err) => {
			window.webContents.emit("update-finished");
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
