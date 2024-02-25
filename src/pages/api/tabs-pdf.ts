import fs from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import PDFDocument from 'pdfkit';

const fontsFolderPath = path.join(process.cwd(), 'public', 'fonts');
const jetBrainsMonoFontFilePath = path.join(
  fontsFolderPath,
  'JetBrains_Mono',
  'static',
  'JetBrainsMono-Light.ttf'
);
const montserratFontFilePath = path.join(
  fontsFolderPath,
  'Montserrat',
  'static',
  'Montserrat-Light.ttf'
);
const gloriaHallelujahFontFilePath = path.join(
  fontsFolderPath,
  'Gloria_Hallelujah',
  'GloriaHallelujah-Regular.ttf'
);
const jetBrainsMonoFontFileBuffer = fs.readFileSync(jetBrainsMonoFontFilePath);
const montserratFontFileBuffer = fs.readFileSync(montserratFontFilePath);
const gloriaHallelujahFontFileBuffer = fs.readFileSync(gloriaHallelujahFontFilePath);

export default function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method !== 'GET') {
    return response.status(405).end();
  }

  response.setHeader('Content-Disposition', 'attachment; filename=test.pdf');
  response.setHeader('Content-Type', 'application/pdf');

  const date = new Date();

  const document = new PDFDocument({
    info: {
      Title: 'Teste',
      Author: 'Tablab',
      CreationDate: date,
      ModDate: date,
      Producer: 'Tablab',
      Creator: 'Tablab',
    },
    size: 'A4',
    pdfVersion: '1.7ext3',
    bufferPages: true,
    margins: {
      top: 42, // 1.5cm
      bottom: 71, // 2.5cm
      left: 42, // 1.5cm
      right: 42, // 1.5cm
    },
  });
  document.pipe(response);

  document
    .registerFont('Normal', montserratFontFileBuffer)
    .registerFont('Mono', jetBrainsMonoFontFileBuffer)
    .registerFont('Brand', gloriaHallelujahFontFileBuffer);

  document
    .font('Normal')
    .fontSize(12)
    .text(
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    )
    .addPage()
    .font('Mono')
    .text(
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    );

  const range = document.bufferedPageRange();

  for (let i = range.start; i < range.start + range.count; i++) {
    document.switchToPage(i);

    const oldMarginBottom = document.page.margins.bottom;
    document.page.margins.bottom = 0;

    document
      .lineWidth(0.75)
      .strokeColor([0, 0, 0])
      .strokeOpacity(0.12)
      .moveTo(document.page.margins.left, document.page.height - oldMarginBottom)
      .lineTo(
        document.page.width - document.page.margins.right,
        document.page.height - oldMarginBottom
      )
      .stroke();

    document.font('Brand').fontSize(18);

    const brandTextHeight = document.heightOfString('Tablab');
    console.log('brandTextHeight', brandTextHeight);
    console.log('brandTextY', document.page.height - oldMarginBottom);

    document
      .fillColor([183, 28, 28])
      .text('Tablab', document.page.margins.left, document.page.height - oldMarginBottom, {
        align: 'left',
      })
      .fillColor([0, 0, 0]);

    document.font('Normal').fontSize(10);

    const pageTextHeight = document.heightOfString(`${i + 1}/${range.count}`);
    console.log('pageTextHeight', pageTextHeight);
    console.log(
      'pageTextY',
      document.page.height - oldMarginBottom + brandTextHeight - pageTextHeight
    );

    document
      .opacity(0.6)
      .text(
        `${i + 1}/${range.count}`,
        document.page.margins.left,
        document.page.height - oldMarginBottom + 0.5 * (brandTextHeight - pageTextHeight),
        { align: 'right' }
      )
      .opacity(1);

    document.page.margins.bottom = oldMarginBottom;
  }

  document.end();
}
