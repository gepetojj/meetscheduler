import { memo } from "react";
import { RiGhostLine } from "react-icons/ri";
import styled from "styled-components";

import { theme } from "../styles/theme";

const AppointmentArea = styled.div`
	display: flex;
	flex-direction: row;
	width: 170px;
	height: 70px;
	justify-content: center;
	align-items: center;
	border-radius: ${({ theme }) => theme.borderRadius};
	background-color: ${({ theme }) => theme.colors.secondary.pTwo};
	padding: 1rem;
	margin-bottom: 0.7rem;
`;

const AppointmentLabel = styled.span`
	font-weight: 500;
	text-align: right;
	width: fit-content;
	color: ${({ theme }) => theme.colors.font.main};
	user-select: none;
`;

function NoAppointment() {
	return (
		<AppointmentArea>
			<RiGhostLine color={theme.colors.font.mOne} size={40} />
			<AppointmentLabel>Sem atividades</AppointmentLabel>
		</AppointmentArea>
	);
}

export default memo(NoAppointment);
