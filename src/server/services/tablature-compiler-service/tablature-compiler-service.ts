import { CompiledTablatureDTO } from '@server/services/tablature-compiler-service/dtos/compiled-tablature.dto';
import { TablatureCompilationOptionsDTO } from '@server/services/tablature-compiler-service/dtos/tablature-compilation-options.dto';
import {
  FailedTablatureCompilationResultDTO,
  SuccessfulTablatureCompilationResultDTO,
  TablatureCompilationResultDTO,
} from '@server/services/tablature-compiler-service/dtos/tablature-compilation-result.dto';
import { TablatureInstructionCompilationErrorDTO } from '@server/services/tablature-compiler-service/dtos/tablature-instruction-compilation-error.dto';
import { ITablatureCompilerService } from '@server/services/tablature-compiler-service/interfaces/tablature-compiler-service.interface';
import { FailedWriteResult, MethodInstruction, Parser, Tab } from 'tablab';
import { Localizer, localizeEnUs, localizePtBr } from 'tablab-i18n';

export class TablatureCompilerService implements ITablatureCompilerService {
  private static readonly DEFAULT_TABLAT_LOCALIZE: Localizer = localizeEnUs;
  private static readonly LOCALE_TO_TABLAB_LOCALIZE_MAP: Map<string, Localizer> = new Map([
    ['en-US', localizeEnUs],
    ['pt-BR', localizePtBr],
  ]);

  private static _createTablatureInstructionCompilationErrorDTOFromFailedWriteResult(
    failedWriteResult: FailedWriteResult
  ): TablatureInstructionCompilationErrorDTO {
    const parsedInstruction = failedWriteResult.instructionWriter.parsedInstruction;

    let childInstructionsCompilationErrors: TablatureInstructionCompilationErrorDTO[] | null = null;
    if (failedWriteResult.childResults) {
      childInstructionsCompilationErrors =
        TablatureCompilerService._createTablatureInstructionCompilationErrorDTOsFromFailedWriteResults(
          failedWriteResult.childResults.filter((childWriteResult) => !childWriteResult.success)
        );
    }

    return new TablatureInstructionCompilationErrorDTO({
      instruction: parsedInstruction.value,
      instructionStartIndex: parsedInstruction.readFromIndex,
      instructionEndIndex: parsedInstruction.readToIndex,
      compilationErrorMessage: failedWriteResult.failureMessage!,
      compilationErrorType: failedWriteResult.failureReasonIdentifier!,
      childInstructionsCompilationErrors: childInstructionsCompilationErrors,
    });
  }

  private static _createTablatureInstructionCompilationErrorDTOsFromFailedWriteResults(
    failedWriteResults: FailedWriteResult[]
  ): TablatureInstructionCompilationErrorDTO[] {
    return failedWriteResults.map((failedWriteResult) =>
      TablatureCompilerService._createTablatureInstructionCompilationErrorDTOFromFailedWriteResult(
        failedWriteResult
      )
    );
  }

  public isSuccessfulTablatureCompilationResult(
    tablatureCompilationResult: TablatureCompilationResultDTO
  ): tablatureCompilationResult is SuccessfulTablatureCompilationResultDTO {
    return tablatureCompilationResult.tablatureCompiledSuccessfully;
  }

  public async compileTablaure(
    instructions: string,
    compilationOptions: TablatureCompilationOptionsDTO
  ): Promise<TablatureCompilationResultDTO> {
    const internalTablatureCompilationResult = await this._compileTablature(
      instructions,
      compilationOptions
    );

    let tablatureCompilationResult: TablatureCompilationResultDTO;
    if (this._isSuccessfulTablatureCompilationResult(internalTablatureCompilationResult)) {
      const compiledTablature = new CompiledTablatureDTO({
        tablature: internalTablatureCompilationResult.renderedTablature,
        tablatureCompilationOptions: compilationOptions,
      });

      tablatureCompilationResult = new SuccessfulTablatureCompilationResultDTO(compiledTablature);
    } else {
      this._localizeFailedWriteResults(
        internalTablatureCompilationResult.failedWriteResults,
        compilationOptions.locale
      );

      const tablatureInstructionCompilationErrors =
        TablatureCompilerService._createTablatureInstructionCompilationErrorDTOsFromFailedWriteResults(
          internalTablatureCompilationResult.failedWriteResults
        );

      tablatureCompilationResult = new FailedTablatureCompilationResultDTO(
        tablatureInstructionCompilationErrors
      );
    }

    return tablatureCompilationResult;
  }

  private async _compileTablature(
    instructions: string,
    compilationOptions: TablatureCompilationOptionsDTO
  ): Promise<TablatureCompilationResult> {
    const tablatureWriter = this._createTablatureWriter(
      compilationOptions.numberOfStrings,
      compilationOptions.initialSpacing
    );
    const instructionsParser = this._createInstructionsParser();

    let success = true;
    const failedWriteResults: FailedWriteResult[] = [];
    (await instructionsParser.parseAllAsync(instructions)).forEach((parsedInstruction) => {
      const parsedInstructionWriteResult = parsedInstruction.writeOnTab(tablatureWriter);

      if (!parsedInstructionWriteResult.success) {
        failedWriteResults.push(parsedInstructionWriteResult);
        success = false;
      }
    });

    let tablatureCompilationResult: TablatureCompilationResult;
    if (success) {
      tablatureCompilationResult = {
        renderedTablature: tablatureWriter.format(compilationOptions.rowsLength),
        success,
      };
    } else {
      tablatureCompilationResult = {
        failedWriteResults,
        success,
      };
    }

    return tablatureCompilationResult;
  }

  private _createTablatureWriter(numberOfStrings: number, initialSpacing: number): Tab {
    return new Tab({
      numberOfStrings,
      spacing: initialSpacing,
    });
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

  private _isSuccessfulTablatureCompilationResult(
    tablatureCompilationResult: TablatureCompilationResult
  ): tablatureCompilationResult is SuccessfulTablatureCompilationResult {
    return tablatureCompilationResult.success;
  }

  private _localizeFailedWriteResults(
    failedWriteResults: FailedWriteResult[],
    locale?: string | null
  ) {
    let tablabLocalize = TablatureCompilerService.DEFAULT_TABLAT_LOCALIZE;
    if (locale && TablatureCompilerService.LOCALE_TO_TABLAB_LOCALIZE_MAP.has(locale)) {
      tablabLocalize = TablatureCompilerService.LOCALE_TO_TABLAB_LOCALIZE_MAP.get(locale)!;
    }

    tablabLocalize(failedWriteResults);
  }
}

type SuccessfulTablatureCompilationResult = {
  renderedTablature: string[][];
  success: true;
};

type FailedTablatureCompilationResult = {
  failedWriteResults: FailedWriteResult[];
  success: false;
};

type TablatureCompilationResult =
  | SuccessfulTablatureCompilationResult
  | FailedTablatureCompilationResult;
