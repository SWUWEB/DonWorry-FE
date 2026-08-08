import { useState, useEffect } from 'react'
import { useNotificationSettings, useUpdateNotificationSettings } from '../hooks/useNotifications'
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
  const { mutate: updateSettings } = useUpdateNotificationSettings()

  const [enabled, setEnabled] = useState<SubSettings>({
    general: true,
    goal: true,
    retrial: true,
  })

  useEffect(() => {
    // 서버에서 저장된 알림 설정을 최초 로드 시 로컬 편집 상태로 반영 (사용자가 토글하는 별도 상태이므로 여기서만 동기화)
    if (serverSettings) {
      const { general, goal, retrial } = serverSettings
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEnabled({ general, goal, retrial })
    }
  }, [serverSettings])

  const allOn = enabled.general && enabled.goal && enabled.retrial

  const persist = (next: SubSettings) => {
    setEnabled(next)
    updateSettings({ ...next, all: next.general && next.goal && next.retrial })
  }

  const toggle = (id: keyof SubSettings) => {
    persist({ ...enabled, [id]: !enabled[id] })
  }

  const toggleAll = () => {
    const nextValue = !allOn
    persist({ general: nextValue, goal: nextValue, retrial: nextValue })
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.sheet} onClick={(e) => e.stopPropagation()}>
        <div className={styles.handle} />
        <h2 className={styles.title}>어떤 알림을 받을까요?</h2>

        <div className={styles.masterItem}>
          <span className={styles.masterLabel}>전체 알림</span>
          <button
            className={`${styles.toggle} ${allOn ? styles.on : ''}`}
            onClick={toggleAll}
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
