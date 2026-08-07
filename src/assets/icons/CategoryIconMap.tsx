import { type CSSProperties } from 'react'
import { type IconType } from 'react-icons'
import { FaShoppingCart } from 'react-icons/fa'
import { FaBowlFood } from 'react-icons/fa6'
import { GiLipstick } from 'react-icons/gi'
import { IoIosCafe } from 'react-icons/io'
import { RiBearSmileFill } from 'react-icons/ri'
import { BsLightningFill, BsFillSuitcaseFill } from 'react-icons/bs'
import { PiHeartbeatFill } from 'react-icons/pi'
import { HiDotsHorizontal } from 'react-icons/hi'

import type { Category } from '@/features/temptation/types'

interface CategoryIconEntry {
  Icon: IconType
  style?: CSSProperties
  ratio?: number
}

export const CATEGORY_ICON_MAP: Record<Category, CategoryIconEntry> = {
  패션: { Icon: FaShoppingCart },
  뷰티: {
    Icon: GiLipstick,
    ratio: 0.65,
  },
  음식: { Icon: FaBowlFood },
  '카페/디저트': {
    Icon: IoIosCafe,
    ratio: 0.67,
  },
  '취미/굿즈': {
    Icon: RiBearSmileFill,
    ratio: 0.65,
  },
  전자기기: { Icon: BsLightningFill },
  '건강/운동': {
    Icon: PiHeartbeatFill,
    ratio: 0.65,
  },
  여행: {
    Icon: BsFillSuitcaseFill,
    style: { transform: 'scaleY(0.8)' },
    ratio: 0.7,
  },
  기타: {
    Icon: HiDotsHorizontal,
    ratio: 0.65,
  },
}
