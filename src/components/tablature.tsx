import TablatureBlock from '@components/tablature-block';
import TypographyTablatureObservations from '@components/typography-tablature-observations';
import TypographyTablatureTitle from '@components/typography-tablature-title';
import { useTranslation } from 'next-i18next';
import { FC } from 'react';

export type TablatureProps = {
  blocks: string[][];
  observations?: string | null;
  title?: string | null;
};

const Tablature: FC<TablatureProps> = (props) => {
  const { t } = useTranslation('tablature');

  return (
    <>
      {!!props.title && <TypographyTablatureTitle>{props.title}</TypographyTablatureTitle>}

      {!!props.observations && (
        <TypographyTablatureObservations>{props.observations}</TypographyTablatureObservations>
      )}

      {props.blocks.map((block, blockIndex) => (
        <TablatureBlock
          key={blockIndex}
          block={block}
          label={t('block-label', { blockNumber: blockIndex + 1 })}
        />
      ))}
    </>
  );
};

export default Tablature;
