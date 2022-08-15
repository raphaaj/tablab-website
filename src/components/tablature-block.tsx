import TablatureBlockContainer from '@components/tablature-block-container';
import TablatureBlockRowContainer from '@components/tablature-block-row-container';
import TypographyTablatureContent from '@components/typography-tablature-content';
import { FC } from 'react';

export type TablatureBlockProps = {
  block: string[];
  label: string;
};

const TablatureBlock: FC<TablatureBlockProps> = (props) => {
  const tabBlockRowPrefixLength = Math.trunc(1 + (props.block.length - 2) / 10) + 2;

  return (
    <TablatureBlockContainer label={props.label}>
      {props.block.map((blockRow, blockRowIndex) => (
        <TablatureBlockRowContainer
          key={blockRowIndex}
          isLastRow={blockRowIndex === props.block.length - 1}
        >
          <TypographyTablatureContent>
            {blockRowIndex === 0 || blockRowIndex === props.block.length - 1
              ? ''.padStart(tabBlockRowPrefixLength, ' ')
              : `${blockRowIndex}) `.padStart(tabBlockRowPrefixLength, ' ')}
            {blockRow}
          </TypographyTablatureContent>
        </TablatureBlockRowContainer>
      ))}
    </TablatureBlockContainer>
  );
};

export default TablatureBlock;
