import { useState, useEffect } from 'react'
import {
  useNotificationSettings,
  useUpdateAllSetting,
  useUpdateSubSettings,
} from '../hooks/useNotifications'
import styles from './NotificationSettingsSheet.module.css'

const SETTINGS_LIST = [
  {
    id: 'retrial' as const,
    label: '유혹 관리 알림',
    description: '위시리스트 추가, 대기 시간 종료 등 유혹 관리 알림',
    dotColor: '#D97706',
  },
  {
    id: 'goal' as const,
    label: '목표 현황 알림',
    description: '절약 목표 금액 도달 및 진행 상황 알림',
    dotColor: '#059669',
  },
  {
    id: 'general' as const,
    label: '일반 알림',
    description: '월간 리포트, 공지사항 등 서비스 소식',
    dotColor: '#7C3AED',
  },
]

type SubSettings = { general: boolean; goal: boolean; retrial: boolean }

interface Props {
  onClose: () => void
}

export default function NotificationSettingsSheet({ onClose }: Props) {
  const { data: serverSettings } = useNotificationSettings()
  const { mutate: updateAll, isPending: isUpdatingAll } = useUpdateAllSetting()
  const { mutate: updateSub, isPending: isUpdatingSub } = useUpdateSubSettings()

  // 서버가 동시 요청에 409를 반환하므로, 요청이 끝날 때까지 토글을 잠급니다.
  const isSaving = isUpdatingAll || isUpdatingSub

  const [enabled, setEnabled] = useState<SubSettings>({
    general: true,
    goal: true,
    retrial: true,
  })
  const [saveError, setSaveError] = useState(false)

  useEffect(() => {
    if (serverSettings) {
      const { general, goal, retrial } = serverSettings
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEnabled({ general, goal, retrial })
    }
  }, [serverSettings])

  const allOn = enabled.general && enabled.goal && enabled.retrial

  // 저장에 실패하면 화면만 바뀐 채 서버와 어긋나므로 이전 값으로 되돌립니다.
  const rollbackTo = (prev: SubSettings) => () => {
    setEnabled(prev)
    setSaveError(true)
  }

  const toggle = (id: keyof SubSettings) => {
    if (isSaving) return
    const prev = enabled
    const next = { ...enabled, [id]: !enabled[id] }
    setEnabled(next)
    setSaveError(false)
    updateSub(next, { onError: rollbackTo(prev) })
  }

  // 전체 알림은 notifyPushEnabled만 보내야 하므로 세부 설정과 같은 요청에 담지 않습니다.
  const toggleAll = () => {
    if (isSaving) return
    const prev = enabled
    const next = !allOn
    setEnabled({ general: next, goal: next, retrial: next })
    setSaveError(false)
    updateAll(next, { onError: rollbackTo(prev) })
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.sheet} onClick={(e) => e.stopPropagation()}>
        <div className={styles.handle} />
        <h2 className={styles.title}>어떤 알림을 받을까요?</h2>

        {saveError && (
          <p className={styles.errorText} role="alert">
            설정을 저장하지 못했어요. 잠시 후 다시 시도해주세요.
          </p>
        )}

        <div className={styles.masterItem}>
          <span className={styles.masterLabel}>전체 알림</span>
          <button
            className={`${styles.toggle} ${allOn ? styles.on : ''}`}
            onClick={toggleAll}
            disabled={isSaving}
            aria-label={`전체 알림 ${allOn ? '끄기' : '켜기'}`}
          >
            <span className={styles.toggleThumb} />
          </button>
        </div>

        <ul className={styles.list}>
          {SETTINGS_LIST.map((item) => (
            <li key={item.id} className={styles.item}>
              <span className={styles.dot} style={{ background: item.dotColor }} />
              <div className={styles.textWrap}>
                <span className={styles.label}>{item.label}</span>
                <span className={styles.desc}>{item.description}</span>
              </div>
              <button
                className={`${styles.toggle} ${enabled[item.id] ? styles.on : ''}`}
                onClick={() => toggle(item.id)}
                disabled={isSaving}
                aria-label={`${item.label} ${enabled[item.id] ? '끄기' : '켜기'}`}
              >
                <span className={styles.toggleThumb} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
