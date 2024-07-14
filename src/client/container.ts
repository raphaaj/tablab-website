import { container as globalContainer } from 'tsyringe';

import { ITablatureServiceInjectionToken } from '@client/services/tablature-service/interfaces/tablature-service.interface';
import { TablatureService } from '@client/services/tablature-service/tablature-service';

export const container = globalContainer.createChildContainer();

export function setupContainer() {
  container.register(ITablatureServiceInjectionToken, TablatureService);
}
