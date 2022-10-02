import { BaseError } from '@common/models/errors/base-error';

describe(BaseError.name, () => {
  describe('constructor', () => {
    it('should set the error name', () => {
      const error = new BaseError();

      expect(error.name).toBe(BaseError.name);
    });

    it(`should fix the error object's prototype chain`, () => {
      const error = new BaseError();

      expect(error).toBeInstanceOf(BaseError);
      expect(error).toBeInstanceOf(Error);
    });

    it('should set the message, if one is provided at instantiation', () => {
      const errorMessage = 'test error message';
      const error = new BaseError({ message: errorMessage });

      expect(error.message).toBe(errorMessage);
    });

    it('should set an empty message if none is provided at instantiation', () => {
      const error = new BaseError();

      expect(error.message).toBe('');
    });

    it('should set the internalError, if one is provided at instantiation', () => {
      const internalError = new Error();
      const error = new BaseError({ internalError });

      expect(error.internalError).toBe(internalError);
    });

    it('should set the internalError to null if none is provided at instantiation', () => {
      const error = new BaseError();

      expect(error.internalError).toBeNull();
    });
  });
});
