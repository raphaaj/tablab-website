import TablatureBlockContainer from '@components/tablature-block-container';
import TablatureBlockRowContainer from '@components/tablature-block-row-container';
import TypographyTablatureContent from '@components/typography-tablature-content';
import Skeleton from '@mui/material/Skeleton';
import { FC } from 'react';

export type TablatureBlockSkeletonProps = {
  label: string;
  numberOfRows: number;
};

const TablatureBlockSkeleton: FC<TablatureBlockSkeletonProps> = (props) => {
  const tablatureBlockSkeletons = [];

  for (let i = 0; i < props.numberOfRows; i++) {
    tablatureBlockSkeletons.push(
      <TablatureBlockRowContainer key={i} isLastRow={i === props.numberOfRows - 1}>
        <TypographyTablatureContent>
          <Skeleton animation="wave" />
        </TypographyTablatureContent>
      </TablatureBlockRowContainer>
    );
  }

  return (
    <TablatureBlockContainer label={props.label}>{tablatureBlockSkeletons}</TablatureBlockContainer>
  );
};

export default TablatureBlockSkeleton;
