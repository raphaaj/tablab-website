export class TablatureRequestOptionsDTO {
  public acceptedLanguage?: string;

  public constructor({ acceptedLanguage }: TablatureRequestOptionsDTO) {
    this.acceptedLanguage = acceptedLanguage;
  }
}
