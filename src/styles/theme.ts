export interface Theme {
	borderRadius: string;
	colors: {
		primary: {
			mOne: string;
			mTwo: string;
			mThree: string;
			mFour: string;
			main: string;
			pOne: string;
			pTwo: string;
			pThree: string;
			pFour: string;
		};
		secondary: {
			mOne: string;
			mTwo: string;
			main: string;
			pOne: string;
			pTwo: string;
			pThree: string;
			pFour: string;
			pFive: string;
			pSix: string;
		};
		font: {
			mOne: string;
			mTwo: string;
			mThree: string;
			mFour: string;
			main: string;
		};
		alt: {
			green: string;
			yellow: string;
			red: string;
		};
	};
}

export const theme: Theme = {
	borderRadius: "2px",
	colors: {
		primary: {
			mOne: "#4D3BB5",
			mTwo: "#3D2E8E",
			mThree: "#2C2268",
			mFour: "#1C1541",
			main: "#6958C9",
			pOne: "#8D80D6",
			pTwo: "#AFA7E2",
			pThree: "#D2CDEF",
			pFour: "#F5F3FB",
		},
		secondary: {
			mOne: "#26253C",
			mTwo: "#12121C",
			main: "#39375B",
			pOne: "#4E4B7C",
			pTwo: "#625E9C",
			pThree: "#807DB0",
			pFour: "#9F9DC3",
			pFive: "#BEBCD7",
			pSix: "#DDDCEA",
		},
		font: {
			mOne: "#E5E5E5",
			mTwo: "#DBDBDB",
			mThree: "#D1D1D1",
			mFour: "#C7C7C7",
			main: "#F0F0F0",
		},
		alt: {
			green: "#7FD561",
			yellow: "#E3E643",
			red: "#D56A61",
		},
	},
};
