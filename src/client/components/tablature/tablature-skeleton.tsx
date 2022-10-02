import TablatureBlockSkeleton from '@client/components/tablature/tablature-block-skeleton';
import TablatureTypographyObservations from '@client/components/tablature/tablature-typography-observations';
import TablatureTypographyTitle from '@client/components/tablature/tablature-typography-title';
import Skeleton from '@mui/material/Skeleton';
import { useTranslation } from 'next-i18next';
import { FC } from 'react';

export interface TablatureSkeletonProps {
  hasObservations?: boolean;
  hasTitle?: boolean;
  numberOfBlocks: number;
  numberOfRowsPerBlock: number;
}

const TablatureSkeleton: FC<TablatureSkeletonProps> = (props) => {
  const { t } = useTranslation('tablature');

  const tablatureSkeletonBlocks: JSX.Element[] = [];

  for (let i = 0; i < props.numberOfBlocks; i++) {
    tablatureSkeletonBlocks.push(
      <TablatureBlockSkeleton
        key={i}
        label={t('block-label', { blockNumber: i + 1 })}
        numberOfRows={props.numberOfRowsPerBlock}
      />
    );
  }

  return (
    <>
      {props.hasTitle && (
        <TablatureTypographyTitle>
          <Skeleton animation="wave" />
        </TablatureTypographyTitle>
      )}

      {!!props.hasObservations && (
        <TablatureTypographyObservations>
          <Skeleton animation="wave" />
        </TablatureTypographyObservations>
      )}

      {tablatureSkeletonBlocks}
    </>
  );
};

export default TablatureSkeleton;
