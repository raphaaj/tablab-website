import TablatureBlockContainer from '@client/components/tablature/tablature-block-container';
import TablatureBlockRowContainer from '@client/components/tablature/tablature-block-row-container';
import TablatureTypographyContent from '@client/components/tablature/tablature-typography-content';
import { FC } from 'react';

export interface TablatureBlockProps {
  block: string[];
  label: string;
}

const TablatureBlock: FC<TablatureBlockProps> = (props) => {
  const tabBlockRowPrefixLength = Math.trunc(1 + (props.block.length - 2) / 10) + 2;

  return (
    <TablatureBlockContainer label={props.label}>
      {props.block.map((blockRow, blockRowIndex) => (
        <TablatureBlockRowContainer
          key={blockRowIndex}
          isLastRow={blockRowIndex === props.block.length - 1}
        >
          <TablatureTypographyContent sx={{ textAlign: 'center' }}>
            {blockRowIndex === 0 || blockRowIndex === props.block.length - 1
              ? ''.padStart(tabBlockRowPrefixLength, ' ')
              : `${blockRowIndex}) `.padStart(tabBlockRowPrefixLength, ' ')}
            {blockRow}
          </TablatureTypographyContent>
        </TablatureBlockRowContainer>
      ))}
    </TablatureBlockContainer>
  );
};

export default TablatureBlock;
