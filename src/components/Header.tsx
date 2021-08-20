import { RiCloseLine } from "react-icons/ri";
import { FiMinus } from "react-icons/fi";
import styled from "styled-components";

import { theme } from "../styles/theme";
import logo from "../assets/ms-ico.png";

const electron = window.require("electron");

const HeaderArea = styled.header`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	height: 40px;
	min-height: 40px;
	padding: 0 1.8rem;
	background-color: ${({ theme }) => theme.colors.backgroundLight};
	user-select: none;
	-webkit-app-region: drag;
`;

const HeaderLeftSide = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
`;

const HeaderLogo = styled.img`
	width: 1.3rem;
	height: 100%;
	border-radius: ${({ theme }) => theme.borderRadius};
`;

const HeaderTitle = styled.p`
	margin-left: 0.7rem;
	font-size: 0.9rem;
	color: ${({ theme }) => theme.colors.font};
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
	width: 3rem;
	height: 100%;
	background-color: ${({ theme }) => theme.colors.backgroundLight};
	border: none;
	border-radius: ${({ theme }) => theme.borderRadius};
	cursor: pointer;
	transition: 0.2s;
	-webkit-app-region: no-drag;

	&:hover {
		filter: brightness(130%);
		background-color: ${({ theme, isCloseOption }) =>
			isCloseOption
				? theme.colors.backgroundRed
				: theme.colors.backgroundLight};
	}
`;

export default function Header({ children }) {
	return (
		<>
			<HeaderArea>
				<HeaderLeftSide>
					<HeaderLogo src={logo} alt="Logo do MeetScheduler" />
					<HeaderTitle>MeetScheduler</HeaderTitle>
				</HeaderLeftSide>
				<HeaderRightSide>
					<HeaderOption
						onClick={() => {
							electron.remote.getCurrentWindow().minimize();
						}}
					>
						<FiMinus color={theme.colors.font} />
					</HeaderOption>
					<HeaderOption
						isCloseOption
						onClick={() => {
							electron.remote.getCurrentWindow().close();
						}}
					>
						<RiCloseLine color={theme.colors.font} />
					</HeaderOption>
				</HeaderRightSide>
			</HeaderArea>
			{children}
		</>
	);
}
