import { createWorker } from 'tesseract.js';

const MAX_IMAGE_WIDTH = 1200;

/** Local Tesseract assets in /public/tesseract (offline — no CDN). */
const TESSERACT_PATHS = {
  workerPath: '/tesseract/worker.min.js',
  corePath: '/tesseract',
  langPath: '/tesseract',
} as const;

/**
 * Compresses an image file to reduce OCR processing time.
 * Returns a canvas data URL (JPEG) capped at MAX_IMAGE_WIDTH.
 */
async function compressImage(file: File): Promise<string> {
  const objectUrl = URL.createObjectURL(file);

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Não foi possível carregar a imagem.'));
      img.src = objectUrl;
    });

    const scale = Math.min(1, MAX_IMAGE_WIDTH / image.width);
    const width = Math.max(1, Math.round(image.width * scale));
    const height = Math.max(1, Math.round(image.height * scale));

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Não foi possível processar a imagem.');
    }

    context.drawImage(image, 0, 0, width, height);
    return canvas.toDataURL('image/jpeg', 0.85);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

/**
 * Extracts text from an image using Tesseract.js (Portuguese).
 * Runs entirely in the browser with local assets — no external network calls.
 */
export async function extractTextFromImage(
  imageFile: File,
  onProgress?: (progress: number) => void
): Promise<string> {
  const imageSource = await compressImage(imageFile);
  onProgress?.(0.05);

  const worker = await createWorker('por', 1, {
    ...TESSERACT_PATHS,
    gzip: true,
    logger: (message) => {
      if (message.status === 'recognizing text' && typeof message.progress === 'number') {
        onProgress?.(0.1 + message.progress * 0.9);
      }
    },
  });

  try {
    onProgress?.(0.1);

    const {
      data: { text },
    } = await worker.recognize(imageSource);

    onProgress?.(1);
    return text;
  } finally {
    await worker.terminate();
  }
}
