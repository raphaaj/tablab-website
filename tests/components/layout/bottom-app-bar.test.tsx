import BottomAppBar, {
  HIGHLIGHT_OPACITY,
  LOWLIGHT_OPACITY,
} from '@components/layout/bottom-app-bar';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import nextI18nextConfig from 'next-i18next.config';

// https://react.i18next.com/misc/testing
jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: (key: string) => key,
    };
  },
}));

describe(`${BottomAppBar.name}`, () => {
  describe('home page link', () => {
    it('should render a highlighted link to the home page when at the home page', () => {
      render(<BottomAppBar currentPath="/" currentLocale="en-US" />);

      const homePageLink = screen.getByRole('link', {
        name: 'navigation.homeLink.descriptiveLabel',
      });

      expect(homePageLink).toBeInTheDocument();
      expect(homePageLink).toHaveAttribute('href', '/');
      expect(homePageLink).toHaveStyle(`opacity: ${HIGHLIGHT_OPACITY}`);
    });

    it('should render a lowlighted link to the home page when not at the home page', () => {
      render(<BottomAppBar currentPath="/other" currentLocale="en-US" />);

      const homePageLink = screen.getByRole('link', {
        name: 'navigation.homeLink.descriptiveLabel',
      });

      expect(homePageLink).toBeInTheDocument();
      expect(homePageLink).toHaveAttribute('href', '/');
      expect(homePageLink).toHaveStyle(`opacity: ${LOWLIGHT_OPACITY}`);
    });

    it(`should render a descriptive tooltip when the home page link is hovered`, async () => {
      render(<BottomAppBar currentPath="/" currentLocale="en-US" />);

      let homePageLinkTooltip = screen.queryByRole('tooltip', {
        name: 'navigation.homeLink.shortLabel',
      });
      expect(homePageLinkTooltip).not.toBeInTheDocument();

      const homePageLink = screen.getByRole('link', {
        name: 'navigation.homeLink.descriptiveLabel',
      });

      const user = userEvent.setup();
      await user.hover(homePageLink);

      homePageLinkTooltip = await screen.findByRole('tooltip', {
        name: 'navigation.homeLink.shortLabel',
      });

      expect(homePageLinkTooltip).toBeInTheDocument();
      expect(homePageLinkTooltip).toHaveTextContent('navigation.homeLink.shortLabel');
    });
  });

  describe('about page link', () => {
    it('should render a highlighted link to the about page when at the about page', () => {
      render(<BottomAppBar currentPath="/about" currentLocale="en-US" />);

      const aboutPageLink = screen.getByRole('link', {
        name: 'navigation.aboutLink.descriptiveLabel',
      });

      expect(aboutPageLink).toBeInTheDocument();
      expect(aboutPageLink).toHaveAttribute('href', '/about');
      expect(aboutPageLink).toHaveStyle(`opacity: ${HIGHLIGHT_OPACITY}`);
    });

    it('should render a lowlighted link to the about page when not at the about page', () => {
      render(<BottomAppBar currentPath="/other" currentLocale="en-US" />);

      const aboutPageLink = screen.getByRole('link', {
        name: 'navigation.aboutLink.descriptiveLabel',
      });

      expect(aboutPageLink).toBeInTheDocument();
      expect(aboutPageLink).toHaveAttribute('href', '/about');
      expect(aboutPageLink).toHaveStyle(`opacity: ${LOWLIGHT_OPACITY}`);
    });

    it(`should render a descriptive tooltip when the about page link is hovered`, async () => {
      render(<BottomAppBar currentPath="/" currentLocale="en-US" />);

      let aboutPageLinkTooltip = screen.queryByRole('tooltip', {
        name: 'navigation.aboutLink.shortLabel',
      });
      expect(aboutPageLinkTooltip).not.toBeInTheDocument();

      const aboutPageLink = screen.getByRole('link', {
        name: 'navigation.aboutLink.descriptiveLabel',
      });

      const user = userEvent.setup();
      await user.hover(aboutPageLink);

      aboutPageLinkTooltip = await screen.findByRole('tooltip', {
        name: 'navigation.aboutLink.shortLabel',
      });

      expect(aboutPageLinkTooltip).toBeInTheDocument();
      expect(aboutPageLinkTooltip).toHaveTextContent('navigation.aboutLink.shortLabel');
    });
  });

  describe('options menu', () => {
    it('should render a button to launch the options menu', () => {
      render(<BottomAppBar currentPath="/other" currentLocale="en-US" />);

      const optionsMenuButton = screen.getByRole('button', {
        name: 'options.descriptiveLabel',
      });

      expect(optionsMenuButton).toBeInTheDocument();
      expect(optionsMenuButton).toHaveAttribute('aria-controls', 'menu-options');
    });

    it(`should render a descriptive tooltip when the options menu button is hovered`, async () => {
      render(<BottomAppBar currentPath="/" currentLocale="en-US" />);

      let optionsMenuButtonTooltip = screen.queryByRole('tooltip', {
        name: 'options.shortLabel',
      });
      expect(optionsMenuButtonTooltip).not.toBeInTheDocument();

      const optionsMenuButton = screen.getByRole('button', {
        name: 'options.descriptiveLabel',
      });

      const user = userEvent.setup();
      await user.hover(optionsMenuButton);

      optionsMenuButtonTooltip = await screen.findByRole('tooltip', {
        name: 'options.shortLabel',
      });

      expect(optionsMenuButtonTooltip).toBeInTheDocument();
      expect(optionsMenuButtonTooltip).toHaveTextContent('options.shortLabel');
    });

    it('should launch the options menu when the options menu button is clicked', async () => {
      render(<BottomAppBar currentPath="/" currentLocale="en-US" />);

      let optionsMenu = screen.queryByRole('presentation');
      expect(optionsMenu).not.toBeInTheDocument();

      const optionsMenuButton = screen.getByRole('button', {
        name: 'options.descriptiveLabel',
      });

      const user = userEvent.setup();
      await user.click(optionsMenuButton);

      optionsMenu = screen.queryByRole('presentation');

      expect(optionsMenu).toBeInTheDocument();
      expect(optionsMenu).toHaveAttribute('id', 'menu-options');
    });

    it('should close the options menu when it is closed', async () => {
      render(<BottomAppBar currentPath="/" currentLocale="en-US" />);

      const optionsMenuButton = screen.getByRole('button', {
        name: 'options.descriptiveLabel',
      });

      const user = userEvent.setup();
      await user.click(optionsMenuButton);

      let optionsMenu = screen.queryByRole('presentation');
      expect(optionsMenu).toBeInTheDocument();

      await user.keyboard('{Escape}');

      optionsMenu = screen.queryByRole('presentation');
      expect(optionsMenu).not.toBeInTheDocument();
    });

    it('should have an option to set the language', async () => {
      render(<BottomAppBar currentPath="/" currentLocale="en-US" />);

      const optionsMenuButton = screen.getByRole('button', {
        name: 'options.descriptiveLabel',
      });

      const user = userEvent.setup();
      await user.click(optionsMenuButton);

      const optionsMenu = screen.getByRole('presentation');
      const languageOptionsMenu = within(optionsMenu).getByText('options.language.shortLabel');

      expect(languageOptionsMenu).toBeInTheDocument();
    });

    it.each(nextI18nextConfig.i18n.locales)(
      'should have an option to set the language for each supported locale (%s)',
      async (supportedLocale) => {
        const currentPath = '/some/path';
        render(<BottomAppBar currentPath={currentPath} currentLocale="en-US" />);

        const optionsMenuButton = screen.getByRole('button', {
          name: 'options.descriptiveLabel',
        });

        const user = userEvent.setup();
        await user.click(optionsMenuButton);

        let optionsMenu = screen.getByRole('presentation');
        const languageOptionsMenu = within(optionsMenu).getByText('options.language.shortLabel');

        await user.click(languageOptionsMenu);

        optionsMenu = screen.getByRole('presentation');
        const languageMenuOption = within(optionsMenu).getByRole('link', {
          name: `options.language.localeToLanguage.${supportedLocale}`,
        });

        expect(languageMenuOption).toBeInTheDocument();
        expect(languageMenuOption).toHaveAttribute('href', expect.stringContaining(currentPath));
      }
    );

    it(`should have a link to the project's repository on github`, async () => {
      const currentPath = '/some/path';
      render(<BottomAppBar currentPath={currentPath} currentLocale="en-US" />);

      const optionsMenuButton = screen.getByRole('button', {
        name: 'options.descriptiveLabel',
      });

      const user = userEvent.setup();
      await user.click(optionsMenuButton);

      const optionsMenu = screen.getByRole('presentation');
      const projectRepositoryLink = within(optionsMenu).getByRole('link', {
        name: 'navigation.gitHubRepositoryLink.descriptiveLabel',
      });

      expect(projectRepositoryLink).toBeInTheDocument();
      expect(projectRepositoryLink).toHaveAttribute('target', '_blank');
      expect(projectRepositoryLink).toHaveAttribute(
        'href',
        'https://github.com/raphael-jorge/tablab-website'
      );
    });
  });
});
