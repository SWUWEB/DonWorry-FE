import { useParams } from "react-router-dom";
import Header from "@/components/Header";

export default function RecordDetailPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <Header title="소비 상세" />
      <p>id: {id}</p>
    </div>
  );
}
