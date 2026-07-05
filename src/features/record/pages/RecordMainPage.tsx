import { useState } from "react";
import Header from "@/components/Header";
import SummaryCard from "@/features/record/components/SummaryCard";
import FilterChip from "@/features/record/components/FilterChip";
import RecordList from "@/features/record/components/RecordList";
import type { FilterValue } from "@/features/record/components/RecordList";
import styles from "../styles/RecordMainPage.module.css";

const FILTERS: { label: string; value: FilterValue }[] = [
  { label: "전체", value: "all" },
  { label: "참은 소비", value: "saved" },
  { label: "소비", value: "consume" },
];

export default function RecordMainPage() {
    const [filter, setFilter] = useState<FilterValue>("all");

    return (
        <div className={styles.container}>
          <Header title="소비 기록" />

          <SummaryCard />

          <div className={styles.filterSection}>
                {FILTERS.map((f) => (
                  <FilterChip
                    key={f.value}
                    label={f.label}
                    selected={filter === f.value}
                    onClick={() => setFilter(f.value)}
                  />
                ))}
            </div>

          {/* Record List */}
          <RecordList filter={filter} />

        </div>
      );
}
