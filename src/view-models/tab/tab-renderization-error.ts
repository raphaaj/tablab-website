import { ErrorCode } from '@enums/error-code';
import { BaseError, CommonErrorData } from '@view-models/error/base-error';
import { TabInstructionRenderizationError } from '@view-models/tab/tab-instruction-renderization-error';
import { FailedWriteResult } from 'tablab';
import { localizeEnUs, localizePtBr, Localizer } from 'tablab-i18n';

export class TabRenderizationErrorDetails {
  public renderizationErrors: TabInstructionRenderizationError[];

  public constructor(errorDetailsData: TabRenderizationErrorDetails) {
    this.renderizationErrors = errorDetailsData.renderizationErrors;
  }
}

export type TabRenderizationErrorData = CommonErrorData & {
  failedWriteResults: FailedWriteResult[];
  locale: string;
};

export class TabRenderizationError extends BaseError<TabRenderizationErrorDetails> {
  public static readonly ERROR_CODE = ErrorCode.Tab_RenderizationError;

  private static readonly DEFAULT_TABLAB_LOCALIZE = localizeEnUs;

  private static readonly LOCALE_TO_TABLAB_LOCALIZE_MAP: Map<string, Localizer> = new Map([
    ['en-US', localizeEnUs],
    ['pt-BR', localizePtBr],
  ]);

  public details: TabRenderizationErrorDetails | null;

  public constructor({ failedWriteResults, locale, message, request }: TabRenderizationErrorData) {
    super({ message, request, errorCode: TabRenderizationError.ERROR_CODE });

    let tablabLocalize = TabRenderizationError.LOCALE_TO_TABLAB_LOCALIZE_MAP.get(locale);
    if (!tablabLocalize) tablabLocalize = TabRenderizationError.DEFAULT_TABLAB_LOCALIZE;

    tablabLocalize(failedWriteResults);

    const renderizationErrors =
      TabInstructionRenderizationError.createFromFailedWriteResults(failedWriteResults);

    this.details = new TabRenderizationErrorDetails({ renderizationErrors });
  }
}
