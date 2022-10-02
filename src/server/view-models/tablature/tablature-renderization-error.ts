import { ErrorCode } from '@common/enums/error-code';
import {
  TablatureRenderizationError as CommonTablatureRenderizationError,
  TablatureRenderizationErrorDetails as CommonTablatureRenderizationErrorDetails,
} from '@common/view-models/tablature/tablature-renderization-error';
import { BaseError, CommonErrorData } from '@server/view-models/error/base-error';
import { TablatureInstructionRenderizationErrorDetails } from '@server/view-models/tablature/tablature-instruction-renderization-error-details';
import { FailedWriteResult } from 'tablab';
import { localizeEnUs, localizePtBr, Localizer } from 'tablab-i18n';

class TablatureRenderizationErrorDetails implements CommonTablatureRenderizationErrorDetails {
  public instructionsRenderizationErrors: TablatureInstructionRenderizationErrorDetails[];

  public constructor(errorDetailsData: TablatureRenderizationErrorDetails) {
    this.instructionsRenderizationErrors = errorDetailsData.instructionsRenderizationErrors;
  }
}

export interface TablatureRenderizationErrorData extends CommonErrorData {
  failedWriteResults: FailedWriteResult[];
  locale: string;
}

export class TablatureRenderizationError
  extends BaseError<TablatureRenderizationErrorDetails>
  implements CommonTablatureRenderizationError
{
  public static readonly ERROR_CODE = ErrorCode.Tab_RenderizationError;

  private static readonly DEFAULT_TABLAB_LOCALIZE = localizeEnUs;

  private static readonly LOCALE_TO_TABLAB_LOCALIZE_MAP: Map<string, Localizer> = new Map([
    ['en-US', localizeEnUs],
    ['pt-BR', localizePtBr],
  ]);

  public details: TablatureRenderizationErrorDetails | null;

  public constructor({
    failedWriteResults,
    locale,
    message,
    request,
  }: TablatureRenderizationErrorData) {
    super({ message, request, errorCode: TablatureRenderizationError.ERROR_CODE });

    let tablabLocalize = TablatureRenderizationError.LOCALE_TO_TABLAB_LOCALIZE_MAP.get(locale);
    if (!tablabLocalize) tablabLocalize = TablatureRenderizationError.DEFAULT_TABLAB_LOCALIZE;

    tablabLocalize(failedWriteResults);

    const instructionsRenderizationErrors =
      TablatureInstructionRenderizationErrorDetails.createFromFailedWriteResults(
        failedWriteResults
      );

    this.details = new TablatureRenderizationErrorDetails({ instructionsRenderizationErrors });
  }
}
