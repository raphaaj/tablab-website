import Typography, { TypographyProps } from '@mui/material/Typography';
import { FC } from 'react';

export type TypographyTablatureTitleProps = TypographyProps;

const TypographyTablatureTitle: FC<TypographyTablatureTitleProps> = (props) => {
  return <Typography variant="h4" color="primary" gutterBottom {...props} />;
};

export default TypographyTablatureTitle;
