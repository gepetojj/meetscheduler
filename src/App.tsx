import { SnackbarProvider } from "notistack";
import { ThemeProvider } from "styled-components";
import Collapse from "@material-ui/core/Collapse";

import { MSCProvider } from "./components/MSContext";
import { Globals } from "./styles/globals";
import { theme } from "./styles/theme";
import Header from "./components/Header";
import Routes from "./routes";

export default function App() {
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
						<Routes />
					</Header>
				</MSCProvider>
			</SnackbarProvider>
		</ThemeProvider>
	);
}
