import CircularProgress from "@material-ui/core/CircularProgress";
import { FC, memo } from "react";
import styled from "styled-components";

import { theme } from "../styles/theme";

const LoadingArea = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 100vw;
	height: 100vh;
	color: ${({ theme }) => theme.colors.font.main};
	user-select: none;
`;

const LoadingContent: FC = () => {
	return (
		<LoadingArea>
			<h1>MeetScheduler está carregando.</h1>
			<CircularProgress
				style={{
					color: theme.colors.font.mOne,
					marginTop: "2rem",
				}}
			/>
		</LoadingArea>
	);
};

export default memo(LoadingContent);
