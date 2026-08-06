import { useState } from 'react';
import { FaCopy } from "react-icons/fa";
import { formatKRW } from '@/shared/utils/currency';
import styles from './InfoBox.module.css';

interface InfoBoxProps {
  price: number;
  reason?: string;
  link?: string;
}

export const InfoBox = ({ price, reason, link }: InfoBoxProps) => {
  const [copied, setCopied] = useState(false);
  const [linkError, setLinkError] = useState(false);

  const handleCopy = async () => {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setLinkError(false);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setLinkError(true);
      setCopied(false);
    }
  };

  return (
    <div className={styles.box}>
      <div className={styles.section}>
        <p className={styles.sectionLabel}>상품 가격</p>
        <p className={styles.price}>
          {formatKRW(price)}
        </p>
      </div>

      <div className={styles.section}>
        <p className={styles.sectionLabel}>사고 싶은 이유</p>
        <p className={styles.reasonText}>{reason || '작성한 이유가 없습니다.'}</p>
      </div>

      {link && (
        <div className={`${styles.section} ${styles.divider}`}>
          <p className={styles.sectionLabel}>상품 링크</p>
          <div className={styles.linkRow}>
            <a href={link} target="_blank" rel="noreferrer" className={styles.linkText}>
              {link}
            </a>
            <button className={styles.copyBtn} onClick={handleCopy} aria-label="링크 복사">
              <FaCopy size={15} />
            </button>
          </div>
          {linkError && <p className={styles.errorText}>상품 링크를 복사하지 못했습니다.</p>}
          {copied && <p className={styles.errorText} style={{ color: '#008D02' }}>상품 링크가 복사되었습니다.</p>}
        </div>
      )}
    </div>
  );
};