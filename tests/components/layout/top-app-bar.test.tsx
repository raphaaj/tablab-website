import TopAppBar, { HIGHLIGHT_OPACITY, LOWLIGHT_OPACITY } from '@components/layout/top-app-bar';
import { render, screen } from '@testing-library/react';
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

describe(`${TopAppBar.name}`, () => {
  it('should render the tablab brand name as a link to the home page', () => {
    render(<TopAppBar currentPath="/" currentLocale="en-US" />);

    const tablabBrandLink = screen.getByRole('link', { name: 'Tablab' });

    expect(tablabBrandLink).toBeInTheDocument();
    expect(tablabBrandLink).toHaveAttribute('href', '/');
  });

  describe('menu', () => {
    it('should not render the menu if the showMenu attribute is not set', () => {
      render(<TopAppBar currentPath="/" currentLocale="en-US" />);

      const menu = screen.queryByRole('navigation');

      expect(menu).not.toBeInTheDocument();
    });

    it('should render the menu if the showMenu attribute is set', () => {
      render(<TopAppBar showMenu currentPath="/" currentLocale="en-US" />);

      const menu = screen.queryByRole('navigation');

      expect(menu).toBeInTheDocument();
    });

    describe('home page link', () => {
      it('should render a highlighted link to the home page when at the home page', () => {
        render(<TopAppBar showMenu currentPath="/" currentLocale="en-US" />);

        const homePageLink = screen.getByRole('link', {
          name: 'navigation.homeLink.descriptiveLabel',
        });

        expect(homePageLink).toBeInTheDocument();
        expect(homePageLink).toHaveAttribute('href', '/');
        expect(homePageLink).toHaveTextContent('navigation.homeLink.shortLabel');
        expect(homePageLink).toHaveStyle(`opacity: ${HIGHLIGHT_OPACITY}`);
      });

      it('should render a lowlighted link to the home page when not at the home page', () => {
        render(<TopAppBar showMenu currentPath="/other" currentLocale="en-US" />);

        const homePageLink = screen.getByRole('link', {
          name: 'navigation.homeLink.descriptiveLabel',
        });

        expect(homePageLink).toBeInTheDocument();
        expect(homePageLink).toHaveAttribute('href', '/');
        expect(homePageLink).toHaveTextContent('navigation.homeLink.shortLabel');
        expect(homePageLink).toHaveStyle(`opacity: ${LOWLIGHT_OPACITY}`);
      });
    });

    describe('editor page link', () => {
      it('should render a highlighted link to the editor page when at the editor page', () => {
        render(<TopAppBar showMenu currentPath="/editor" currentLocale="en-US" />);

        const editorPageLink = screen.getByRole('link', {
          name: 'navigation.editorLink.descriptiveLabel',
        });

        expect(editorPageLink).toBeInTheDocument();
        expect(editorPageLink).toHaveAttribute('href', '/editor');
        expect(editorPageLink).toHaveTextContent('navigation.editorLink.shortLabel');
        expect(editorPageLink).toHaveStyle(`opacity: ${HIGHLIGHT_OPACITY}`);
      });

      it('should render a lowlighted link to the editor page when not at the editor page', () => {
        render(<TopAppBar showMenu currentPath="/other" currentLocale="en-US" />);

        const editorPageLink = screen.getByRole('link', {
          name: 'navigation.editorLink.descriptiveLabel',
        });

        expect(editorPageLink).toBeInTheDocument();
        expect(editorPageLink).toHaveAttribute('href', '/editor');
        expect(editorPageLink).toHaveTextContent('navigation.editorLink.shortLabel');
        expect(editorPageLink).toHaveStyle(`opacity: ${LOWLIGHT_OPACITY}`);
      });
    });

    describe('about page link', () => {
      it('should render a highlighted link to the about page when at the about page', () => {
        render(<TopAppBar showMenu currentPath="/about" currentLocale="en-US" />);

        const aboutPageLink = screen.getByRole('link', {
          name: 'navigation.aboutLink.descriptiveLabel',
        });

        expect(aboutPageLink).toBeInTheDocument();
        expect(aboutPageLink).toHaveAttribute('href', '/about');
        expect(aboutPageLink).toHaveTextContent('navigation.aboutLink.shortLabel');
        expect(aboutPageLink).toHaveStyle(`opacity: ${HIGHLIGHT_OPACITY}`);
      });

      it('should render a lowlighted link to the about page when not at the about page', () => {
        render(<TopAppBar showMenu currentPath="/other" currentLocale="en-US" />);

        const aboutPageLink = screen.getByRole('link', {
          name: 'navigation.aboutLink.descriptiveLabel',
        });

        expect(aboutPageLink).toBeInTheDocument();
        expect(aboutPageLink).toHaveAttribute('href', '/about');
        expect(aboutPageLink).toHaveTextContent('navigation.aboutLink.shortLabel');
        expect(aboutPageLink).toHaveStyle(`opacity: ${LOWLIGHT_OPACITY}`);
      });
    });

    describe(`project's repository link`, () => {
      it(`should render a link to the project's repository on github`, () => {
        render(<TopAppBar showMenu currentPath="/" currentLocale="en-US" />);

        const projectRepositoryLink = screen.getByRole('link', {
          name: 'navigation.gitHubRepositoryLink.descriptiveLabel',
        });

        expect(projectRepositoryLink).toBeInTheDocument();
        expect(projectRepositoryLink).toHaveAttribute('target', '_blank');
        expect(projectRepositoryLink).toHaveAttribute(
          'href',
          'https://github.com/raphael-jorge/tablab-website'
        );
      });

      it(`should render a descriptive tooltip when the project's repository link is hovered`, async () => {
        render(<TopAppBar showMenu currentPath="/" currentLocale="en-US" />);

        let projectRepositoryLinkTooltip = screen.queryByRole('tooltip', {
          name: 'navigation.gitHubRepositoryLink.descriptiveLabel',
        });
        expect(projectRepositoryLinkTooltip).not.toBeInTheDocument();

        const projectRepositoryLink = screen.getByRole('link', {
          name: 'navigation.gitHubRepositoryLink.descriptiveLabel',
        });

        const user = userEvent.setup();
        await user.hover(projectRepositoryLink);

        projectRepositoryLinkTooltip = await screen.findByRole('tooltip', {
          name: 'navigation.gitHubRepositoryLink.descriptiveLabel',
        });

        expect(projectRepositoryLinkTooltip).toBeInTheDocument();
        expect(projectRepositoryLinkTooltip).toHaveTextContent(
          'navigation.gitHubRepositoryLink.descriptiveLabel'
        );
      });
    });

    describe('language menu control', () => {
      it('should render a button to access the language menu', () => {
        render(<TopAppBar showMenu currentPath="/" currentLocale="en-US" />);

        const languageMenuButton = screen.getByRole('button', {
          name: 'options.language.descriptiveLabel',
        });

        expect(languageMenuButton).toBeInTheDocument();
      });

      it('should render a descriptive tooltip when the language menu button control is hovered', async () => {
        render(<TopAppBar showMenu currentPath="/" currentLocale="en-US" />);

        let languageMenuButtonTooltip = screen.queryByRole('tooltip', {
          name: 'options.language.descriptiveLabel',
        });
        expect(languageMenuButtonTooltip).not.toBeInTheDocument();

        const languageMenuButton = screen.getByRole('button', {
          name: 'options.language.descriptiveLabel',
        });

        const user = userEvent.setup();
        await user.hover(languageMenuButton);

        languageMenuButtonTooltip = await screen.findByRole('tooltip', {
          name: 'options.language.descriptiveLabel',
        });

        expect(languageMenuButtonTooltip).toBeInTheDocument();
        expect(languageMenuButtonTooltip).toHaveTextContent('options.language.descriptiveLabel');
      });

      it('should launch the language options menu when the language menu button is clicked', async () => {
        render(<TopAppBar showMenu currentPath="/" currentLocale="en-US" />);

        let languageMenu = screen.queryByRole('menu');
        expect(languageMenu).not.toBeInTheDocument();

        const languageMenuButton = screen.getByRole('button', {
          name: 'options.language.descriptiveLabel',
        });

        const user = userEvent.setup();
        await user.click(languageMenuButton);

        languageMenu = await screen.findByRole('menu');

        expect(languageMenu).toBeInTheDocument();
      });

      it('should close the language options menu when it is closed', async () => {
        render(<TopAppBar showMenu currentPath="/" currentLocale="en-US" />);

        const languageMenuButton = screen.getByRole('button', {
          name: 'options.language.descriptiveLabel',
        });

        const user = userEvent.setup();
        await user.click(languageMenuButton);

        let languageMenu = screen.queryByRole('menu');
        expect(languageMenu).toBeInTheDocument();

        await user.keyboard('{Escape}');

        languageMenu = screen.queryByRole('menu');
        expect(languageMenu).not.toBeInTheDocument();
      });

      it.each(nextI18nextConfig.i18n.locales)(
        'should have a language option for each supported locale (%s)',
        async (supportedLocale) => {
          const currentPath = '/some/path';
          render(<TopAppBar showMenu currentPath={currentPath} currentLocale="en-US" />);

          const languageMenuButton = screen.getByRole('button', {
            name: 'options.language.descriptiveLabel',
          });

          const user = userEvent.setup();
          await user.click(languageMenuButton);

          const languageMenuOption = screen.getByRole('menuitem', {
            name: `options.language.localeToLanguage.${supportedLocale}`,
          });

          expect(languageMenuOption).toBeInTheDocument();
          expect(languageMenuOption).toHaveAttribute('href', expect.stringContaining(currentPath));
        }
      );
    });
  });
});
