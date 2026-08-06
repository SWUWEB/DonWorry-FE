import DonutChart from './DonutChart'
import CategoryItem from './CategoryItem'
import styles from './ConsumptionReportForm.module.css'
import SavingStatusCard from './SavingStatusCard'
import SavingCategoryItem from './SavingCategoryItem'

export default function ConsumptionReportForm() {
  return (
    <div className={styles.wrapper}>

      {/* 월 선택 */}
      <button
        type="button"
        className={styles.monthButton}
      >
        <span>2026년 5월</span>

        <span className={styles.arrow}>
          ▼
        </span>
      </button>

      {/* 총 소비 요약 */}
      <section className={styles.card}>
        <h2 className={styles.cardTitle}>
          총 소비 요약
        </h2>

        <div className={styles.summaryContent}>
          <DonutChart />

          <div className={styles.legend}>
            <CategoryItem
              color="#D9D9D9"
              name="식비"
              amount="200,000원"
              percent="33%"
            />

            <CategoryItem
              color="#D9D9D9"
              name="교통"
              amount="150,000원"
              percent="25%"
            />

            <CategoryItem
              color="#D9D9D9"
              name="여가"
              amount="120,000원"
              percent="20%"
            />

            <CategoryItem
              color="#D9D9D9"
              name="쇼핑"
              amount="80,000원"
              percent="13%"
           />

            <CategoryItem
              color="#D9D9D9"
              name="기타"
              amount="50,000원"
              percent="9%"
            />
          </div>
        </div>

      </section>

       {/* 통합 절약 현황 */}
      <section className={styles.card}>
        <SavingStatusCard />
      </section>


       {/* 나의 충동 소비 패턴 */}
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>
            나의 충동 소비 패턴
          </h2>

          <div className={styles.patternBox}>
            <div className={styles.patternCard}>
              <span className={styles.patternIcon}>⏰</span>

              <div className={styles.patternContent}>
                <p className={styles.patternTitle}>
                  가장 취약한 시간대는 금요일 밤 11시
                </p>

                <p className={styles.patternDescription}>
                  전체 지출의 40%가 금요일 심야에 발생했습니다.
                  이 시간대에는 쇼핑 앱 접속을 주의하세요.
                </p>
              </div>
            </div>

            <div className={styles.patternCard}>
              <span className={styles.patternIcon}>🔗</span>

              <div className={styles.patternContent}>
                <p className={styles.patternTitle}>
                  주요 충동 유입 경로는 인스타그램 URL
                </p>

                <p className={styles.patternDescription}>
                  기록된 소비 시도 중 SNS 링크를 통한 유입이
                  압도적으로 많았습니다. 광고에 즉각적으로
                  반응하는 패턴을 보입니다.
                </p>
              </div>
            </div>
          </div>
        </section>


     {/* 카테고리별 소비 및 절약 요약 */}
      <section className={styles.card}>
        <h2 className={styles.cardTitle}>
          카테고리별 소비 및 절약 요약
        </h2>

        <SavingCategoryItem
          icon="🍔"
          name="배달 / 외식"
          defense={85}
          saved="102,000"
          spent="18,000"
        />

         <SavingCategoryItem
           icon="👗"
           name="패션 / 잡화"
           defense={50}
           saved="80,000"
           spent="80,000"
         />

        <SavingCategoryItem
          icon="🎮"
          name="취미 / 게임"
          defense={100}
          saved="163,000"
          spent="0"
        />
      </section>
    </div>
  )
}