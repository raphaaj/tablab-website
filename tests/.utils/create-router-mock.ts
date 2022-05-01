import { NextRouter } from 'next/router';

// * https://github.com/vercel/next.js/discussions/23034
// * https://www.youtube.com/watch?v=uF2lqBluQV8&t=5s
// * https://github.com/vercel/next.js/blob/canary/packages/next/client/index.tsx
export function createRouterMock(router: Partial<NextRouter> = {}): NextRouter {
  return {
    asPath: '/',
    basePath: '/',
    pathname: '/',
    route: '/',
    query: {},
    defaultLocale: 'en-US',
    domainLocales: [],
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
    isFallback: false,
    isLocaleDomain: false,
    isReady: true,
    isPreview: false,
    back: jest.fn(() => Promise.resolve(true)),
    beforePopState: jest.fn(() => Promise.resolve(true)),
    prefetch: jest.fn(() => Promise.resolve()),
    push: jest.fn(() => Promise.resolve(true)),
    reload: jest.fn(() => Promise.resolve(true)),
    replace: jest.fn(() => Promise.resolve(true)),
    ...router,
  };
}
