import {
  motion,
  AnimatePresence,
  useDragControls,
  useMotionValue,
  type PanInfo,
} from 'framer-motion'
import { useRef } from 'react'
import styles from './ProductAdd.module.css'

interface Props {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

export function BottomAdd({ isOpen, onClose, children }: Props) {
  const sheetRef = useRef<HTMLDivElement>(null)
  const dragControls = useDragControls()
  const y = useMotionValue(0)

  const handleDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const sheetHeight = sheetRef.current?.offsetHeight ?? 0
    const draggedRatio = y.get() / sheetHeight

    if (draggedRatio > 0.4 || info.velocity.y > 500) {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className={styles.sheet}
            ref={sheetRef}
            style={{ y }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            drag="y"
            dragListener={false}
            dragControls={dragControls}
            dragConstraints={{ top: 0 }}
            dragSnapToOrigin
            onDragEnd={handleDragEnd}
          >
            <div className={styles.handleArea} onPointerDown={(e) => dragControls.start(e)}>
              <div className={styles.handle} />
            </div>
            <div className={styles.content}>{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
