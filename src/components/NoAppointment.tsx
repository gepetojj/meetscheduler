import { RiGhostLine } from "react-icons/ri";
import styled from "styled-components";

import { theme } from "../styles/theme";

const NoAppointmentArea = styled.div`
	display: flex;
	flex-direction: column;
	width: 6.7rem;
	height: fit-content;
	border-radius: ${({ theme }) => theme.borderRadius};
	background-color: ${({ theme }) => theme.colors.primary};
	margin-bottom: 0.7rem;
	padding: 0.4rem;
	filter: brightness(65%);
`;

const NoAppointmentIcon = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: 0.2rem;
`;

const NoAppointmentText = styled.p`
	font-size: 0.9rem;
	text-align: center;
	color: ${({ theme }) => theme.colors.fontDark};
	user-select: none;
	margin: 0.5rem 0.1rem 0.2rem 0.1rem;
`;

export default function NoAppointment() {
	return (
		<NoAppointmentArea>
			<NoAppointmentIcon>
				<RiGhostLine color={theme.colors.fontDark} size={32} />
			</NoAppointmentIcon>
			<NoAppointmentText>Sem atividades.</NoAppointmentText>
		</NoAppointmentArea>
	);
}
