import styles from "./SummaryCard.module.css";
import legendBg from "@/assets/legend-bg.svg";

export default function SummaryCard() {
  // 하드코딩됨. API 연결 시 수정 예정
  return (
    <section className={styles.summary}>
      <div className={styles.card}>
        <div className={styles.left}>
          <p className={styles.title}>소비 vs 참은 소비</p>

          <h2 className={styles.price}>+96,500원</h2>

          <div className={styles.legendWrapper}>
            <img
              src={legendBg}
              alt=""
              className={styles.legendBg}
            />

            <div className={styles.legend}>
              <div className={styles.legendItem}>
                <div className={styles.leftItem}>
                  <span className={`${styles.dot} ${styles.save}`} />
                  <span>참았어요</span>
                </div>

                <span className={styles.percent}>65%</span>
              </div>

              <div className={styles.legendItem}>
                <div className={styles.leftItem}>
                  <span className={`${styles.dot} ${styles.consume}`} />
                  <span>샀어요</span>
                </div>

                <span className={styles.percent}>35%</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.chart}>
          Chart
        </div>
      </div>
    </section>
  );
}
