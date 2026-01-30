import React from "react";
import styles from "./ScreenOverlay.module.scss";

type ScreenOverlayProps =
    | {
          className?: string;
          children: React.ReactNode;
          left?: never;
          right?: never;
          top?: never;
      }
    | {
          className?: string;
          children?: never;
          top?: React.ReactNode;
          left: React.ReactNode;
          right: React.ReactNode;
      };

export const ScreenOverlay = ({
    children,
    left,
    right,
    top,
    className,
}: ScreenOverlayProps) => {
    // Prevent the page behind from scrolling; keep scrolling inside the screen.
    React.useEffect(() => {
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, []);

    return (
        <section className={className ? `${styles.root} ${className}` : styles.root}>
            <div className={styles.viewport}>
                {left != null && right != null ? (
                    <div className={styles.grid}>
                        {top != null ? <div className={styles.top}>{top}</div> : null}
                        <div className={`${styles.col} ${styles.left}`}>{left}</div>
                        <div className={`${styles.col} ${styles.right}`}>{right}</div>
                    </div>
                ) : (
                    <div className={styles.body}>{children}</div>
                )}
            </div>
        </section>
    );
};
