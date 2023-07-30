import { createTheme } from "@mui/material/styles";
import { TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import grey from "@mui/material/colors/grey";

const bgColor_val: string = "#fafafa";

const ThemeStyled = createTheme({
  components: {
    MuiFilledInput: {
      defaultProps: {
        fullWidth: true,
        disableUnderline: true,
      },
      styleOverrides: {
        root: {
          backgroundColor: bgColor_val,
        },
      },
    },
  },
});

const CssTextField = styled(TextField)({
  "& label.Mui-focused": {
    color: grey.A200,
    borderWidth: "1px",
  },
  "& .MuiOutlinedInput-root": {
    borderRadius: 50,
    "&.Mui-focused fieldset": {
      borderColor: grey.A200,
      borderWidth: "1px",
      borderRadius: 50,
    },
  },
});

const ChatTextField = styled(TextField)({
  "& label.Mui-focused": {
    color: grey.A400,
    borderWidth: "1px",
  },
  "& .MuiOutlinedInput-root": {
    borderRadius: 60,
    backgroundColor: "#E8F0FE",
    "&:hover fieldset": {
      borderColor: grey.A400,
    },
    "&.Mui-focused fieldset": {
      borderColor: grey.A400,
      borderWidth: "1px",
      borderRadius: 60,
    },
  },
});

const CommentTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    borderColor: grey[100],
    borderRadius: 100,
    "&.Mui-focused fieldset": {
      borderColor: grey[200],
      borderWidth: "1px",
      borderRadius: 100,
    },
  },
});

const SugestionTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    "&.Mui-focused fieldset": {
      borderColor: grey[200],
      borderWidth: "1px",
    },
  },
});

const SearchTextField = styled(TextField)({
  borderColor: grey[100],
  "& .MuiOutlinedInput-root": {
    borderColor: "red",
    borderWidth: "1px",
    "&:hover fieldset": {
      borderColor: grey[200],
    },
    "&.Mui-focused fieldset": {
      borderColor: grey[200],
      borderWidth: "1px",
    },
  },
});

const PostTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    borderRadius: 50,
    border: "none",
    "&.Mui-focused fieldset": {
      border: "none",
    },
  },
});

export {
  ThemeStyled,
  CssTextField,
  ChatTextField,
  CommentTextField,
  SugestionTextField,
  SearchTextField,
  PostTextField,
};

// for being customized input fields i am using Mui Theme and all properties which
// better fit my needs, in turn this is an advanced technique you can use to
// customize your input fields on your own by using fields-related properties
// for your applications
