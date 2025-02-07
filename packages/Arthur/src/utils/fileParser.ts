import pdfParse from 'pdf-parse';
import docx4js from 'docx4js';

class FileParser {
  static async extractText(file: Express.Multer.File): Promise<string> {
    if (file.mimetype === 'application/pdf') {
      return this.extractTextFromPDF(file);
    } else if (
      file.mimetype ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      return this.extractTextFromDOCX(file);
    } else {
      throw new Error('Unsupported file format');
    }
  }

  private static async extractTextFromPDF(
    file: Express.Multer.File
  ): Promise<string> {
    const data = await pdfParse(file.buffer);
    return data.text;
  }

  private static async extractTextFromDOCX(
    file: Express.Multer.File
  ): Promise<string> {
    const doc = await docx4js.load(file.buffer);
    return doc.content.map((p: any) => p.text()).join('\n');
  }
}

export default FileParser;
