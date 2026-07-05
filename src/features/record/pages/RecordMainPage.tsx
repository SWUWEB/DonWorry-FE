import Header from "@/components/Header";
import SummaryCard from "@/features/record/components/SummaryCard";
import FilterChip from "@/features/record/components/FilterChip";
import RecordList from "@/features/record/components/RecordList";
import styles from "../styles/RecordMainPage.module.css";

export default function RecordMainPage() {
    return (
        <div className={styles.container}>
          <Header title="소비 기록" />
    
          <SummaryCard />
          
          <div className={styles.filterSection}>
                <FilterChip label="전체" selected />
                <FilterChip label="참은 소비" />
                <FilterChip label="소비" />
            </div>
          
          {/* Record List */}
          <RecordList />

        </div>
      );
}
