import { useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import styled from "styled-components";
import dayjs from "dayjs";

import { Storage } from "../helpers/storage";
import { useMSContext } from "../components/MSContext";

const electron = window.require("electron");

const Fullpage = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100%;
`;

const Slogan = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100%;

	@media (max-width: 650px) {
		flex-direction: column;
	}
`;

const LeftSide = styled.div`
	margin-right: 2rem;

	@media (max-width: 650px) {
		margin: 0 2rem;
	}
`;

const RightSide = styled.div`
	margin-left: 2rem;

	@media (max-width: 650px) {
		margin: 2rem 0;
	}
`;

const Title = styled.h1`
	text-align: left;
	color: ${({ theme }) => theme.colors.font};
	user-select: none;
`;

const Subtitle = styled.p`
	text-align: left;
	color: ${({ theme }) => theme.colors.fontDark};
	user-select: none;
`;

const CTAButton = styled.button`
	background-color: ${({ theme }) => theme.colors.primary};
	color: ${({ theme }) => theme.colors.font};
	border: none;
	border-radius: ${({ theme }) => theme.borderRadius};
	padding: 0.8rem;
	cursor: pointer;
	user-select: none;
	transition: 0.2s;

	&:hover {
		filter: brightness(115%);
	}

	&:active {
		filter: brightness(120%);
	}
`;

const Copyright = styled.div`
	margin-bottom: 2rem;
`;

const CopyrightText = styled.p`
	text-align: center;
	color: ${({ theme }) => theme.colors.fontDarker};
	user-select: none;
	cursor: pointer;
`;

export default function Landing() {
	const [redirect, setRedirect] = useState<JSX.Element | null>(null);
	const [storage] = useState(new Storage("firstTimeAccess"));
	const { settings } = useMSContext();

	useEffect(() => {
		const firstTimeAccess = storage.refresh();
		settings.update("firstTimeAccess", firstTimeAccess);

		if (firstTimeAccess) {
			storage.write(false);
		} else {
			setRedirect(<Redirect to={"dashboard"} />);
		}

		// eslint-disable-next-line
	}, []);

	return (
		<Fullpage>
			{redirect}
			<Slogan>
				<LeftSide>
					<Title>MeetScheduler</Title>
					<Subtitle>
						Seja alertado quando seus compromissos iniciarem.
					</Subtitle>
				</LeftSide>
				<RightSide>
					<Link to="/dashboard">
						<CTAButton>Comece agora</CTAButton>
					</Link>
				</RightSide>
			</Slogan>
			<Copyright>
				<CopyrightText
					onClick={() => {
						electron.shell.openExternal(
							"https://github.com/gepetojj"
						);
					}}
				>
					Copyright © {dayjs().year()} © Gepetojj
				</CopyrightText>
			</Copyright>
		</Fullpage>
	);
}
