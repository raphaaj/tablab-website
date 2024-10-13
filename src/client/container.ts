import { container as globalContainer } from 'tsyringe';

import { ITablatureServiceInjectionToken } from '@client/services/tablature-service/interfaces/tablature-service.interface';
import { TablatureService } from '@client/services/tablature-service/tablature-service';
import { ITablatureRowLabelServiceInjectionToken } from '@common/services/tablature-row-label-service/interfaces/tablature-row-label-service.interface';
import { TablatureRowLabelService } from '@common/services/tablature-row-label-service/tablature-row-label-service';

export const container = globalContainer.createChildContainer();

export function setupContainer() {
  container.register(ITablatureServiceInjectionToken, TablatureService);
  container.register(ITablatureRowLabelServiceInjectionToken, TablatureRowLabelService);
}
