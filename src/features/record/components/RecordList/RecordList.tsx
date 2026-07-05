import styles from "./RecordList.module.css";
import DateSection from "../DateSection";
import RecordCard from "../RecordCard";
import type { RecordType } from "../RecordCard";

interface Record {
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
        title: "투썸플레이스 신봉점",
        category: "카페/디저트",
        amount: 6100,
        type: "saved",
      },
      {
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
        title: "무신사",
        category: "패션",
        amount: 35000,
        type: "saved",
      },
    ],
  },
];

export default function RecordList() {
  return (
    <div className={styles.container}>
      {mockData.map((group) => (
        <DateSection key={group.date} date={group.date}>
          {group.records.map((record, index) => (
            <RecordCard
              key={index}
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
