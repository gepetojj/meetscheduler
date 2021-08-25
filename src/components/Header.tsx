import { Remove, Close } from "@material-ui/icons";
import styled from "styled-components";

import { theme } from "../styles/theme";

const ipcRenderer = window.require("electron").ipcRenderer;

const HeaderArea = styled.header`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	height: 40px;
	min-height: 40px;
	padding: 0 1.5rem;
	background-color: ${({ theme }) => theme.colors.secondary.pOne};
	user-select: none;
	-webkit-app-region: drag;
`;

const HeaderLeftSide = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
`;

const HeaderTitle = styled.p`
	margin-left: 0.7rem;
	font-size: 0.9rem;
	color: ${({ theme }) => theme.colors.font.main};
`;

const HeaderRightSide = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	height: 100%;
`;

const HeaderOption = styled.button<{ isCloseOption?: boolean }>`
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	width: 3.1rem;
	height: 100%;
	background-color: ${({ theme }) => theme.colors.secondary.pOne};
	border: none;
	border-radius: ${({ theme }) => theme.borderRadius};
	cursor: pointer;
	transition: 0.2s;
	-webkit-app-region: no-drag;

	&:hover {
		filter: brightness(120%);
		background-color: ${({ theme, isCloseOption }) =>
			isCloseOption ? theme.colors.alt.red : theme.colors.secondary.pOne};
	}
`;

export default function Header({ children }) {
	return (
		<>
			<HeaderArea>
				<HeaderLeftSide>
					<HeaderTitle>MeetScheduler</HeaderTitle>
				</HeaderLeftSide>
				<HeaderRightSide>
					<HeaderOption
						onClick={() => {
							ipcRenderer.send("minimize-program");
						}}
					>
						<Remove
							style={{
								fontSize: 24,
								color: theme.colors.font.main,
							}}
						/>
					</HeaderOption>
					<HeaderOption
						isCloseOption
						onClick={() => {
							ipcRenderer.send("close-program");
						}}
					>
						<Close
							style={{
								fontSize: 24,
								color: theme.colors.font.main,
							}}
						/>
					</HeaderOption>
				</HeaderRightSide>
			</HeaderArea>
			{children}
		</>
	);
}
