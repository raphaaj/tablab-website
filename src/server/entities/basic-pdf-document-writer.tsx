import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';

const fontsFolderPath = path.join(process.cwd(), 'public', 'fonts');

const montserratFontsFilePath = path.join(fontsFolderPath, 'Montserrat', 'static');
const montserratRegularFontFilePath = path.join(montserratFontsFilePath, 'Montserrat-Regular.ttf');
const montserratBoldFontFilePath = path.join(montserratFontsFilePath, 'Montserrat-Bold.ttf');
const montserratRegularFontFileBuffer = fs.readFileSync(montserratRegularFontFilePath);
const montserratBoldFontFileBuffer = fs.readFileSync(montserratBoldFontFilePath);

const sourceCodeProFontsFilePath = path.join(fontsFolderPath, 'Source_Code_Pro', 'static');
const sourceCodeProRegularFontFilePath = path.join(
  sourceCodeProFontsFilePath,
  'SourceCodePro-Regular.ttf'
);
const sourceCodeProRegularFontFileBuffer = fs.readFileSync(sourceCodeProRegularFontFilePath);

const gloriaHallelujahFontsFilePath = path.join(fontsFolderPath, 'Gloria_Hallelujah');
const gloriaHallelujahRegularFontFilePath = path.join(
  gloriaHallelujahFontsFilePath,
  'GloriaHallelujah-Regular.ttf'
);
const gloriaHallelujahRegularFontFileBuffer = fs.readFileSync(gloriaHallelujahRegularFontFilePath);

export interface BasicPdfDocumentOptions {
  title: string;
  outputStream: NodeJS.WritableStream;
}

export enum BasicPdfDocumentFontWeight {
  Regular = 'Regular',
  Bold = 'Bold',
}

export enum BasicPdfDocumentFontFamily {
  Normal = 'Normal',
  Brand = 'Brand',
  Mono = 'Mono',
}

export type BasicPdfDocumentColor = [number, number, number];

export interface BasicPdfDocumentUseTextOptions {
  fontSize: number;
  fontWeight: BasicPdfDocumentFontWeight;
  color: BasicPdfDocumentColor;
}

export interface BasicPdfDocumentWriteTextOptions {
  alignment: 'center' | 'justify' | 'left' | 'right';
  lineSpacing: number;
}

interface BasicPdfDocumentPageSetupToWriteOnBottomMarginArea {
  finishWritingAndRevertSetup: () => void;
  originalMarginBottom: number;
}

interface BasicPdfDocumentWriteFooterBrandMetadata {
  brandTextHeight: number;
}

export class BasicPdfDocumentWriter {
  protected readonly _defaultBrandName = 'Tablab';
  protected readonly _defaultAuthor = 'Tablab';
  protected readonly _defaultPdfVersion = '1.7ext3';

  protected readonly _defaultPageSize = 'A4';
  protected readonly _defaultMarginBottom = 71;
  protected readonly _defaultMarginLeft = 42;
  protected readonly _defaultMarginRight = 42;
  protected readonly _defaultMarginTop = 42;

  protected readonly _defaultFontSizeForNormalText: number = 10;
  protected readonly _defaultFontSizeForMonoText: number = 10;
  protected readonly _defaultFontSizeForBrandText: number = 16;
  protected readonly _defaultFontSizeForPageNumberText: number = 9;

  protected readonly _defaultColorForNormalText: BasicPdfDocumentColor = [33, 33, 33];
  protected readonly _defaultColorForMonoText: BasicPdfDocumentColor = [33, 33, 33];
  protected readonly _defaultColorForBrandText: BasicPdfDocumentColor = [183, 28, 28];

  private readonly _document: PDFKit.PDFDocument;

  public constructor({ title, outputStream }: BasicPdfDocumentOptions) {
    this._document = new PDFDocument({
      info: {
        Title: title,
        Author: this._defaultAuthor,
        CreationDate: new Date(),
      },
      size: this._defaultPageSize,
      pdfVersion: this._defaultPdfVersion,
      bufferPages: true,
      margins: {
        bottom: this._defaultMarginBottom,
        left: this._defaultMarginLeft,
        right: this._defaultMarginRight,
        top: this._defaultMarginTop,
      },
    });

    this._document
      .registerFont(
        this._buildFontName(BasicPdfDocumentFontFamily.Normal, BasicPdfDocumentFontWeight.Regular),
        montserratRegularFontFileBuffer
      )
      .registerFont(
        this._buildFontName(BasicPdfDocumentFontFamily.Normal, BasicPdfDocumentFontWeight.Bold),
        montserratBoldFontFileBuffer
      )
      .registerFont(
        this._buildFontName(BasicPdfDocumentFontFamily.Mono, BasicPdfDocumentFontWeight.Regular),
        sourceCodeProRegularFontFileBuffer
      )
      .registerFont(
        this._buildFontName(BasicPdfDocumentFontFamily.Brand, BasicPdfDocumentFontWeight.Regular),
        gloriaHallelujahRegularFontFileBuffer
      );

    this._document.pipe(outputStream);

    this.useNormalText();
  }

  public addPage(): this {
    this._document.addPage();
    return this;
  }

  public moveDown(numberOfLines?: number): this {
    this._document.moveDown(numberOfLines);
    return this;
  }

  public close(): void {
    this._document.end();
  }

  public useNormalText(useTextOptions?: Partial<BasicPdfDocumentUseTextOptions>): this {
    return this._setupTextOptions(BasicPdfDocumentFontFamily.Normal, {
      fontWeight: useTextOptions?.fontWeight ?? BasicPdfDocumentFontWeight.Regular,
      fontSize: useTextOptions?.fontSize ?? this._defaultFontSizeForNormalText,
      color: useTextOptions?.color ?? this._defaultColorForNormalText,
    });
  }

  public useMonoText(useTextOptions?: Partial<BasicPdfDocumentUseTextOptions>): this {
    return this._setupTextOptions(BasicPdfDocumentFontFamily.Mono, {
      fontWeight: BasicPdfDocumentFontWeight.Regular,
      fontSize: useTextOptions?.fontSize ?? this._defaultFontSizeForMonoText,
      color: useTextOptions?.color ?? this._defaultColorForMonoText,
    });
  }

  public useBrandText(useTextOptions?: Partial<BasicPdfDocumentUseTextOptions>): this {
    return this._setupTextOptions(BasicPdfDocumentFontFamily.Brand, {
      fontWeight: BasicPdfDocumentFontWeight.Regular,
      fontSize: useTextOptions?.fontSize ?? this._defaultFontSizeForBrandText,
      color: useTextOptions?.color ?? this._defaultColorForBrandText,
    });
  }

  public writeText(text: string, options?: Partial<BasicPdfDocumentWriteTextOptions>): this {
    this._document.text(text, { align: options?.alignment, lineGap: options?.lineSpacing });

    return this;
  }

  public textFitsCurrentPage(
    text: string,
    options?: Partial<BasicPdfDocumentWriteTextOptions>
  ): boolean {
    const textHeight = this._document.heightOfString(text, {
      align: options?.alignment,
      lineGap: options?.lineSpacing,
    });

    return (
      this._document.y + textHeight <
      this._document.page.height - this._document.page.margins.bottom
    );
  }

  public writeDefaultFooterOnAllPages(): this {
    const pagesRange = this._document.bufferedPageRange();

    for (let i = pagesRange.start; i < pagesRange.start + pagesRange.count; i++) {
      this._document.switchToPage(i);

      this._writeFooterDivisionLine();

      const footerBrandWriteMetadata = this._writeFooterBrand();

      this._writeFooterPageNumber(i, pagesRange.count, footerBrandWriteMetadata.brandTextHeight);
    }

    return this;
  }

  private _setupTextOptions(
    fontFamily: BasicPdfDocumentFontFamily,
    useTextOptions: BasicPdfDocumentUseTextOptions
  ): this {
    const fontName = this._buildFontName(fontFamily, useTextOptions.fontWeight);
    this._document.font(fontName).fillColor(useTextOptions.color).fontSize(useTextOptions.fontSize);

    return this;
  }

  private _buildFontName(
    fontFamily: BasicPdfDocumentFontFamily,
    fontWeight: BasicPdfDocumentFontWeight
  ): string {
    return `${fontFamily}-${fontWeight}`;
  }

  private _writeFooterDivisionLine(): void {
    const setup = this._setupCurrentPageToWriteOnBottomMarginArea();

    this._document
      .lineWidth(0.75)
      .strokeColor([0, 0, 0])
      .strokeOpacity(0.12)
      .moveTo(
        this._document.page.margins.left,
        this._document.page.height - setup.originalMarginBottom
      )
      .lineTo(
        this._document.page.width - this._document.page.margins.right,
        this._document.page.height - setup.originalMarginBottom
      )
      .stroke();

    setup.finishWritingAndRevertSetup();
  }

  private _writeFooterBrand(): BasicPdfDocumentWriteFooterBrandMetadata {
    const setup = this._setupCurrentPageToWriteOnBottomMarginArea();

    this.useBrandText();

    const brandText = this._defaultBrandName;
    const brandTextHeight = this._document.heightOfString(brandText);

    this._document.text(
      brandText,
      this._document.page.margins.left,
      this._document.page.height - setup.originalMarginBottom,
      {
        align: 'left',
      }
    );

    setup.finishWritingAndRevertSetup();

    return {
      brandTextHeight,
    };
  }

  private _writeFooterPageNumber(
    currentPageIndex: number,
    totalNumberOfPages: number,
    footerContentHeight: number
  ): void {
    const setup = this._setupCurrentPageToWriteOnBottomMarginArea();

    this.useNormalText({ fontSize: this._defaultFontSizeForPageNumberText });

    const pageNumberText = `${currentPageIndex + 1}/${totalNumberOfPages}`;
    const pageNumberTextHeight = this._document.heightOfString(pageNumberText);

    this._document.text(
      pageNumberText,
      this._document.page.margins.left,
      this._document.page.height -
        setup.originalMarginBottom +
        0.5 * (footerContentHeight - pageNumberTextHeight),
      { align: 'right', characterSpacing: 1 }
    );

    setup.finishWritingAndRevertSetup();
  }

  private _setupCurrentPageToWriteOnBottomMarginArea(): BasicPdfDocumentPageSetupToWriteOnBottomMarginArea {
    const originalMarginBottom = this._document.page.margins.bottom;
    this._document.page.margins.bottom = 0;

    return {
      finishWritingAndRevertSetup: () =>
        (this._document.page.margins.bottom = originalMarginBottom),
      originalMarginBottom: originalMarginBottom,
    };
  }
}
