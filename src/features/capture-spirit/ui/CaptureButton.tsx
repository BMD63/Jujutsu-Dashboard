'use client';

import { useCaptureSpirit } from '../api/useCaptureSpirit';
import { toast } from 'react-hot-toast';
import styles from './CaptureButton.module.scss';

interface CaptureButtonProps {
  spiritId: string;
  spiritName: string;
  isCaptured?: boolean;
}

export const CaptureButton = ({ spiritId, spiritName, isCaptured = false }: CaptureButtonProps) => {
  const captureMutation = useCaptureSpirit();
  
  const handleCapture = () => {
    captureMutation.mutate(spiritId, {
      onSuccess: (data) => {
        if (data.success) {
          toast.success(`Дух "${spiritName}" успешно пойман!`);
        } else {
          toast.error(data.message || 'Ошибка захвата');
        }
      },
      onError: (error) => {
        toast.error(`Ошибка: ${error.message}`);
      },
    });
  };
  
  if (isCaptured) {
    return (
      <button disabled className={`${styles.button} ${styles.capturedButton}`}>
        🎯 Пойман
      </button>
    );
  }
  
  return (
    <button
      onClick={handleCapture}
      disabled={captureMutation.isPending}
      className={`${styles.button} ${captureMutation.isPending ? styles.pending : ''}`}
    >
      {captureMutation.isPending ? 'Захватываем...' : 'Capture'}
    </button>
  );
};