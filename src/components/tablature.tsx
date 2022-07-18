import TablatureBlock from '@components/tablature-block';
import Typography from '@mui/material/Typography';
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
      {!!props.title && (
        <Typography variant="h4" color="primary" gutterBottom>
          {props.title}
        </Typography>
      )}

      {!!props.observations && (
        <Typography variant="subtitle1" component="p" gutterBottom>
          {props.observations}
        </Typography>
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
