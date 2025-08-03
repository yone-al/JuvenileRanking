import React from "react";
import Image from "next/image";
import styles from "./DecorationImages.module.css";

export function DecorationImages() {
  return (
    <>
      <div className={`${styles.decorationImage} ${styles.bottomLeft}`}>
        <Image
          src="/images/Apple.png"
          alt="リンゴの装飾画像"
          width={200}
          height={200}
          priority={false}
          loading="lazy"
          className={styles.image}
        />
      </div>
      <div className={`${styles.decorationImage} ${styles.topRight}`}>
        <Image
          src="/images/ApplePie.jpeg"
          alt="アップルパイの装飾画像"
          width={200}
          height={200}
          priority={false}
          loading="lazy"
          className={styles.image}
        />
      </div>
    </>
  );
}