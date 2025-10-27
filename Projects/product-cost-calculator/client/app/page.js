import styles from "./page.module.css";

export default function HomePage() {
  return (
    <section className={styles.wrapper}>
      <div className={styles.heroCard}>
        <h1>Production Cost Calculator</h1>
        <p>Track, analyze, and optimize your production costs efficiently.</p>
        <div className={styles.actions}>
          <a href="/login" className={styles.primaryBtn}>Login</a>
          <a href="/register" className={styles.secondaryBtn}>Register</a>
        </div>
      </div>
    </section>
  );
}
