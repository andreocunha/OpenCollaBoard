import styles from "@/styles/components/CardBoard.module.css";

interface CardBoardProps {
  title?: string;
  createdAt?: string;
  onClick?: () => void;
}

export function CardBoard({ title, createdAt, onClick }: CardBoardProps) {
  return (
    <div className={styles.cardBoard} onClick={onClick}>
      <img src={title ? "/board-dark.png" : "/shimmer.gif"} alt="Board" width="100%" height={120} />

      <div className={styles.cardBoardInfo}>
        <h2>{title ? title : '...'}</h2>
        <p>{createdAt ? createdAt : '...'}</p>
      </div>
    </div>
  )
}