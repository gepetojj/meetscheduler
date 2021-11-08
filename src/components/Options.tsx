import Divider from "@material-ui/core/Divider";
import Menu from "@material-ui/core/Menu";
import Switch from "@material-ui/core/Switch";
import { styled as MUIStyled } from "@material-ui/core/styles";
import { Close, MoreVert } from "@material-ui/icons";
import { FC, MouseEvent, useEffect, useState } from "react";
import Modal from "reactjs-popup";
import styled from "styled-components";

import { Storage } from "../helpers";
import { theme } from "../styles/theme";
import Input from "./Input";
import { useMSContext } from "./MSContext";

const shell = window.require("electron").shell;

const OptionsButton = styled.button`
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	background-color: ${({ theme }) => theme.colors.secondary.main};
	border: none;
	border-radius: ${({ theme }) => theme.borderRadius};
	transition: 0.2s;
	cursor: pointer;

	&:hover {
		filter: brightness(115%);
	}
`;

const Option = styled.button<{ secondary?: boolean }>`
	width: 8rem;
	height: 2rem;
	color: ${({ theme }) => theme.colors.font.mOne};
	background-color: ${({ theme, secondary }) =>
		secondary ? theme.colors.secondary.mOne : theme.colors.primary.mOne};
	border: none;
	border-radius: ${({ theme }) => theme.borderRadius};
	margin: 0.2rem 0;
	cursor: pointer;
	transition: 0.2s;

	&:hover {
		filter: brightness(115%);
	}
`;

const StyledMenu = MUIStyled(Menu)({
	"& .MuiPaper-root": {
		width: "10rem",
		height: "fit-content",
		padding: "0.5rem 0",
		backgroundColor: theme.colors.secondary.mOne,
		color: theme.colors.font.main,
	},
	"& .MuiList-root": {
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
	},
});

const SettingsModal = styled(Modal)`
	&-overlay {
		background-color: #00000035;
	}

	&-content {
		background-color: ${({ theme }) => theme.colors.secondary.main};
		width: 30rem;
		height: fit-content;
		padding: 1rem;
		border: 1px solid ${({ theme }) => theme.colors.font + "10"};
		border-radius: ${({ theme }) => theme.borderRadius};
	}
`;

const SettingsModalHeader = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
	align-items: center;
	width: 100%;
	height: fit-content;
	margin-bottom: 1rem;

	& svg {
		cursor: pointer;
	}
`;

const SettingsModalTitle = styled.h1`
	font-size: 1.5rem;
	text-align: center;
	color: ${({ theme }) => theme.colors.font.main};
	user-select: none;
`;

const SettingsModalOptions = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: flex-start;
	margin: 2rem;
`;

const Setting = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;

	& p {
		color: ${({ theme }) => theme.colors.font.mOne};
		margin-right: 0.5rem;
	}
`;

const StyledSwitch = MUIStyled(Switch)({
	"& .MuiSwitch-switchBase": {
		color: theme.colors.secondary.mTwo,
		transition: "0.2s",
	},
	"& .MuiSwitch-track": {
		backgroundColor: theme.colors.secondary.mTwo,
	},
	"& .MuiIconButton-root:hover": {
		backgroundColor: theme.colors.secondary.mTwo + "25",
	},
	"& .MuiSwitch-colorSecondary.Mui-checked": {
		color: theme.colors.primary.main,
	},
	"& .MuiSwitch-colorSecondary.Mui-checked + .MuiSwitch-track": {
		backgroundColor: theme.colors.secondary.mTwo,
	},
	"& .MuiSwitch-colorSecondary.Mui-checked:hover": {
		backgroundColor: theme.colors.primary.main + "25",
	},
});

const StyledDivider = MUIStyled(Divider)({
	width: "100%",
	height: "1px",
	margin: "0.8rem 0",
	borderRadius: theme.borderRadius,
	backgroundColor: theme.colors.secondary.mOne,
});

export const Options: FC = () => {
	const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
	const [isMenuVisible, setMenuVisible] = useState(false);
	const [isSettingsVisible, setSettingsVisible] = useState(false);
	const [suffix, setSuffix] = useState("");
	const { settings } = useMSContext();

	useEffect(() => {
		setSuffix(settings.linkSuffix);
	}, [settings]);

	const enableMenu = (event: MouseEvent<HTMLButtonElement>) => {
		setMenuAnchor(event.currentTarget);
		setMenuVisible(true);
	};

	const disableMenu = () => setMenuVisible(false);

	return (
		<>
			<SettingsModal
				open={isSettingsVisible}
				onClose={() => {
					setSettingsVisible(false);
				}}
				modal
				closeOnDocumentClick
				repositionOnResize
			>
				{(close: () => void) => (
					<>
						<SettingsModalHeader>
							<Close
								style={{
									fontSize: 30,
									color: theme.colors.font.main,
								}}
								onClick={close}
							/>
						</SettingsModalHeader>
						<SettingsModalTitle>Configurações</SettingsModalTitle>
						<SettingsModalOptions>
							<Setting>
								<p>Segunda como primeiro dia da semana.</p>
								<StyledSwitch
									checked={settings.useMondayAsFirstDay}
									onChange={({ target }) => {
										new Storage(
											"useMondayAsFirstDay"
										).write(target.checked);
										settings.update(
											"useMondayAsFirstDay",
											target.checked
										);
									}}
								/>
							</Setting>
							<StyledDivider />
							<Setting>
								<p>
									Abrir automaticamente compromissos
									iniciados.
								</p>
								<StyledSwitch
									checked={settings.autoOpenAppointments}
									onChange={({ target }) => {
										new Storage(
											"autoOpenAppointments"
										).write(target.checked);
										settings.update(
											"autoOpenAppointments",
											target.checked
										);
									}}
								/>
							</Setting>
							<StyledDivider />
							<Setting>
								<p>Sufixo automático nos links.</p>
								<Input
									label="Sufixo"
									variant="standard"
									value={suffix}
									onChange={({ target }) =>
										setSuffix(target.value)
									}
									onBlur={() => {
										new Storage("linkSuffix").write(suffix);
										settings.update("linkSuffix", suffix);
									}}
								/>
							</Setting>
						</SettingsModalOptions>
					</>
				)}
			</SettingsModal>
			<OptionsButton
				aria-label="Abre as opções"
				aria-controls="menu"
				aria-haspopup="true"
				onClick={enableMenu}
			>
				<MoreVert
					style={{ color: theme.colors.font.main, fontSize: 30 }}
				/>
			</OptionsButton>
			<StyledMenu
				id="menu"
				keepMounted
				elevation={0}
				open={isMenuVisible}
				onClose={disableMenu}
				anchorEl={menuAnchor}
				transformOrigin={{
					vertical: "center",
					horizontal: "left",
				}}
			>
				<Option
					onClick={() => {
						setMenuVisible(false);
						setSettingsVisible(true);
					}}
				>
					Configurações
				</Option>
				<Option
					secondary={true}
					onClick={() =>
						shell.openExternal(
							"https://github.com/gepetojj/meetscheduler#readme"
						)
					}
				>
					MeetScheduler
				</Option>
			</StyledMenu>
		</>
	);
};
