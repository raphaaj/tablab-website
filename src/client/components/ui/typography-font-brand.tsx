import '@mui/material/styles';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

const TypographyFontBrand = styled(Typography)(({ theme }) => ({
  fontFamily: theme.fontFamilies.brand,
}));

export default TypographyFontBrand;
