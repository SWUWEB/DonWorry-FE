import { beforeEach, describe, expect, it } from 'vitest'
import { clearOnboardingDraft, getOnboardingDraft, saveOnboardingDraft } from './onboardingSession'

describe('onboardingSession', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('저장된 값이 없으면 빈 객체를 반환한다', () => {
    expect(getOnboardingDraft()).toEqual({})
  })

  it('저장한 값을 그대로 읽어온다', () => {
    saveOnboardingDraft({ purposeId: 'invest', amount: 500000 })

    expect(getOnboardingDraft()).toEqual({ purposeId: 'invest', amount: 500000 })
  })

  it('여러 번 저장하면 기존 값과 병합된다', () => {
    saveOnboardingDraft({ interests: [{ id: '1', emoji: '🍔', label: '음식' }] })
    saveOnboardingDraft({ purposeId: 'invest', purposeLabel: '투자' })

    expect(getOnboardingDraft()).toEqual({
      interests: [{ id: '1', emoji: '🍔', label: '음식' }],
      purposeId: 'invest',
      purposeLabel: '투자',
    })
  })

  it('같은 키로 다시 저장하면 새 값으로 덮어쓴다', () => {
    saveOnboardingDraft({ amount: 100000 })
    saveOnboardingDraft({ amount: 300000 })

    expect(getOnboardingDraft().amount).toBe(300000)
  })

  it('clearOnboardingDraft 호출 후에는 다시 빈 객체를 반환한다', () => {
    saveOnboardingDraft({ purposeId: 'save' })
    clearOnboardingDraft()

    expect(getOnboardingDraft()).toEqual({})
  })

  it('sessionStorage에 손상된 JSON이 들어있어도 빈 객체를 반환한다', () => {
    sessionStorage.setItem('onboarding_draft', '{invalid json')

    expect(getOnboardingDraft()).toEqual({})
  })
})
