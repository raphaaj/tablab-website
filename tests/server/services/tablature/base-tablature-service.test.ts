import { BaseTablatureService } from '@server/services/tablature/base-tablature-service';
import {
  FailedTablatureCreationResultDTO,
  SuccessfulTablatureCreationResultDTO,
  TablatureCreationResultDTO,
} from '@server/services/tablature/dtos/tablature-creation-result-dto';
import { TablatureDTO } from '@server/services/tablature/dtos/tablature-dto';

class TestTablatureService extends BaseTablatureService {
  public createTablature(): Promise<TablatureCreationResultDTO> {
    throw new Error('Method not implemented.');
  }

  public getFailedTablatureCreationResultDTO(): FailedTablatureCreationResultDTO {
    return {
      success: false,
      failedWriteResults: [],
    };
  }

  public getSuccessfulTablatureCreationResult(): SuccessfulTablatureCreationResultDTO {
    return {
      success: true,
      tablature: new TablatureDTO({
        initialSpacing: 1,
        instructions: '',
        numberOfStrings: 1,
        renderedTab: [[]],
        rowsLength: 1,
      }),
    };
  }
}

describe(BaseTablatureService.name, () => {
  describe(BaseTablatureService.prototype.isSuccessfulTablatureCreationResult.name, () => {
    it('should return true if the given tablature creation result is a sucessful one', () => {
      const testTablatureService = new TestTablatureService();

      const successfulTablatureCreationResult =
        testTablatureService.getSuccessfulTablatureCreationResult();

      expect(
        testTablatureService.isSuccessfulTablatureCreationResult(successfulTablatureCreationResult)
      ).toBe(true);
    });

    it('should return false if the given tablature creation result is a failed one', () => {
      const testTablatureService = new TestTablatureService();

      const failedTablatureCreationResult =
        testTablatureService.getFailedTablatureCreationResultDTO();

      expect(
        testTablatureService.isSuccessfulTablatureCreationResult(failedTablatureCreationResult)
      ).toBe(false);
    });
  });
});
