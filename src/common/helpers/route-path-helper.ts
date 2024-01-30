export class RoutePathHelper {
  public routePath: string;

  public constructor(routePath: string) {
    this.routePath = routePath;
  }

  public removeFragments(): this {
    this.routePath = this.routePath.split('#')[0];

    return this;
  }

  public removeQueryParameters(): this {
    this.routePath = this.routePath.split('?')[0];

    return this;
  }
}
