import TablatureBlock from '@client/components/tablature/tablature-block';
import TablatureTypographyObservations from '@client/components/tablature/tablature-typography-observations';
import TablatureTypographyTitle from '@client/components/tablature/tablature-typography-title';
import { useTranslation } from 'next-i18next';
import { FC } from 'react';

export interface TablatureProps {
  blocks: string[][];
  observations?: string | null;
  title?: string | null;
}

const Tablature: FC<TablatureProps> = (props) => {
  const { t } = useTranslation('tablature');

  return (
    <>
      {!!props.title && <TablatureTypographyTitle>{props.title}</TablatureTypographyTitle>}

      {!!props.observations && (
        <TablatureTypographyObservations>{props.observations}</TablatureTypographyObservations>
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
