import { TablatureInstructionRenderizationErrorDTO } from '@server/services/tablature/dtos/tablature-instruction-renderization-error-dto';
import { ServerSideTranslationUtils } from '@server/utils/translation-utils';
import {
  CommonErrorsFactory,
  CommonErrorsFactoryData,
} from '@server/view-models/error/common-errors-factory';
import { TablatureInstructionRenderizationErrorDetails } from '@server/view-models/tablature/tablature-instruction-renderization-error-details';
import { TablatureRenderizationError } from '@server/view-models/tablature/tablature-renderization-error';

export type TablatureErrorsFactoryData = CommonErrorsFactoryData;

export class TablatureErrorsFactory extends CommonErrorsFactory {
  public constructor(errorsFactoryData: TablatureErrorsFactoryData) {
    super(errorsFactoryData);
  }

  public async getTablatureRenderizationError(
    tablatureInstructionsRenderizationErrors: TablatureInstructionRenderizationErrorDTO[]
  ): Promise<TablatureRenderizationError> {
    const t = await ServerSideTranslationUtils.getServerSideTranslation(this.locale, ['errors']);

    const instructionsRenderizationErrors =
      TablatureInstructionRenderizationErrorDetails.createFromTablatureInstructionRenderizationErrors(
        tablatureInstructionsRenderizationErrors
      );

    return new TablatureRenderizationError({
      instructionsRenderizationErrors,
      message: t(`errors:code2message.${TablatureRenderizationError.ERROR_CODE}`),
      request: this.request,
    });
  }
}
