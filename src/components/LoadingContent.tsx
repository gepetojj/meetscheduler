import { memo } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";

import { theme } from "../styles/theme";

function LoadingContent() {
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
				width: "100%",
				height: "100%",
				color: theme.colors.font.main,
			}}
		>
			<h1>O MeetScheduler está carregando.</h1>
			<h2 style={{ marginTop: "0.5rem" }}>Aguarde...</h2>
			<CircularProgress
				style={{
					color: theme.colors.font.mOne,
					marginTop: "2rem",
				}}
			/>
		</div>
	);
}

export default memo(LoadingContent);
