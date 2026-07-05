import { useParams } from 'react-router-dom'
import Header from '@/components/Header'

export default function RecordDetailPage() {
  const { id } = useParams<{ id: string }>()

  // 하드코딩됨. API 연결 시 id로 상세 데이터 조회하도록 수정 예정
  return (
    <div>
      <Header title="소비 상세" />
      <p>id: {id}</p>
    </div>
  )
}
