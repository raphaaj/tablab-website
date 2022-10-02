import Typography, { TypographyProps } from '@mui/material/Typography';
import { FC } from 'react';

export type TablatureTypographyTitleProps = TypographyProps;

const TablatureTypographyTitle: FC<TablatureTypographyTitleProps> = (props) => {
  return <Typography variant="h4" color="primary" gutterBottom {...props} />;
};

export default TablatureTypographyTitle;
