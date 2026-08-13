import { CATEGORY_ICON_MAP } from './CategoryIconMap.tsx'
import type { Category } from '@/features/temptation/types'

interface CategoryIconProps {
  category: Category
  size?: number
  className?: string
}

const DEFAULT_CIRCLE_SIZE = 45
const ICON_RATIO = 0.6

export const CategoryIcon = ({
  category,
  size = DEFAULT_CIRCLE_SIZE,
  className,
}: CategoryIconProps) => {
  const { Icon, style, ratio = ICON_RATIO } = CATEGORY_ICON_MAP[category]
  const iconSize = size * ratio

  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: '#389698',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <Icon size={iconSize} color={'#F7FBFA'} style={style} />
    </div>
  )
}
