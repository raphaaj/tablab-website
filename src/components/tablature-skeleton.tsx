import TablatureBlockSkeleton from '@components/tablature-block-skeleton';
import TypographyTablatureObservations from '@components/typography-tablature-observations';
import TypographyTablatureTitle from '@components/typography-tablature-title';
import Skeleton from '@mui/material/Skeleton';
import { useTranslation } from 'next-i18next';
import { FC } from 'react';

export type TablatureSkeletonProps = {
  hasObservations?: boolean;
  hasTitle?: boolean;
  numberOfBlocks: number;
  numberOfRowsPerBlock: number;
};

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
        <TypographyTablatureTitle>
          <Skeleton animation="wave" />
        </TypographyTablatureTitle>
      )}

      {!!props.hasObservations && (
        <TypographyTablatureObservations>
          <Skeleton animation="wave" />
        </TypographyTablatureObservations>
      )}

      {tablatureSkeletonBlocks}
    </>
  );
};

export default TablatureSkeleton;
