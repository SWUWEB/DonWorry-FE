import styles from "./DateSection.module.css";

interface DateSectionProps {
  date: string;
  children: React.ReactNode;
}

export default function DateSection({
  date,
  children,
}: DateSectionProps) {
  return (
    <section className={styles.section}>
      <h2 className={styles.date}>{date}</h2>

      <div className={styles.list}>
        {children}
      </div>
    </section>
  );
}
