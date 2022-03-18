import { ServerSideTranslationUtils } from '@utils/server-side-translation-utils';
import {
  CommonErrorsFactory,
  CommonErrorsFactoryData,
} from '@view-models/error/common-errors-factory';
import { TabRenderizationError } from '@view-models/tab/tab-renderization-error';
import { FailedWriteResult } from 'tablab';

export type TabErrorsFactoryData = CommonErrorsFactoryData;

export class TabErrorsFactory extends CommonErrorsFactory {
  public constructor(errorsFactoryData: TabErrorsFactoryData) {
    super(errorsFactoryData);
  }

  public async getTabRenderizationError(
    failedWriteResults: FailedWriteResult[]
  ): Promise<TabRenderizationError> {
    const t = await ServerSideTranslationUtils.getServerSideTranslation(this.locale, ['errors']);

    return new TabRenderizationError({
      failedWriteResults,
      locale: this.locale,
      message: t(`errors:code2message.${TabRenderizationError.ERROR_CODE}`),
      request: this.request,
    });
  }
}
