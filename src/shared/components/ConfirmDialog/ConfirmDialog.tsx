import type { ReactNode } from 'react'
import { IoCheckmarkCircleOutline, IoWarningOutline } from 'react-icons/io5'
import { useRef, useEffect } from 'react'
import styles from './ConfirmDialog.module.css'

type DialogVariant = 'warning' | 'success' | 'none'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  description?: string
  cancelText?: string
  confirmText?: string
  isLoading?: boolean
  errorMessage?: string
  onlyConfirm?: boolean
  onCancel: () => void
  onConfirm: () => void
  variant?: DialogVariant
  /** variant 아이콘 대신 사용할 커스텀 아이콘 (예: 로그아웃 아이콘) */
  icon?: ReactNode
}

const VARIANT_ICON = {
  warning: { Icon: IoWarningOutline, className: styles.iconWarning },
  success: { Icon: IoCheckmarkCircleOutline, className: styles.iconSuccess },
  none: null,
}

export const ConfirmDialog = ({
  isOpen,
  title,
  description,
  cancelText = '취소',
  confirmText = '확인',
  isLoading = false,
  errorMessage,
  onlyConfirm = false,
  variant = 'warning',
  icon,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const primaryBtnRef = useRef<HTMLButtonElement>(null)
  const triggerElementRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (isOpen) {
      triggerElementRef.current = document.activeElement as HTMLElement
      primaryBtnRef.current?.focus()
    } else if (triggerElementRef.current) {
      triggerElementRef.current.focus()
      triggerElementRef.current = null
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (!isLoading) onCancel()
        return
      }

      if (e.key === 'Tab' && cardRef.current) {
        const focusables = cardRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        )
        if (focusables.length === 0) return

        const first = focusables[0]
        const last = focusables[focusables.length - 1]

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, isLoading, onCancel])

  if (!isOpen) return null

  const iconConfig = VARIANT_ICON[variant]

  return (
    <div className={styles.overlay}>
      <div
        className={styles.card}
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby={description ? 'confirm-dialog-description' : undefined}
      >
        {icon ??
          (iconConfig && (
            <iconConfig.Icon size={48} className={iconConfig.className} aria-hidden="true" />
          ))}
        <p className={styles.title} id="confirm-dialog-title">
          {title}
        </p>
        {description && (
          <p className={styles.description} id="confirm-dialog-description">
            {description}
          </p>
        )}
        {errorMessage && (
          <p className={styles.errorText} role="alert">
            {errorMessage}
          </p>
        )}

        <div className={styles.buttonRow}>
          {!onlyConfirm && (
            <button
              className={styles.cancelBtn}
              ref={primaryBtnRef}
              onClick={onCancel}
              disabled={isLoading}
            >
              {cancelText}
            </button>
          )}
          <button
            className={styles.confirmBtn}
            ref={onlyConfirm ? primaryBtnRef : undefined}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
