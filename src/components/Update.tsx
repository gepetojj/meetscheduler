import { FC } from "react";
import Modal from "reactjs-popup";
import styled from "styled-components";

export interface IUpdate {
	isVisible: boolean;
	data: any;
}

const UpdateModal = styled(Modal)`
	&-overlay {
		background-color: #00000060;
	}

	&-content {
		background-color: ${({ theme }) => theme.colors.secondary.pOne};
		width: 30rem;
		height: fit-content;
		padding: 1rem;
		border-radius: ${({ theme }) => theme.borderRadius};
		user-select: none;
	}
`;

const UpdateInfo = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`;

const UpdateTitle = styled.h1`
	font-size: 1.4rem;
	color: ${({ theme }) => theme.colors.font.main};
`;

const UpdateSubTitle = styled.p`
	font-size: 0.8rem;
	color: ${({ theme }) => theme.colors.font.mOne};
	margin-top: 0.6rem;
`;

const UpdateProgress = styled.div<{ progress: number }>`
	width: ${({ progress }) => `${progress}%`};
	height: 0.7rem;
	border-radius: ${({ theme }) => theme.borderRadius};
	background-color: ${({ theme }) => theme.colors.alt.green};
	transition: 0.2s;
`;

const UpdateProgressHelper = styled.div`
	width: 100%;
	height: 0.7rem;
	margin-top: 1.2rem;
	margin-bottom: 0.3rem;
	border-radius: ${({ theme }) => theme.borderRadius};
	background-color: ${({ theme }) => theme.colors.secondary.mTwo};
	transition: 0.2s;
`;

const UpdateData = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
	align-items: center;
	width: 100%;
	height: fit-content;
	margin-top: 0.5rem;
`;

const UpdateDesc = styled.p`
	font-size: 0.7rem;
	color: ${({ theme }) => theme.colors.font.mTwo};
`;

export const Update: FC<IUpdate> = ({ isVisible, data }) => {
	return (
		<UpdateModal
			open={isVisible}
			position="center center"
			closeOnDocumentClick={false}
			closeOnEscape={false}
			modal
		>
			<UpdateInfo>
				<UpdateTitle>Uma atualização está sendo instalada.</UpdateTitle>
				<UpdateSubTitle>
					Quando o download finalizar, o app será reiniciado e a
					atualização será aplicada.
				</UpdateSubTitle>
				{data && data.progress ? (
					<UpdateProgressHelper>
						<UpdateProgress
							progress={data.progress}
						></UpdateProgress>
					</UpdateProgressHelper>
				) : null}
				{data && data.transferred && data.total ? (
					<UpdateData>
						<UpdateDesc>{data.transferred}</UpdateDesc>
						<UpdateDesc>/{data.total}</UpdateDesc>
					</UpdateData>
				) : null}
			</UpdateInfo>
		</UpdateModal>
	);
};
