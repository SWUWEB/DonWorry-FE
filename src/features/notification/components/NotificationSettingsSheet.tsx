import { useState, useEffect } from 'react'
import { useNotificationSettings, useUpdateNotificationSettings } from '../hooks/useNotifications'
import styles from './NotificationSettingsSheet.module.css'

const SETTINGS_LIST = [
  {
    id: 'all' as const,
    label: '전체 알림',
    description: '유혹 관리, 목표 달성 및 일반 알림',
    dotColor: '#C7E3E3',
  },
  {
    id: 'general' as const,
    label: '일반 알림',
    description: '월간 리포트, 공지사항 등 서비스 소식',
    dotColor: '#9CA4A3',
  },
  {
    id: 'goal' as const,
    label: '목표 현황 알림',
    description: '절약 목표 금액 도달 및 진행 상황 알림',
    dotColor: '#B8B5E8',
  },
  {
    id: 'retrial' as const,
    label: '재판단 알림',
    description: '대기 시간이 끝난 상품의 재단판 알림',
    dotColor: '#F5E7A2',
  },
]

interface Props {
  onClose: () => void
}

export default function NotificationSettingsSheet({ onClose }: Props) {
  const { data: serverSettings } = useNotificationSettings()
  const { mutate: updateSettings } = useUpdateNotificationSettings()

  const [enabled, setEnabled] = useState({
    all: true, general: true, goal: true, retrial: true,
  })

  useEffect(() => {
    if (serverSettings) setEnabled(prev => ({ ...prev, ...serverSettings }))
  }, [serverSettings])

  const toggle = (id: keyof typeof enabled) => {
    const next = { ...enabled, [id]: !enabled[id] }
    setEnabled(next)
    // TODO: API 연결 시 주석 해제
    // updateSettings(next)
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.sheet} onClick={e => e.stopPropagation()}>
        <div className={styles.handle} />
        <h2 className={styles.title}>어떤 알림을 받을까요?</h2>
        <ul className={styles.list}>
          {SETTINGS_LIST.map(item => (
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
