import styles from "./RecordList.module.css";
import DateSection from "../DateSection";
import RecordCard from "../RecordCard";
import type { RecordType } from "../RecordCard";

export type FilterValue = "all" | RecordType;

interface Record {
  id: string;
  title: string;
  category: string;
  amount: number;
  type: RecordType;
  thumbnail?: string;
}

interface RecordGroup {
  date: string;
  records: Record[];
}

const mockData: RecordGroup[] = [
  {
    date: "2026년 4월 17일",
    records: [
      {
        id: "1",
        title: "투썸플레이스 신봉점",
        category: "카페/디저트",
        amount: 6100,
        type: "saved",
      },
      {
        id: "2",
        title: "ZARA 반팔티",
        category: "의류",
        amount: 23900,
        type: "consume",
      },
    ],
  },
  {
    date: "2026년 4월 14일",
    records: [
      {
        id: "3",
        title: "무신사",
        category: "패션",
        amount: 35000,
        type: "saved",
      },
    ],
  },
];

interface RecordListProps {
  filter: FilterValue;
}

export default function RecordList({ filter }: RecordListProps) {
  const filteredData = mockData
    .map((group) => ({
      ...group,
      records:
        filter === "all"
          ? group.records
          : group.records.filter((record) => record.type === filter),
    }))
    .filter((group) => group.records.length > 0);

  return (
    <div className={styles.container}>
      {filteredData.map((group) => (
        <DateSection key={group.date} date={group.date}>
          {group.records.map((record) => (
            <RecordCard
              key={record.id}
              id={record.id}
              title={record.title}
              category={record.category}
              amount={record.amount}
              type={record.type}
              thumbnail={record.thumbnail}
            />
          ))}
        </DateSection>
      ))}
    </div>
  );
}
