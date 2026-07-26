import { IoWarningOutline } from 'react-icons/io5';
import styles from './ConfirmDialog.module.css';

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
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <IoWarningOutline size={48} className={styles.icon} />
        <p className={styles.title}>{title}</p>
        {description && <p className={styles.description}>{description}</p>}
        {errorMessage && <p className={styles.errorText}>{errorMessage}</p>}

        <div className={styles.buttonRow}>
          <button className={styles.cancelBtn} onClick={onCancel} disabled={isLoading}>
            {cancelText}
          </button>
          <button className={styles.confirmBtn} onClick={onConfirm} disabled={isLoading}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};