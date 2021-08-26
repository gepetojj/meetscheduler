import { createGlobalStyle } from "styled-components";

const Globals = createGlobalStyle`
	* { box-sizing: border-box; }
	body, #app {
		display: flex;
		flex-direction: column;
		width: 100vw;
		height: 100vh;
		margin: 0;
		font-family: 'Poppins', sans-serif;
		text-rendering: optimizeLegibility;
		background-color: ${({ theme }) => theme.colors.secondary.main};

		&::-webkit-scrollbar {
			width: 7px;
			height: 8px;
		}
		&::-webkit-scrollbar-track {
			background-color: ${({ theme }) => theme.colors.secondary.mOne};
			border-radius: 10px;
		}
		&::-webkit-scrollbar-thumb {
			background-color: ${({ theme }) => theme.colors.secondary.pTwo};
			border-radius: 10px;
		}
	}
	h1, h2, h3, h4, h5, h6, p, a, span { margin: 0; }
	button { font-family: 'Poppins', sans-serif }
    button:focus-visible, div:focus-visible { outline: ${({ theme }) =>
		theme.colors.secondary.mOne} solid 3px; }
	.MuiPaper-root {
		background-color: ${({ theme }) => theme.colors.secondary.mOne} !important;
		color: ${({ theme }) => theme.colors.font.mTwo} !important;
	}
`;

export { Globals };
