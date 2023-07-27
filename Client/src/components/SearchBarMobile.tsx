import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import { alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
// externally crafted imports of ressources
import SearchInfo from './Search';
import { ISearchProps } from '../Interface/GlobalState';

interface ISearchBarMobileProps {}

const SearchBarMobile: React.FC<ISearchBarMobileProps> = (props) => {
  const [anchorElSearch, setAnchorElSearch] = React.useState<any | null>(null);

  const handleFocus = (event: any) => {
    setAnchorElSearch(event.currentTarget);
  };

  const SearchData: ISearchProps = {
    anchorElSearch,
    setAnchorElSearch,
    search: '',
  };

  return (
    <>
      <IconButton
        sx={{
          bgcolor: (theme) => alpha(theme.palette.common.white, 0.12),
        }}
        onClick={handleFocus}
      >
        <SearchIcon sx={{ color: '#fafafa' }} />
      </IconButton>
      <SearchInfo {...SearchData} />
    </>
  );
};

export default SearchBarMobile;
