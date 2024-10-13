import { container as globalContainer } from 'tsyringe';

import { ITablatureRowLabelServiceInjectionToken } from '@common/services/tablature-row-label-service/interfaces/tablature-row-label-service.interface';
import { TablatureRowLabelService } from '@common/services/tablature-row-label-service/tablature-row-label-service';
import { CommonErrorsProviderService } from '@server/services/errors-provider-services/common-errors-provider-service/common-errors-provider-service';
import { ICommonErrorsProviderServiceInjectionToken } from '@server/services/errors-provider-services/common-errors-provider-service/interfaces/common-errors-provider-service.interface';
import { ITablatureErrorsProviderServiceInjectionToken } from '@server/services/errors-provider-services/tablature-errors-provider-service/interfaces/tablature-errors-provider-service.interface';
import { TablatureErrorsProviderService } from '@server/services/errors-provider-services/tablature-errors-provider-service/tablature-errors-provider-service';
import { InstructionsExamplesSetupProviderService } from '@server/services/instructions-examples-setup-provider-service/instructions-examples-setup-provider-service';
import { IInstructionsExamplesSetupProviderServiceInjectionToken } from '@server/services/instructions-examples-setup-provider-service/interfaces/instructions-examples-setup-provider-service.interface';
import { IRequestHelperServiceInjectionToken } from '@server/services/request-helper-service/interfaces/request-helper-service.interface';
import { RequestHelperService } from '@server/services/request-helper-service/request-helper-service';
import { ITablatureCompilerServiceInjectionToken } from '@server/services/tablature-compiler-service/interfaces/tablature-compiler-service.interface';
import { TablatureCompilerService } from '@server/services/tablature-compiler-service/tablature-compiler-service';
import { ITranslationServiceInjectionToken } from '@server/services/translation-service/interfaces/translation-service.interface';
import { TranslationService } from '@server/services/translation-service/translation-service';

export const container = globalContainer.createChildContainer();

container.register(ITranslationServiceInjectionToken, TranslationService);
container.register(IRequestHelperServiceInjectionToken, RequestHelperService);
container.register(ITablatureCompilerServiceInjectionToken, TablatureCompilerService);
container.register(
  IInstructionsExamplesSetupProviderServiceInjectionToken,
  InstructionsExamplesSetupProviderService
);

container.register(ICommonErrorsProviderServiceInjectionToken, CommonErrorsProviderService);
container.register(ITablatureErrorsProviderServiceInjectionToken, TablatureErrorsProviderService);
container.register(ITablatureRowLabelServiceInjectionToken, TablatureRowLabelService);
