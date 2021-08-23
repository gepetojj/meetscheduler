import { styled as MUIStyled } from "@material-ui/core/styles";
import { StandardTextFieldProps, TextField } from "@material-ui/core";

import { theme } from "../styles/theme";

const StyledInput = MUIStyled(TextField)({
	margin: "0.7rem 0",
	"& label": {
		fontFamily: "'Poppins', sans-serif",
		color: theme.colors.font.main,
		paddingLeft: "0.3rem",
		userSelect: "none",
	},
	"& input": {
		fontFamily: "'Poppins', sans-serif",
		color: theme.colors.font.main,
	},
	"& .MuiInputLabel-root": {
		"&.Mui-focused": {
			color: theme.colors.font.mOne,
		},
	},
	"& .MuiInput-root:before": {
		borderBottom: `1px solid ${theme.colors.font.mOne}`,
	},
	"& .MuiInput-root:after": {
		borderBottom: `1px solid ${theme.colors.font.mTwo}`,
	},
	"& .MuiInput-root:hover:not(.Mui-disabled):before": {
		borderBottom: `1px solid ${theme.colors.font.mThree}`,
		filter: "brightness(130%)",
	},
	"& .MuiFormLabel-root.Mui-disabled": {
		color: theme.colors.font.mTwo,
	},
	"& .MuiFormHelperText-root": {
		color: theme.colors.font.mTwo,
		marginTop: "0.3rem",
		paddingLeft: "0.3rem",
	},
});

export default function Input(options: StandardTextFieldProps) {
	return <StyledInput {...options} />;
}
