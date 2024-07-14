import { TechniqueType } from '@common/enums/technique-type';
import { BasicInstructionExampleSourceDTO } from '@server/services/instructions-examples-setup-provider-service/dtos/basic-instruction-example-source-dto';
import { BasicInstructionWithTechniqueExampleSourceDTO } from '@server/services/instructions-examples-setup-provider-service/dtos/basic-instruction-with-technique-example-source-dto';
import { InstructionExampleDTO } from '@server/services/instructions-examples-setup-provider-service/dtos/instruction-example-dto';
import { InstructionExampleWithDescriptionDTO } from '@server/services/instructions-examples-setup-provider-service/dtos/instruction-example-with-description-dto';
import { InstructionExamplesSetupDTO } from '@server/services/instructions-examples-setup-provider-service/dtos/instruction-examples-setup-dto';
import { IInstructionsExamplesSetupProviderService } from '@server/services/instructions-examples-setup-provider-service/interfaces/instructions-examples-setup-provider-service.interface';
import {
  ITranslationServiceInjectionToken,
  type ITranslationService,
} from '@server/services/translation-service/interfaces/translation-service.interface';
import { TranslationFunction } from '@server/services/translation-service/types/translation-function.type';
import { inject, injectable } from 'tsyringe';

@injectable()
export class InstructionsExamplesSetupProviderService
  implements IInstructionsExamplesSetupProviderService
{
  private static readonly _basicInstructionExampleSources: BasicInstructionExampleSourceDTO[] = [
    new BasicInstructionExampleSourceDTO(1, '0'),
    new BasicInstructionExampleSourceDTO(6, '0'),
    new BasicInstructionExampleSourceDTO(3, '5'),
    new BasicInstructionExampleSourceDTO(4, '7'),
  ];

  private static readonly _basicInstructionWithTechniqueExampleSources: BasicInstructionWithTechniqueExampleSourceDTO[] =
    [
      new BasicInstructionWithTechniqueExampleSourceDTO(1, '5/7', TechniqueType.SlideUp),
      new BasicInstructionWithTechniqueExampleSourceDTO(3, '7\\5', TechniqueType.SlideDown),
      new BasicInstructionWithTechniqueExampleSourceDTO(3, '7b9', TechniqueType.Bend),
      new BasicInstructionWithTechniqueExampleSourceDTO(2, '7h9', TechniqueType.HammerOn),
      new BasicInstructionWithTechniqueExampleSourceDTO(5, '8p7', TechniqueType.PullOff),
    ];

  private static readonly _footerInstructionExamples: InstructionExampleDTO[] = [
    new InstructionExampleDTO('footer(x2) footer(x3)'),
    new InstructionExampleDTO('2-3 4-5 f(x2) 4-5 5-7 f(x3)'),
  ];

  private static readonly _headerInstructionExamples: InstructionExampleDTO[] = [
    new InstructionExampleDTO('header(Intro) header(Chorus)'),
    new InstructionExampleDTO('h(Intro) 2-0 4-0 h(Chorus) 3-0 5-0'),
  ];

  private static readonly _mergeInstructionExamples: InstructionExampleDTO[] = [
    new InstructionExampleDTO('merge { 1-0 2-0 3-0 4-0 5-0 6-0 }'),
    new InstructionExampleDTO('merge { 1-0 2-2 3-2 4-2 5-0 }'),
    new InstructionExampleDTO('m { 1-0 2-1 3-0 4-2 5-3 }'),
    new InstructionExampleDTO('m { 5-7 6-5 }'),
  ];

  private static readonly _repeatInstructionExamples: InstructionExampleDTO[] = [
    new InstructionExampleDTO('repeat(2) { 1-0 2-0 3-0 }'),
    new InstructionExampleDTO('repeat(3) { 1-0 2-0 3-0 }'),
    new InstructionExampleDTO('r(2) { merge { 5-7 6-5 } 5-7 6-5 }'),
    new InstructionExampleDTO('r(2) { repeat(3) { 1-0 2-0 } 3-0 }'),
  ];

  private static readonly _spacingInstructionExamples: InstructionExampleDTO[] = [
    new InstructionExampleDTO('1-0 spacing(4) 1-0 spacing(2) 1-0'),
    new InstructionExampleDTO('1-0 s(1) 3-0 s(4) 2-0'),
  ];

  private _locale: string;

  public constructor(
    @inject(ITranslationServiceInjectionToken)
    private _translationService: ITranslationService
  ) {
    this._locale = _translationService.getDefaultLocale();
  }

  public useLocale(locale: string): void {
    this._locale = locale;  
  }

  public async getBasicInstructionExamplesSetup(): Promise<
    InstructionExamplesSetupDTO<InstructionExampleWithDescriptionDTO>
  > {
    const t = await this._getTranslationFunction();

    const basicInstructionExamples: InstructionExampleWithDescriptionDTO[] =
      InstructionsExamplesSetupProviderService._basicInstructionExampleSources.map(
        ({ string, fret }) =>
          new InstructionExampleWithDescriptionDTO(
            `${string}-${fret}`,
            t('basicInstruction.description', { string, fret })
          )
      );

    const basicInstructionExamplesSetup =
      new InstructionExamplesSetupDTO<InstructionExampleWithDescriptionDTO>({
        initialSpacing: 3,
        numberOfStrings: 6,
        rowsLenght: 15,
        instructionExamples: basicInstructionExamples,
      });

    return basicInstructionExamplesSetup;
  }

  public async getBasicInstructionWithTechniqueExamplesSetup(): Promise<
    InstructionExamplesSetupDTO<InstructionExampleWithDescriptionDTO>
  > {
    const t = await this._getTranslationFunction();

    const basicInstructionWithTechniqueExamples: InstructionExampleWithDescriptionDTO[] =
      InstructionsExamplesSetupProviderService._basicInstructionWithTechniqueExampleSources.map(
        ({ string, fret, techniqueType }) =>
          new InstructionExampleWithDescriptionDTO(
            `${string}-${fret}`,
            t(`techniques.techniqueTypeToTechniqueName.${techniqueType}`)
          )
      );

    const basicInstructionWithTechniqueExamplesSetup =
      new InstructionExamplesSetupDTO<InstructionExampleWithDescriptionDTO>({
        initialSpacing: 3,
        numberOfStrings: 6,
        rowsLenght: 15,
        instructionExamples: basicInstructionWithTechniqueExamples,
      });

    return basicInstructionWithTechniqueExamplesSetup;
  }

  public async getFooterInstructionExamplesSetup(): Promise<
    InstructionExamplesSetupDTO<InstructionExampleDTO>
  > {
    const footerInstructionExamples =
      InstructionsExamplesSetupProviderService._footerInstructionExamples.slice();

    const footerInstructionExamplesSetup = new InstructionExamplesSetupDTO({
      initialSpacing: 3,
      numberOfStrings: 6,
      rowsLenght: 27,
      instructionExamples: footerInstructionExamples,
    });

    return footerInstructionExamplesSetup;
  }

  public async getHeaderInstructionExamplesSetup(): Promise<
    InstructionExamplesSetupDTO<InstructionExampleDTO>
  > {
    const headerInstructionExamples =
      InstructionsExamplesSetupProviderService._headerInstructionExamples.slice();

    const headerInstructionExamplesSetup = new InstructionExamplesSetupDTO({
      initialSpacing: 3,
      numberOfStrings: 6,
      rowsLenght: 27,
      instructionExamples: headerInstructionExamples,
    });

    return headerInstructionExamplesSetup;
  }

  public async getMergeInstructionExamplesSetup(): Promise<
    InstructionExamplesSetupDTO<InstructionExampleDTO>
  > {
    const mergeInstructionExamples =
      InstructionsExamplesSetupProviderService._mergeInstructionExamples.slice();

    const mergeInstructionExamplesSetup = new InstructionExamplesSetupDTO({
      initialSpacing: 3,
      numberOfStrings: 6,
      rowsLenght: 15,
      instructionExamples: mergeInstructionExamples,
    });

    return mergeInstructionExamplesSetup;
  }

  public async getRepeatInstructionExamplesSetup(): Promise<
    InstructionExamplesSetupDTO<InstructionExampleDTO>
  > {
    const repeatInstructionExamples =
      InstructionsExamplesSetupProviderService._repeatInstructionExamples.slice();

    const repeatInstructionExamplesSetup = new InstructionExamplesSetupDTO({
      initialSpacing: 2,
      numberOfStrings: 6,
      rowsLenght: 44,
      instructionExamples: repeatInstructionExamples,
    });

    return repeatInstructionExamplesSetup;
  }

  public async getSpacingInstructionExamplesSetup(): Promise<
    InstructionExamplesSetupDTO<InstructionExampleDTO>
  > {
    const spacingInstructionExamples =
      InstructionsExamplesSetupProviderService._spacingInstructionExamples.slice();

    const spacingInstructionExamplesSetup = new InstructionExamplesSetupDTO({
      initialSpacing: 3,
      numberOfStrings: 6,
      rowsLenght: 15,
      instructionExamples: spacingInstructionExamples,
    });

    return spacingInstructionExamplesSetup;
  }

  

  private async _getTranslationFunction(): Promise<TranslationFunction> {
    return this._translationService.getTranslationFunction(this._locale, ['instruction-examples']);
  }
}
