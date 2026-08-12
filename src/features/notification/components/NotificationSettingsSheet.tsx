import { useState } from 'react'
import { notificationApi } from '../api/notificationApi'
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
  const [enabled, setEnabled] = useState<SubSettings>({
    general: true,
    goal: true,
    retrial: true,
  })
  const [allOn, setAllOn] = useState(true)

  const toggleAll = () => {
    const next = !allOn
    setAllOn(next)
    setEnabled({ general: next, goal: next, retrial: next })
    notificationApi.updateAllSetting(next).catch(() => {})
  }

  const toggle = (id: keyof SubSettings) => {
    const next = { ...enabled, [id]: !enabled[id] }
    setEnabled(next)
    notificationApi.updateSubSettings(next).catch(() => {})
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
