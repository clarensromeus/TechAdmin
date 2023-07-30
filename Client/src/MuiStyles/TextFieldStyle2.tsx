import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import TextField from '@mui/material/TextField';
import grey from '@mui/material/colors/grey';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  left: '1%',
  borderRadius: '30px',
  backgroundColor: alpha(theme.palette.common.white, 0.11),
  marginLeft: 0,
  width: '16%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: '16%',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '20%',
    [theme.breakpoints.up('sm')]: {
      // width: '12ch',
      width: '100px',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

const TextFieldStyle = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    '&:hover fieldset': {
      borderColor: grey[400],
      borderWidth: '1px',
    },
    '&.Mui-focused fieldset': {
      borderColor: grey[400],
      borderWidth: '1px',
    },
  },
});

const TextFieldTable = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: grey[100],
      borderRadius: 0,
    },
    '&:hover fieldset': {
      borderColor: grey[100],
      borderWidth: '1px',
    },
    '&.Mui-focused fieldset': {
      borderColor: grey[100],
      borderWidth: '1px',
    },
  },
});

export {
  Search,
  SearchIconWrapper,
  StyledInputBase,
  TextFieldStyle,
  TextFieldTable,
};
