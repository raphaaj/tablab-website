import { RoutePathHelper } from '@common/helpers/route-path-helper';

describe(RoutePathHelper.name, () => {
  describe('constructor', () => {
    it('should create a route path helper with the routePath set to the given routePath', () => {
      const testRoutePath = '/my/test/route/path';

      const testRoutePathHelper = new RoutePathHelper(testRoutePath);

      expect(testRoutePathHelper.routePath).toBe(testRoutePath);
    });
  });

  describe(RoutePathHelper.prototype.removeQueryParameters, () => {
    it('should keep the route path unchanged if it has no query parameters', () => {
      const testRoutePath = '/my/test/route/path';

      const testRoutePathHelper = new RoutePathHelper(testRoutePath);
      testRoutePathHelper.removeQueryParameters();

      expect(testRoutePathHelper.routePath).toBe(testRoutePath);
    });

    it.each<string>(['?', '?paramA=1', '?paramA=1&paramB=2'])(
      'should remove the query parameters (%s) from the route path',
      (routeParameters) => {
        const testRoutePathWithoutQueryParameters = '/my/test/route/path';
        const testRoutePathWithQueryParameters = `${testRoutePathWithoutQueryParameters}${routeParameters}`;

        const testRoutePathHelper = new RoutePathHelper(testRoutePathWithQueryParameters);
        testRoutePathHelper.removeQueryParameters();

        expect(testRoutePathHelper.routePath).toBe(testRoutePathWithoutQueryParameters);
      }
    );
  });

  describe(RoutePathHelper.prototype.removeFragments, () => {
    it('should keep the route path unchanged if it has no fragments', () => {
      const testRoutePath = '/my/test/route/path';

      const testRoutePathHelper = new RoutePathHelper(testRoutePath);
      testRoutePathHelper.removeFragments();

      expect(testRoutePathHelper.routePath).toBe(testRoutePath);
    });

    it.each<string>(['#', '#fragment1'])(
      'should remove the fragment (%s) from the route path',
      (fragment) => {
        const testRoutePathWithoutFragments = '/my/test/route/path';
        const testRoutePathWithFragments = `${testRoutePathWithoutFragments}${fragment}`;

        const testRoutePathHelper = new RoutePathHelper(testRoutePathWithFragments);
        testRoutePathHelper.removeFragments();

        expect(testRoutePathHelper.routePath).toBe(testRoutePathWithoutFragments);
      }
    );
  });
});
