import BaseLayout from '@client/components/layout/base-layout';
import { BottomAppBarProps } from '@client/components/layout/bottom-app-bar';
import { TopAppBarProps } from '@client/components/layout/top-app-bar';
import { render, screen, within } from '@testing-library/react';
import { createRouterMock } from '@tests/.utils/create-router-mock';
import { RouterContext } from 'next/dist/shared/lib/router-context.shared-runtime';

// https://react.i18next.com/misc/testing
jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: (key: string) => key,
    };
  },
}));

let isMobileScreenLayout = false;
jest.mock('@mui/material/useMediaQuery', () => ({
  __esModule: true,
  default: jest.fn(() => isMobileScreenLayout),
}));

jest.mock('@client/components/layout/bottom-app-bar', () => ({
  __esModule: true,
  default: (props: BottomAppBarProps) => (
    <div data-testid="bottom-app-bar">
      <div data-testid="props">{JSON.stringify(props)}</div>
    </div>
  ),
}));

jest.mock('@client/components/layout/top-app-bar', () => ({
  __esModule: true,
  default: (props: TopAppBarProps) => (
    <div data-testid="top-app-bar">
      <div data-testid="props">{JSON.stringify(props)}</div>
    </div>
  ),
}));

describe(`${BaseLayout.name}`, () => {
  describe('mobile screen layout', () => {
    beforeEach(() => (isMobileScreenLayout = true));

    it('should render a top app bar without its menu', () => {
      const path = '/some/path';
      const locale = 'en-US';

      render(
        <RouterContext.Provider value={createRouterMock({ asPath: path, locale })}>
          <BaseLayout />
        </RouterContext.Provider>
      );

      const topAppBarElement = screen.getByTestId('top-app-bar');
      const topAppBarPropsElement = within(topAppBarElement).getByTestId('props');

      const topAppBarProps: TopAppBarProps = JSON.parse(topAppBarPropsElement.textContent || '');

      expect(topAppBarElement).toBeInTheDocument();
      expect(topAppBarProps.showMenu).toBe(false);
      expect(topAppBarProps.currentPath).toBe(path);
      expect(topAppBarProps.currentLocale).toBe(locale);
    });

    it('should render a bottom app bar', () => {
      const path = '/some/path';
      const locale = 'en-US';

      render(
        <RouterContext.Provider value={createRouterMock({ asPath: path, locale })}>
          <BaseLayout />
        </RouterContext.Provider>
      );

      const bottomAppBarElement = screen.getByTestId('bottom-app-bar');
      const bottomAppBarPropsElement = within(bottomAppBarElement).getByTestId('props');

      const bottomAppBarProps: BottomAppBarProps = JSON.parse(
        bottomAppBarPropsElement.textContent || ''
      );

      expect(bottomAppBarElement).toBeInTheDocument();
      expect(bottomAppBarProps.currentPath).toBe(path);
      expect(bottomAppBarProps.currentLocale).toBe(locale);
    });
  });

  describe('non mobile screen layout', () => {
    beforeEach(() => (isMobileScreenLayout = false));

    it('should render a top app bar with its menu', () => {
      const path = '/some/path';
      const locale = 'en-US';

      render(
        <RouterContext.Provider value={createRouterMock({ asPath: path, locale })}>
          <BaseLayout />
        </RouterContext.Provider>
      );

      const topAppBarElement = screen.getByTestId('top-app-bar');
      const topAppBarPropsElement = within(topAppBarElement).getByTestId('props');

      const topAppBarProps: TopAppBarProps = JSON.parse(topAppBarPropsElement.textContent || '');

      expect(topAppBarElement).toBeInTheDocument();
      expect(topAppBarProps.showMenu).toBe(true);
      expect(topAppBarProps.currentPath).toBe(path);
      expect(topAppBarProps.currentLocale).toBe(locale);
    });

    it('should not render a bottom app bar', () => {
      const path = '/some/path';
      const locale = 'en-US';

      render(
        <RouterContext.Provider value={createRouterMock({ asPath: path, locale })}>
          <BaseLayout />
        </RouterContext.Provider>
      );

      const bottomAppBarElement = screen.queryByTestId('bottom-app-bar');

      expect(bottomAppBarElement).not.toBeInTheDocument();
    });
  });
});
