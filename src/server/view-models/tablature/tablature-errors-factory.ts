import { ServerSideTranslationUtils } from '@server/utils/translation-utils';
import {
  CommonErrorsFactory,
  CommonErrorsFactoryData,
} from '@server/view-models/error/common-errors-factory';
import { TablatureRenderizationError } from '@server/view-models/tablature/tablature-renderization-error';
import { FailedWriteResult } from 'tablab';

export type TablatureErrorsFactoryData = CommonErrorsFactoryData;

export class TablatureErrorsFactory extends CommonErrorsFactory {
  public constructor(errorsFactoryData: TablatureErrorsFactoryData) {
    super(errorsFactoryData);
  }

  public async getTablatureRenderizationError(
    failedWriteResults: FailedWriteResult[]
  ): Promise<TablatureRenderizationError> {
    const t = await ServerSideTranslationUtils.getServerSideTranslation(this.locale, ['errors']);

    return new TablatureRenderizationError({
      failedWriteResults,
      locale: this.locale,
      message: t(`errors:code2message.${TablatureRenderizationError.ERROR_CODE}`),
      request: this.request,
    });
  }
}
