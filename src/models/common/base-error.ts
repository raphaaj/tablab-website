export type BaseErrorData = {
  internalError?: Error | null;
  message?: string | null;
};

export class BaseError extends Error {
  public internalError: Error | null;

  public constructor({ message, internalError }: BaseErrorData) {
    super(message || undefined);

    Object.setPrototypeOf(this, new.target.prototype);
    this.name = new.target.name;

    this.internalError = internalError || null;
  }
}
