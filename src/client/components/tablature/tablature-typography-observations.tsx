import Typography, { TypographyProps } from '@mui/material/Typography';
import { FC } from 'react';

export type TablatureTypographyObservationsProps = TypographyProps<'p'>;

const TablatureTypographyObservations: FC<TablatureTypographyObservationsProps> = (props) => {
  return <Typography variant="subtitle1" component="p" gutterBottom {...props} />;
};

export default TablatureTypographyObservations;
