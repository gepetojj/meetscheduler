import { useState, useEffect } from "react";
import { SnackbarProvider } from "notistack";
import { ThemeProvider } from "styled-components";
import Collapse from "@material-ui/core/Collapse";

import { MSCProvider } from "./components/MSContext";
import { Globals } from "./styles/globals";
import { theme } from "./styles/theme";
import Header from "./components/Header";
import Update from "./components/Update";
import Routes from "./routes";

const electron = window.require("electron");

export default function App() {
	const [isUpdating, setIsUpdating] = useState<boolean>(false);
	const [updateData, setUpdateData] = useState(null);

	useEffect(() => {
		electron.ipcRenderer.on("update-started", () => {
			setIsUpdating(true);
		});
		electron.ipcRenderer.on("update-progress", (_, info) => {
			setUpdateData(info);
		});
		electron.ipcRenderer.on("update-finished", () => {
			setIsUpdating(false);
		});
		electron.ipcRenderer.on("update-successful", () => {});
		// eslint-disable-next-line
	}, []);

	return (
		<ThemeProvider theme={theme}>
			<Globals />
			<SnackbarProvider
				maxSnack={3}
				anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
				TransitionComponent={Collapse}
			>
				<MSCProvider>
					<Header>
						<Update isVisible={isUpdating} data={updateData} />
						<Routes />
					</Header>
				</MSCProvider>
			</SnackbarProvider>
		</ThemeProvider>
	);
}
