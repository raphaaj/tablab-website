import { InstructionExampleDTO } from '@server/services/instructions-examples-setup-provider-service/dtos/instruction-example-dto';
import { InstructionExampleWithDescriptionDTO } from '@server/services/instructions-examples-setup-provider-service/dtos/instruction-example-with-description-dto';
import { InstructionExamplesSetupDTO } from '@server/services/instructions-examples-setup-provider-service/dtos/instruction-examples-setup-dto';

export const IInstructionsExamplesSetupProviderServiceInjectionToken =
  'IInstructionExamplesSetupProviderService';

export interface IInstructionsExamplesSetupProviderService {
  getBasicInstructionExamplesSetup(): Promise<
    InstructionExamplesSetupDTO<InstructionExampleWithDescriptionDTO>
  >;

  getBasicInstructionWithTechniqueExamplesSetup(): Promise<
    InstructionExamplesSetupDTO<InstructionExampleWithDescriptionDTO>
  >;

  getFooterInstructionExamplesSetup(): Promise<InstructionExamplesSetupDTO<InstructionExampleDTO>>;

  getHeaderInstructionExamplesSetup(): Promise<InstructionExamplesSetupDTO<InstructionExampleDTO>>;

  getMergeInstructionExamplesSetup(): Promise<InstructionExamplesSetupDTO<InstructionExampleDTO>>;

  getRepeatInstructionExamplesSetup(): Promise<InstructionExamplesSetupDTO<InstructionExampleDTO>>;

  getSpacingInstructionExamplesSetup(): Promise<InstructionExamplesSetupDTO<InstructionExampleDTO>>;

  useLocale(locale: string): void;
}
