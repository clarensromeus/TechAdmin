import * as React from "react";
import SearchIcon from "@mui/icons-material/Search";
import __ from "lodash";
// exteral imports of ressources
import * as MuiStyles from "../MuiStyles/TextFieldStyle2";
import { ISearchProps } from "../Interface/GlobalState";
import SearchInfo from "./Search";

interface ISearchBarProps {}

const SearchBar: React.FC<ISearchBarProps> = () => {
  const [search, setSearch] = React.useState<string>("");

  const [anchorElSearch, setAnchorElSearch] = React.useState<any | null>(null);

  const handleFocus = (event: any) => {
    setAnchorElSearch(event.currentTarget);
  };

  const SearchData: ISearchProps = {
    anchorElSearch,
    setAnchorElSearch,
    search,
  };

  const handleChangeEvent = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target as typeof event.target & {
      value: { values: string };
    };
    setSearch(target.value);
  };

  const debounceResult = React.useMemo(() => {
    return __.debounce(handleChangeEvent, 1000);
  }, [search]);

  const { Search, SearchIconWrapper, StyledInputBase } = MuiStyles;

  React.useEffect(() => {
    return () => {
      // cleanup debounce for re-rendering prevention
      debounceResult.cancel();
    };
  }, []);
  return (
    <>
      <Search>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          placeholder="Search…"
          inputProps={{ "aria-label": "search" }}
          onChange={debounceResult}
          onClick={handleFocus}
        />
      </Search>
      <SearchInfo {...SearchData} />
    </>
  );
};

export default SearchBar;
