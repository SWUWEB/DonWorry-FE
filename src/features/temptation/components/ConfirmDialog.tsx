import { IoWarningOutline } from 'react-icons/io5';
import styles from './ConfirmDialog.module.css';
import { useRef, useEffect } from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description?: string;
  cancelText?: string;
  confirmText?: string;
  isLoading?: boolean;
  errorMessage?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export const ConfirmDialog = ({
  isOpen,
  title,
  description,
  cancelText = '취소',
  confirmText = '확인',
  isLoading = false,
  errorMessage,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const cancelBtnRef = useRef<HTMLButtonElement>(null);
  const triggerElementRef = useRef<HTMLElement | null>(null);
  
  useEffect(() => {
    if (isOpen) {
      triggerElementRef.current = document.activeElement as HTMLElement;
      cancelBtnRef.current?.focus();
    } else if (triggerElementRef.current) {
      triggerElementRef.current.focus();
      triggerElementRef.current = null;
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (!isLoading) onCancel();
        return;
      }

      if (e.key === 'Tab' && cardRef.current) {
        const focusables = cardRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isLoading, onCancel]);
  
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div
      className={styles.card}
      ref={cardRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby={description ? 'confirm-dialog-description' : undefined}>
        <IoWarningOutline size={48} className={styles.icon} aria-hidden="true" />
        <p className={styles.title} id="confirm-dialog-title">{title}</p>
        {description && <p className={styles.description} id="confirm-dialog-description">{description}</p>}
        {errorMessage && <p className={styles.errorText} role="alert">{errorMessage}</p>}

        <div className={styles.buttonRow}>
          <button
          className={styles.cancelBtn}
          ref={cancelBtnRef}
          onClick={onCancel}
          disabled={isLoading}>
            {cancelText}
          </button>
          <button
          className={styles.confirmBtn}
          onClick={onConfirm}
          disabled={isLoading}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};