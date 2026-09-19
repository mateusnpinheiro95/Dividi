import { useEffect, useId, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { Button } from '../Button';
import { extractTextFromImage } from '@/services/ocrService';
import { parseReceiptText } from '@/utils/parseReceiptText';
import type { Order } from '@/types';

interface OcrCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrdersExtracted: (orders: Omit<Order, 'id'>[]) => void;
}

type OcrStatus = 'idle' | 'processing' | 'error';

interface OcrCaptureFormProps {
  onClose: () => void;
  onOrdersExtracted: (orders: Omit<Order, 'id'>[]) => void;
}

const OcrCaptureForm = ({ onClose, onOrdersExtracted }: OcrCaptureFormProps) => {
  const titleId = useId();
  const fileInputId = useId();
  const cameraInputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [status, setStatus] = useState<OcrStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Selecione uma imagem (JPG ou PNG).');
      setStatus('error');
      return;
    }

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }

    const nextUrl = URL.createObjectURL(file);
    previewUrlRef.current = nextUrl;
    setSelectedFile(file);
    setPreviewUrl(nextUrl);
    setStatus('idle');
    setErrorMessage(null);
  };

  const handleProcess = async () => {
    if (!selectedFile || status === 'processing') return;

    setStatus('processing');
    setErrorMessage(null);
    setProgress(0);

    try {
      const text = await extractTextFromImage(selectedFile, setProgress);
      const orders = parseReceiptText(text);

      if (orders.length === 0) {
        setStatus('error');
        setErrorMessage(
          'Nenhum item detectado. Tente outra foto ou adicione manualmente.'
        );
        return;
      }

      onOrdersExtracted(orders);
      onClose();
    } catch {
      setStatus('error');
      setErrorMessage('Não foi possível ler a imagem. Tente novamente.');
    }
  };

  const isProcessing = status === 'processing';

  return (
    <div className="relative z-10 w-full max-w-md rounded-t-2xl sm:rounded-2xl bg-white p-5 shadow-lg">
      <h2 id={titleId} className="text-lg font-semibold text-gray-900 mb-1">
        Escanear cupom
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        Tire uma foto ou selecione a imagem do cupom fiscal.
      </p>

      <input
        ref={cameraInputRef}
        id={cameraInputId}
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        onChange={handleFileChange}
        disabled={isProcessing}
      />
      <input
        ref={fileInputRef}
        id={fileInputId}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic,image/*"
        className="sr-only"
        onChange={handleFileChange}
        disabled={isProcessing}
      />

      <div className="flex gap-2 mb-4">
        <Button
          type="button"
          variant="secondary"
          fullWidth
          disabled={isProcessing}
          onClick={() => cameraInputRef.current?.click()}
          className="!min-h-11"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-5"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.055-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z"
            />
          </svg>
          Câmera
        </Button>
        <Button
          type="button"
          variant="secondary"
          fullWidth
          disabled={isProcessing}
          onClick={() => fileInputRef.current?.click()}
          className="!min-h-11"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-5"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z"
            />
          </svg>
          Galeria
        </Button>
      </div>

      {previewUrl ? (
        <div className="mb-4 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
          <img
            src={previewUrl}
            alt="Pré-visualização do cupom"
            className="w-full max-h-48 object-contain"
          />
        </div>
      ) : (
        <div className="mb-4 rounded-lg border border-dashed border-gray-300 bg-gray-50 py-8 px-4 text-center">
          <p className="text-sm text-gray-400">Nenhuma imagem selecionada</p>
        </div>
      )}

      {isProcessing && (
        <div
          className="mb-4 flex flex-col gap-2"
          aria-live="polite"
          aria-busy="true"
        >
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span
              className="size-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin shrink-0"
              aria-hidden="true"
            />
            Processando imagem…
          </div>
          <div className="h-1.5 w-full rounded-full bg-gray-200 overflow-hidden">
            <div
              className="h-full bg-primary-600 transition-all duration-300"
              style={{ width: `${Math.max(8, Math.round(progress * 100))}%` }}
            />
          </div>
        </div>
      )}

      {errorMessage && (
        <p
          className="mb-4 text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2"
          role="alert"
        >
          {errorMessage}
        </p>
      )}

      <div className="flex gap-3 pt-1">
        <Button
          type="button"
          variant="secondary"
          fullWidth
          onClick={onClose}
          disabled={isProcessing}
        >
          Cancelar
        </Button>
        <Button
          type="button"
          variant="primary"
          fullWidth
          onClick={() => void handleProcess()}
          disabled={!selectedFile || isProcessing}
        >
          {isProcessing ? 'Lendo…' : 'Ler cupom'}
        </Button>
      </div>
    </div>
  );
};

export const OcrCaptureModal = ({
  isOpen,
  onClose,
  onOrdersExtracted,
}: OcrCaptureModalProps) => {
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Escanear cupom"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="Fechar modal"
        onClick={onClose}
      />

      <OcrCaptureForm onClose={onClose} onOrdersExtracted={onOrdersExtracted} />
    </div>
  );
};
