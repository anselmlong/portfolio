import Link from "next/link";
import { viewfinderFonts } from "./_home/fonts";
import styles from "./blog/blog.module.css";

export default function NotFound() {
  return (
    <div className={`${viewfinderFonts} ${styles.root}`}>
      <main className={`${styles.wrap} ${styles.mast}`}>
        <span className={styles.mono}>404 · nothing in frame</span>
        <h1 aria-label="Not found">
          {"LOST".split("").map((c, i) => (
            <span key={i} aria-hidden="true">
              {c}
            </span>
          ))}
          <span className={styles.dot} aria-hidden="true">
            .
          </span>
        </h1>
        <p>
          That page doesn&apos;t exist, or it moved. Try the chat, or the
          writing.
        </p>
        <p>
          <Link className={styles.go} href="/">
            Back to the chat →
          </Link>{" "}
          <Link className={styles.mono} href="/blog">
            all writing
          </Link>
        </p>
      </main>
    </div>
  );
}
