export interface Theme {
	borderRadius: string;
	colors: {
		primary: string;
		background: string;
		backgroundLight: string;
		backgroundLighter: string;
		font: string;
		fontDark: string;
		fontDarker: string;
	};
}

export const theme: Theme = {
	borderRadius: "2px",
	colors: {
		primary: "#8826af",
		background: "#0c070e",
		backgroundLight: "#1a101f",
		backgroundLighter: "#33203d",
		font: "#f0f0f0",
		fontDark: "#e7e7e7",
		fontDarker: "#e0e0e0",
	},
};
