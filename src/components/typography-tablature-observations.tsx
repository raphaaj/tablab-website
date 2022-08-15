import Typography, { TypographyProps } from '@mui/material/Typography';
import { FC } from 'react';

export type TypographyTablatureObservationsProps = TypographyProps<'p'>;

const TypographyTablatureObservations: FC<TypographyTablatureObservationsProps> = (props) => {
  return <Typography variant="subtitle1" component="p" gutterBottom {...props} />;
};

export default TypographyTablatureObservations;
