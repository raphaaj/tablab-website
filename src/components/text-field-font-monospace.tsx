import { Theme } from '@mui/material/styles';
import TextField, { TextFieldProps } from '@mui/material/TextField';

export default function TextFieldFontMonospace({
  children,
  inputProps,
  ...otherProps
}: TextFieldProps) {
  return (
    <TextField
      {...otherProps}
      inputProps={{
        ...inputProps,
        sx: {
          ...inputProps?.sx,
          fontFamily: (theme: Theme) => theme.typography.fontFamilies.monospace,
        },
      }}
    >
      {children}
    </TextField>
  );
}
