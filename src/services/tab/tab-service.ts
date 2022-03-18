import { TabCreationDTO } from '@services/tab/tab-creation-dto';
import { TabDTO } from '@services/tab/tab-dto';
import { FailedWriteResult, MethodInstruction, Parser, Tab } from 'tablab';

export abstract class BaseTabService {
  public isSuccessfulTabCreationResult(
    tabCreationResult: TabCreationResultDTO
  ): tabCreationResult is SuccessfulTabCreationResultDTO {
    return tabCreationResult.success;
  }

  public abstract createTab(tabCreationDTO: TabCreationDTO): Promise<TabCreationResultDTO>;
}

export type SuccessfulTabCreationResultDTO = {
  success: true;
  tab: TabDTO;
};

export type FailedTabCreationResultDTO = {
  failedWriteResults: FailedWriteResult[];
  success: false;
};

export type TabCreationResultDTO = SuccessfulTabCreationResultDTO | FailedTabCreationResultDTO;

export class TabService extends BaseTabService {
  public async createTab(tabCreationDTO: TabCreationDTO): Promise<TabCreationResultDTO> {
    const tabRenderizationResult = await this._renderTab(tabCreationDTO.instructions, {
      initialSpacing: tabCreationDTO.initialSpacing,
      numberOfStrings: tabCreationDTO.numberOfStrings,
      tabBlockLength: tabCreationDTO.tabBlockLength,
    });

    let tabCreationResult: TabCreationResultDTO;
    if (this._isSuccessfulTabRenderizationResult(tabRenderizationResult)) {
      const tabDTO = new TabDTO({
        initialSpacing: tabCreationDTO.initialSpacing,
        instructions: tabCreationDTO.instructions,
        numberOfStrings: tabCreationDTO.numberOfStrings,
        renderedTab: tabRenderizationResult.renderedTab,
        tabBlockLength: tabCreationDTO.tabBlockLength,
        observations: tabCreationDTO.observations,
        title: tabCreationDTO.title,
      });

      tabCreationResult = {
        tab: tabDTO,
        success: true,
      };
    } else {
      const { failedWriteResults } = tabRenderizationResult;

      tabCreationResult = {
        failedWriteResults,
        success: false,
      };
    }

    return tabCreationResult;
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

  private _createTabRenderer(creationOptions: TabRendererCreationOptions): Tab {
    return new Tab({
      numberOfStrings: creationOptions.numberOfStrings,
      spacing: creationOptions.initialSpacing,
    });
  }

  private _isSuccessfulTabRenderizationResult(
    tabRenderizationResult: TabRenderizationResult
  ): tabRenderizationResult is SuccessfulTabRenderizationResult {
    return tabRenderizationResult.success;
  }

  private async _renderTab(
    instructions: string,
    renderizationOptions: TabRenderizationOptions
  ): Promise<TabRenderizationResult> {
    const tabRenderer = this._createTabRenderer(renderizationOptions);
    const instructionsParser = this._createInstructionsParser();

    let success = true;
    const failedWriteResults: FailedWriteResult[] = [];

    (await instructionsParser.parseAllAsync(instructions)).forEach((parsedInstruction) => {
      const writeResult = parsedInstruction.writeOnTab(tabRenderer);

      if (!writeResult.success) {
        failedWriteResults.push(writeResult);
        success = false;
      }
    });

    let tabRenderizationResult: TabRenderizationResult;
    if (success) {
      tabRenderizationResult = {
        renderedTab: tabRenderer.format(renderizationOptions.tabBlockLength),
        success,
      };
    } else {
      tabRenderizationResult = {
        failedWriteResults,
        success,
      };
    }

    return tabRenderizationResult;
  }
}

type TabRendererCreationOptions = {
  initialSpacing?: number;
  numberOfStrings?: number;
};

type TabRenderizationOptions = {
  initialSpacing?: number;
  numberOfStrings?: number;
  tabBlockLength: number;
};

type SuccessfulTabRenderizationResult = {
  renderedTab: string[][];
  success: true;
};

type FailedTabRenderizationResult = {
  failedWriteResults: FailedWriteResult[];
  success: false;
};

type TabRenderizationResult = SuccessfulTabRenderizationResult | FailedTabRenderizationResult;
