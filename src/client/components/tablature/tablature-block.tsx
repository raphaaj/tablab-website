import TablatureBlockContainer, {
  TablatureBlockAlignmentOption,
} from '@client/components/tablature/tablature-block-container';
import TablatureBlockRowContainer from '@client/components/tablature/tablature-block-row-container';
import TablatureTypographyContent from '@client/components/tablature/tablature-typography-content';
import { FC } from 'react';

export interface TablatureBlockProps {
  align?: TablatureBlockAlignmentOption;
  block: string[];
  borderless?: boolean;
  disableGutters?: boolean;
  discardFooter?: boolean;
  discardHeader?: boolean;
  fullWidth?: boolean;
  label: string;
}

const TablatureBlock: FC<TablatureBlockProps> = (props) => {
  const tabBlockRowPrefixLength = Math.trunc(1 + (props.block.length - 2) / 10) + 2;

  const disableGutters = props.disableGutters ?? false;
  const discardHeader = props.discardHeader ?? false;
  const discardFooter = props.discardFooter ?? false;

  return (
    <TablatureBlockContainer
      align={props.align}
      disableGutters={disableGutters}
      fullWidth={props.fullWidth}
      label={props.label}
    >
      {props.block.map((blockRow, blockRowIndex) => {
        if (blockRowIndex === 0 && discardHeader) return null;
        if (blockRowIndex + 1 === props.block.length && discardFooter) return null;

        return (
          <TablatureBlockRowContainer
            key={blockRowIndex}
            isLastRow={blockRowIndex === props.block.length - 1}
            borderless={props.borderless}
          >
            <TablatureTypographyContent sx={{ textAlign: 'center' }}>
              {blockRowIndex === 0 || blockRowIndex === props.block.length - 1
                ? ''.padStart(tabBlockRowPrefixLength, ' ')
                : `${blockRowIndex}) `.padStart(tabBlockRowPrefixLength, ' ')}
              {blockRow}
            </TablatureTypographyContent>
          </TablatureBlockRowContainer>
        );
      })}
    </TablatureBlockContainer>
  );
};

export default TablatureBlock;
