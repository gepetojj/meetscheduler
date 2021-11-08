import dayjs from "dayjs";
import { FC, useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import styled from "styled-components";

import Button from "../components/Button";
import { useMSContext } from "../components/MSContext";
import { Storage } from "../helpers/storage";

const electron = window.require("electron");

const Fullpage = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100%;
	user-select: none;
`;

const Slogan = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100%;
`;

const TextArea = styled.div`
	margin: 1.3rem;
`;

const Title = styled.h1`
	font-weight: 600;
	font-size: 2.5rem;
	text-align: left;
	color: ${({ theme }) => theme.colors.font.main};
`;

const Subtitle = styled.p`
	font-weight: 400;
	font-size: 1rem;
	text-align: left;
	color: ${({ theme }) => theme.colors.font.mOne};
	margin-bottom: 3rem;
`;

const Copyright = styled.div`
	margin-bottom: 2rem;
`;

const CopyrightText = styled.p`
	text-align: center;
	color: ${({ theme }) => theme.colors.font.main};
	user-select: none;
	cursor: pointer;
`;

const Landing: FC = () => {
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
	}, [settings, storage]);

	return (
		<Fullpage>
			{redirect}
			<Slogan>
				<TextArea>
					<Title>MeetScheduler</Title>
					<Subtitle>
						Seja alertado quando seus compromissos iniciarem.
					</Subtitle>
				</TextArea>
				<TextArea>
					<Link to="/dashboard">
						<Button type="primary" text="Comece agora" />
					</Link>
				</TextArea>
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
};

export default Landing;
