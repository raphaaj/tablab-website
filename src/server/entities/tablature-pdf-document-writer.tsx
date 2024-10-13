import {
  BasicPdfDocumentWriter,
  BasicPdfDocumentWriteTextOptions,
} from '@server/entities/basic-pdf-document-writer';

export class TablaturePdfDocumentWriter extends BasicPdfDocumentWriter {
  public writeTitle(title: string): this {
    return this.useNormalText({ fontSize: 16, color: this._defaultColorForBrandText })
      .writeText(title, { lineSpacing: 4 })
      .moveDown(0.5);
  }

  public writeObservations(observations: string): this {
    return this.useNormalText().writeText(observations, { lineSpacing: 2 }).moveDown(1);
  }

  public writeTablature(tablature: string[][]): this {
    this.useMonoText();

    for (let i = 0; i < Math.min(tablature.length, 100); i++) {
      const tablatureBlock = tablature[i];
      const tablatureBlockText = tablatureBlock.join('\n');

      const tablatureBlockTextOptions: Partial<BasicPdfDocumentWriteTextOptions> = {
        lineSpacing: 3,
        alignment: 'justify',
      };

      const tablatureBlockTextFitsCurrentPage = this.textFitsCurrentPage(
        tablatureBlockText,
        tablatureBlockTextOptions
      );
      if (!tablatureBlockTextFitsCurrentPage) this.addPage();

      this.writeText(tablatureBlockText, tablatureBlockTextOptions).moveDown();
    }

    return this;
  }
}
