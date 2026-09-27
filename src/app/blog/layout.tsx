import Link from "next/link";
import { viewfinderFonts } from "~/app/_home/fonts";
import styles from "./blog.module.css";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${viewfinderFonts} ${styles.root}`}>
      <div className={styles.wrap}>
        <header className={styles.top}>
          <Link href="/" className={styles.me}>
            Anselm Long
          </Link>
          <nav aria-label="Site" className={styles.nav}>
            <Link href="/#work">Work</Link>
            <Link href="/projects">Projects</Link>
            <Link href="/blog" aria-current="page">
              Writing
            </Link>
            <a href="https://photos.anselmlong.com">Photos</a>
            <Link href="/">Chat</Link>
            <a
              href="/resume.pdf"
              download="Anselm-Long-Resume.pdf"
              className={styles.resume}
            >
              Resume ↓
            </a>
          </nav>
        </header>
      </div>
      {children}
    </div>
  );
}
