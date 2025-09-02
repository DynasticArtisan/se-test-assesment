import React, { useEffect, useState } from 'react';
import {
  TextField,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Search, Clear as ClearIcon } from '@mui/icons-material';

interface SearchInputProps {
  initialValue?: string;
  debounce?: number;
  onSubmit: (search: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  initialValue = '',
  debounce = 300,
  onSubmit,
}) => {
  const [searchValue, setSearchValue] = useState(initialValue);

  useEffect(() => {
    const submit = setTimeout(() => onSubmit(searchValue), debounce);
    return () => clearTimeout(submit);
  }, [searchValue]);

  const handleClear = () => {
    setSearchValue('');
    onSubmit('');
  };

  return (
    <TextField size="small" style={{ width: 200 }}
      value={searchValue}
      onChange={(e) => setSearchValue(e.target.value)}
      placeholder="Search..."
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search 
              fontSize="small" 
              sx={{ color: 'text.secondary' }} 
            />
          </InputAdornment>
        ),
        endAdornment: searchValue && (
          <InputAdornment position="end">
            <IconButton
              size="small"
              onClick={handleClear}
              edge="end"
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          </InputAdornment>
        )
      }}
    />
  );
};

export default SearchInput;