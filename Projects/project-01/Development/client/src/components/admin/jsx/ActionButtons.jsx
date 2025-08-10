import styles from "../css/ActionButtons.module.css";
import Button from "../../common/jsx/Button";

export default function ActionButtons({ onAction }) {
  const actions = [
    { label: "Create New Phase", id: "createPhase", variant: "primary" },
    { label: "Update Phase", id: "updatePhase", variant: "secondary" },
    { label: "Delete Phase", id: "deletePhase", variant: "danger" },
    { label: "Create User", id: "createUser", variant: "primary" },
    { label: "Update User", id: "updateUser", variant: "secondary" },
    { label: "Delete User", id: "deleteUser", variant: "danger" },
    { label: "Create Item Form", id: "createItemForm", variant: "primary" },
    { label: "View Dashboard", id: "viewDashboard", variant: "secondary" },
  ];

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
