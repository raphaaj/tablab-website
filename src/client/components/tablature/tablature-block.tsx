import TablatureBlockContainer, {
  TablatureBlockAlignmentOption,
} from '@client/components/tablature/tablature-block-container';
import TablatureBlockRowContainer from '@client/components/tablature/tablature-block-row-container';
import TablatureTypographyContent from '@client/components/tablature/tablature-typography-content';
import { container } from '@client/container';
import {
  ITablatureRowLabelService,
  ITablatureRowLabelServiceInjectionToken,
} from '@common/services/tablature-row-label-service/interfaces/tablature-row-label-service.interface';
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
  const disableGutters = props.disableGutters ?? false;
  const discardHeader = props.discardHeader ?? false;
  const discardFooter = props.discardFooter ?? false;

  const tablatureRowLabelService = container.resolve<ITablatureRowLabelService>(
    ITablatureRowLabelServiceInjectionToken
  );
  const blockWithLabels = tablatureRowLabelService.addLabelToTablatureBlockRows(props.block);

  return (
    <TablatureBlockContainer
      align={props.align}
      disableGutters={disableGutters}
      fullWidth={props.fullWidth}
      label={props.label}
    >
      {blockWithLabels.map((blockRowWithLabel, blockRowWithLabelIndex) => {
        if (blockRowWithLabelIndex === 0 && discardHeader) return null;
        if (blockRowWithLabelIndex + 1 === blockWithLabels.length && discardFooter) return null;

        return (
          <TablatureBlockRowContainer
            key={blockRowWithLabelIndex}
            isLastRow={blockRowWithLabelIndex === blockWithLabels.length - 1}
            borderless={props.borderless}
          >
            <TablatureTypographyContent sx={{ textAlign: 'center' }}>
              {blockRowWithLabel}
            </TablatureTypographyContent>
          </TablatureBlockRowContainer>
        );
      })}
    </TablatureBlockContainer>
  );
};

export default TablatureBlock;
