import styled from "styled-components";

export interface IButton {
	type: "primary" | "secondary";
	icon?: JSX.Element;
	text: string;
	fullWidth?: boolean;
	onClick?: () => void;
}

const ButtonArea = styled.button<{ primary: boolean; fullWidth: boolean }>`
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	width: ${({ fullWidth }) => (fullWidth ? "100%" : "200px")};
	height: 50px;
	background-color: ${({ theme, primary }) =>
		primary ? theme.colors.primary.main : theme.colors.secondary.main};
	border: ${({ theme, primary }) =>
		primary ? "none" : `1px solid ${theme.colors.primary.pOne}`};
	border-radius: ${({ theme }) => theme.borderRadius};
	padding: 1rem;
	cursor: pointer;
	user-select: none;
	transition: 0.2s;
	text-decoration: none;

	&:hover {
		filter: brightness(115%);
	}

	&:active {
		filter: brightness(120%);
	}
`;

const ButtonText = styled.span<{ hasIcon: boolean }>`
	font-weight: 600;
	font-size: 1.2rem;
	color: ${({ theme }) => theme.colors.font.main};
	text-decoration: none;
	margin-left: ${({ hasIcon }) => (hasIcon ? "0.6rem" : "0")};
`;

export default function Button({
	type,
	icon,
	text,
	fullWidth,
	onClick,
}: IButton) {
	return (
		<ButtonArea
			primary={type === "primary"}
			fullWidth={fullWidth}
			onClick={onClick}
		>
			{icon && icon}
			<ButtonText hasIcon={icon ? true : false}>{text}</ButtonText>
		</ButtonArea>
	);
}
