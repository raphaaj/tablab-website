import TypographyFontMonospace from '@components/typography-font-monospace';
import { TypographyProps } from '@mui/material/Typography';
import { FC } from 'react';

export type TypographyTablatureContentProps = TypographyProps<'pre'>;

const TypographyTablatureContent: FC<TypographyTablatureContentProps> = (props) => {
  return (
    <TypographyFontMonospace variant="body1" component="pre" {...props}>
      {props.children}
    </TypographyFontMonospace>
  );
};

export default TypographyTablatureContent;
