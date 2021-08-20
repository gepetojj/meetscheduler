import { useState, useEffect } from "react";
import { withSnackbar, useSnackbar } from "notistack";
import { RiRefreshLine } from "react-icons/ri";
import styled from "styled-components";
import dayjs from "dayjs";

import { Day } from "../entities";
import { getDayOfWeek, getMinute, getHour, Storage } from "../helpers";
import { useMSContext } from "../components/MSContext";
import AddAppointmentModal from "../components/AddAppointment";
import Appointment from "../components/Appointment";
import NoAppointment from "../components/NoAppointment";

const ONE_SECOND = 1000;
const electron = window.require("electron");
dayjs.locale("pt-br");

const Fullpage = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
	padding: 5rem 3rem 0 3rem;
`;

const PageTitle = styled.h1`
	font-size: 2.5rem;
	text-align: left;
	color: ${({ theme }) => theme.colors.font};
	user-select: none;
`;

const PageSubTitle = styled.p`
	text-align: left;
	color: ${({ theme }) => theme.colors.fontDark};
	user-select: none;
`;

const Buttons = styled.div`
	display: flex;
	flex-direction: row;
`;

const RefreshButton = styled.button`
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	width: 10rem;
	background-color: ${({ theme }) => theme.colors.background};
	color: ${({ theme }) => theme.colors.font};
	border: 1px solid ${({ theme }) => theme.colors.font + "10"};
	border-radius: ${({ theme }) => theme.borderRadius};
	padding: 0.8rem;
	margin-top: 2rem;
	margin-left: 1.5rem;
	cursor: pointer;
	user-select: none;
	transition: 0.2s;

	&:hover {
		filter: brightness(150%);
	}

	&:active {
		filter: brightness(160%);
	}
`;

const ButtonIcon = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	margin-right: 0.5rem;
`;

const ButtonText = styled.p`
	display: flex;
	text-align: center;
	justify-content: center;
	align-items: center;
	color: ${({ theme }) => theme.colors.fontDark};
	user-select: none;
`;

const ScheduleArea = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: flex-start;
	width: 100%;
	max-width: 100%;
	height: fit-content;
	min-height: fit-content;
	margin: 2rem 0;
	padding-bottom: 1rem;
	overflow-x: auto;

	&::-webkit-scrollbar {
		width: 7px;
		height: 8px;
	}
	&::-webkit-scrollbar-track {
		background-color: ${({ theme }) => theme.colors.backgroundLight};
		border-radius: 10px;
	}
	&::-webkit-scrollbar-thumb {
		background-color: ${({ theme }) => theme.colors.backgroundLighter};
		border-radius: 10px;
	}
`;

const DayArea = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	padding: 0 1rem;
`;

const DayName = styled.h2<{ marked: boolean }>`
	font-size: 1.7rem;
	text-align: center;
	color: ${({ theme }) => theme.colors.font};
	user-select: none;
	margin-bottom: 1rem;
	text-decoration: ${(props) => (props.marked ? "underline" : "none")};
`;

function Dashboard() {
	const [storage] = useState(new Storage("schedule"));
	const [day, setDay] = useState<Day>("monday");
	const [appointmentCache, setAppointmentCache] = useState<string[]>([]);
	const { enqueueSnackbar } = useSnackbar();
	const { schedule } = useMSContext();

	const refreshSchedule = () => {
		schedule.update(storage.refresh());
	};

	useEffect(() => {
		refreshSchedule();
		const dayInterval = setInterval(() => {
			setDay(getDayOfWeek());
		}, ONE_SECOND * 2);
		return () => clearInterval(dayInterval);
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		const checkInterval = setInterval(() => {
			const time = `${getHour()}:${getMinute()}`;

			if (schedule[day].length) {
				const appointments = schedule[day].filter((appointment) => {
					return (
						appointment.time === time &&
						!appointmentCache.includes(appointment.id)
					);
				});
				appointments.forEach((appointment) => {
					const message = `Seu compromisso '${appointment.name}' começou!`;
					electron.shell.openExternal(appointment.link);
					let newAppointmentCache = appointmentCache;
					newAppointmentCache.push(appointment.id);
					setAppointmentCache(newAppointmentCache);
					enqueueSnackbar(message, { variant: "info" });
					new electron.remote.Notification({
						title: "Compromisso iniciado!",
						body: message,
					}).show();
				});
			}
		}, ONE_SECOND);
		return () => clearInterval(checkInterval);
		// eslint-disable-next-line
	}, [schedule]);

	const deleteAppointment = async (day: Day, appointmentId: string) => {
		const newAppointments = schedule[day].filter((appointment) => {
			return appointment.id !== appointmentId;
		});
		const newSchedule = { ...schedule, [day]: newAppointments };
		storage.write(newSchedule);
		refreshSchedule();
	};

	const RefreshAppointments = () => {
		return (
			<RefreshButton
				onClick={() => {
					setAppointmentCache([]);
					refreshSchedule();
					enqueueSnackbar("Horário e cache recarregados.", {
						variant: "success",
					});
				}}
			>
				<ButtonIcon>
					<RiRefreshLine size={21} />
				</ButtonIcon>
				<ButtonText>Recarregar</ButtonText>
			</RefreshButton>
		);
	};

	return (
		<Fullpage>
			<PageTitle>Dashboard</PageTitle>
			<PageSubTitle>
				Aqui estarão seus compromissos agendados. Você pode alterar
				quantos deles tem em um dia, e seus horários.
			</PageSubTitle>
			<Buttons>
				<AddAppointmentModal />
				<RefreshAppointments />
			</Buttons>
			<ScheduleArea>
				<DayArea>
					<DayName marked={day === "monday"}>Segunda</DayName>
					{!schedule.monday.length ? (
						<NoAppointment />
					) : (
						schedule.monday.map((appointment) => (
							<Appointment
								appointment={appointment}
								key={appointment.id}
								deleteAppointment={deleteAppointment}
							/>
						))
					)}
				</DayArea>
				<DayArea>
					<DayName marked={day === "tuesday"}>Terça</DayName>
					{!schedule.tuesday.length ? (
						<NoAppointment />
					) : (
						schedule.tuesday.map((appointment) => (
							<Appointment
								appointment={appointment}
								key={appointment.id}
								deleteAppointment={deleteAppointment}
							/>
						))
					)}
				</DayArea>
				<DayArea>
					<DayName marked={day === "wednesday"}>Quarta</DayName>
					{!schedule.wednesday.length ? (
						<NoAppointment />
					) : (
						schedule.wednesday.map((appointment) => (
							<Appointment
								appointment={appointment}
								key={appointment.id}
								deleteAppointment={deleteAppointment}
							/>
						))
					)}
				</DayArea>
				<DayArea>
					<DayName marked={day === "thursday"}>Quinta</DayName>
					{!schedule.thursday.length ? (
						<NoAppointment />
					) : (
						schedule.thursday.map((appointment) => (
							<Appointment
								appointment={appointment}
								key={appointment.id}
								deleteAppointment={deleteAppointment}
							/>
						))
					)}
				</DayArea>
				<DayArea>
					<DayName marked={day === "friday"}>Sexta</DayName>
					{!schedule.friday.length ? (
						<NoAppointment />
					) : (
						schedule.friday.map((appointment) => (
							<Appointment
								appointment={appointment}
								key={appointment.id}
								deleteAppointment={deleteAppointment}
							/>
						))
					)}
				</DayArea>
				<DayArea>
					<DayName marked={day === "saturday"}>Sábado</DayName>
					{!schedule.saturday.length ? (
						<NoAppointment />
					) : (
						schedule.saturday.map((appointment) => (
							<Appointment
								appointment={appointment}
								key={appointment.id}
								deleteAppointment={deleteAppointment}
							/>
						))
					)}
				</DayArea>
				<DayArea>
					<DayName marked={day === "sunday"}>Domingo</DayName>
					{!schedule.sunday.length ? (
						<NoAppointment />
					) : (
						schedule.sunday.map((appointment) => (
							<Appointment
								appointment={appointment}
								key={appointment.id}
								deleteAppointment={deleteAppointment}
							/>
						))
					)}
				</DayArea>
			</ScheduleArea>
		</Fullpage>
	);
}

export default withSnackbar(Dashboard);
