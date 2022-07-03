import '@mui/material/styles';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

const TypographyFontMonospace = styled(Typography)(({ theme }) => ({
  fontFamily: theme.typography.fontFamilies.monospace,
})) as typeof Typography;

export default TypographyFontMonospace;
