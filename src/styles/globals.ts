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
		background-color: ${({ theme }) => theme.colors.background};

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
	}
	h1, h2, h3, h4, h5, h6, p, a, span { margin: 0; }
	button { font-family: 'Poppins', sans-serif }
    button:focus-visible { outline: #33203d solid 3px; }
`;

export { Globals };
