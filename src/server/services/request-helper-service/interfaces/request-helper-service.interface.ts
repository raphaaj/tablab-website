import { NextApiRequest } from "next";

export const IRequestHelperServiceInjectionToken = 'IRequestHelperService';

export interface IRequestHelperService {
  getLocaleOption(request: NextApiRequest): string | null;

  getLocaleOptionOrDefaultLocale(request: NextApiRequest): string;
}