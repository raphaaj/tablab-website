export class TablatureCreationOptionsDTO {
  public acceptedLanguage?: string;

  public constructor({ acceptedLanguage }: TablatureCreationOptionsDTO) {
    this.acceptedLanguage = acceptedLanguage;
  }
}
