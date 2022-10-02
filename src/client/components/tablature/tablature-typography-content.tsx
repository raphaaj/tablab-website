import TypographyFontMonospace from '@client/components/ui/typography-font-monospace';
import { TypographyProps } from '@mui/material/Typography';
import { FC } from 'react';

export type TablatureTypographyContentProps = TypographyProps<'pre'>;

const TablatureTypographyContent: FC<TablatureTypographyContentProps> = (props) => {
  return (
    <TypographyFontMonospace variant="body1" component="pre" {...props}>
      {props.children}
    </TypographyFontMonospace>
  );
};

export default TablatureTypographyContent;
