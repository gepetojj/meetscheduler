import Collapse from "@material-ui/core/Collapse";
import { SnackbarProvider } from "notistack";
import { useEffect, useState } from "react";
import { ThemeProvider } from "styled-components";

import { Header } from "./components/Header";
import { MSCProvider } from "./components/MSContext";
import { Update } from "./components/Update";
import Routes from "./routes";
import { Globals } from "./styles/globals";
import { theme } from "./styles/theme";

const ipcRenderer = window.require("electron").ipcRenderer;

export default function App() {
	const [isUpdating, setIsUpdating] = useState<boolean>(false);
	const [updateData, setUpdateData] = useState(null);

	useEffect(() => {
		ipcRenderer.on("update-started", () => {
			setIsUpdating(true);
		});
		ipcRenderer.on("update-progress", (_, info) => {
			setUpdateData(info);
		});
		ipcRenderer.on("update-finished", () => {
			setIsUpdating(false);
		});
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
					<Header />
					<Update isVisible={isUpdating} data={updateData} />
					<Routes />
				</MSCProvider>
			</SnackbarProvider>
		</ThemeProvider>
	);
}
