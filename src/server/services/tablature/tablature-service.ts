import { BaseTablatureService } from '@server/services/tablature/base-tablature-service';
import { TablatureCreationDataDTO } from '@server/services/tablature/dtos/tablature-creation-data-dto';
import { TablatureCreationResultDTO } from '@server/services/tablature/dtos/tablature-creation-result-dto';
import { TablatureDTO } from '@server/services/tablature/dtos/tablature-dto';
import { FailedWriteResult, MethodInstruction, Parser, Tab } from 'tablab';

export class TablatureService extends BaseTablatureService {
  public async createTablature(
    tablatureCreationData: TablatureCreationDataDTO
  ): Promise<TablatureCreationResultDTO> {
    const tabRenderizationResult = await this._renderTablature(tablatureCreationData.instructions, {
      initialSpacing: tablatureCreationData.initialSpacing,
      numberOfStrings: tablatureCreationData.numberOfStrings,
      rowsLength: tablatureCreationData.rowsLength,
    });

    let tablatureCreationResult: TablatureCreationResultDTO;
    if (this._isSuccessfulTablatureRenderizationResult(tabRenderizationResult)) {
      const tablature = new TablatureDTO({
        initialSpacing: tablatureCreationData.initialSpacing,
        instructions: tablatureCreationData.instructions,
        numberOfStrings: tablatureCreationData.numberOfStrings,
        renderedTab: tabRenderizationResult.renderedTablature,
        rowsLength: tablatureCreationData.rowsLength,
        observations: tablatureCreationData.observations,
        title: tablatureCreationData.title,
      });

      tablatureCreationResult = {
        tablature,
        success: true,
      };
    } else {
      const { failedWriteResults } = tabRenderizationResult;

      tablatureCreationResult = {
        failedWriteResults,
        success: false,
      };
    }

    return tablatureCreationResult;
  }

  private _createInstructionsParser(): Parser {
    return new Parser({
      methodInstructionAlias2IdentifierMap: {
        ...Parser.DEFAULT_METHOD_INSTRUCTION_ALIAS_2_IDENTIFIER_MAP,
        b: MethodInstruction.Break,
        f: MethodInstruction.Footer,
        h: MethodInstruction.Header,
        m: MethodInstruction.Merge,
        r: MethodInstruction.Repeat,
        s: MethodInstruction.SetSpacing,
      },
    });
  }

  private _createTablatureRenderer(options: TablatureRendererCreationOptions): Tab {
    return new Tab({
      numberOfStrings: options.numberOfStrings,
      spacing: options.initialSpacing,
    });
  }

  private _isSuccessfulTablatureRenderizationResult(
    tablatureRenderizationResult: TablatureRenderizationResult
  ): tablatureRenderizationResult is SuccessfulTablatureRenderizationResult {
    return tablatureRenderizationResult.success;
  }

  private async _renderTablature(
    instructions: string,
    renderizationOptions: TablatureRenderizationOptions
  ): Promise<TablatureRenderizationResult> {
    const tablatureRenderer = this._createTablatureRenderer(renderizationOptions);
    const instructionsParser = this._createInstructionsParser();

    let success = true;
    const failedWriteResults: FailedWriteResult[] = [];
    (await instructionsParser.parseAllAsync(instructions)).forEach((parsedInstruction) => {
      const writeResult = parsedInstruction.writeOnTab(tablatureRenderer);

      if (!writeResult.success) {
        failedWriteResults.push(writeResult);
        success = false;
      }
    });

    let tablatureRenderizationResult: TablatureRenderizationResult;
    if (success) {
      tablatureRenderizationResult = {
        renderedTablature: tablatureRenderer.format(renderizationOptions.rowsLength),
        success,
      };
    } else {
      tablatureRenderizationResult = {
        failedWriteResults,
        success,
      };
    }

    return tablatureRenderizationResult;
  }
}

interface TablatureRendererCreationOptions {
  initialSpacing?: number;
  numberOfStrings?: number;
}

interface TablatureRenderizationOptions {
  initialSpacing?: number;
  numberOfStrings?: number;
  rowsLength: number;
}

interface SuccessfulTablatureRenderizationResult {
  renderedTablature: string[][];
  success: true;
}

interface FailedTablatureRenderizationResult {
  failedWriteResults: FailedWriteResult[];
  success: false;
}

type TablatureRenderizationResult =
  | SuccessfulTablatureRenderizationResult
  | FailedTablatureRenderizationResult;
