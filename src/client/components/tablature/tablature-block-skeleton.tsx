import TablatureBlockContainer from '@client/components/tablature/tablature-block-container';
import TablatureBlockRowContainer from '@client/components/tablature/tablature-block-row-container';
import TablatureTypographyContent from '@client/components/tablature/tablature-typography-content';
import Skeleton from '@mui/material/Skeleton';
import { FC } from 'react';

export interface TablatureBlockSkeletonProps {
  label: string;
  numberOfRows: number;
}

const TablatureBlockSkeleton: FC<TablatureBlockSkeletonProps> = (props) => {
  const tablatureBlockSkeletons = [];

  for (let i = 0; i < props.numberOfRows; i++) {
    tablatureBlockSkeletons.push(
      <TablatureBlockRowContainer key={i} isLastRow={i === props.numberOfRows - 1}>
        <TablatureTypographyContent>
          <Skeleton animation="wave" />
        </TablatureTypographyContent>
      </TablatureBlockRowContainer>
    );
  }

  return (
    <TablatureBlockContainer label={props.label}>{tablatureBlockSkeletons}</TablatureBlockContainer>
  );
};

export default TablatureBlockSkeleton;
