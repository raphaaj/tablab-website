import { BaseError, BaseErrorData } from '@models/common/base-error';
import { TabInstructionRenderizationError } from '@view-models/tab/tab-instruction-renderization-error';

export type TabCreationErrorData = BaseErrorData & {
  renderizationErrors?: TabInstructionRenderizationError[] | null;
};

export class TabCreationError extends BaseError {
  public renderizationErrors: TabInstructionRenderizationError[] | null;

  public constructor(errorData: TabCreationErrorData = {}) {
    super(errorData);

    this.renderizationErrors = errorData.renderizationErrors || null;
  }
}
