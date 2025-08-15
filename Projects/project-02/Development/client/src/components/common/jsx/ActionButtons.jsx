import styles from "../css/ActionButtons.module.css";
import Button from "./Button";

export default function ActionButtons({ actions = [], onAction }) {
  return (
    <div className={styles.container}>
      {actions.map((action) => (
        <Button
          key={action.id}
          variant={action.variant}
          onClick={() => onAction(action.id)}
        >
          {action.label}
        </Button>
      ))}
    </div>
  );
}
