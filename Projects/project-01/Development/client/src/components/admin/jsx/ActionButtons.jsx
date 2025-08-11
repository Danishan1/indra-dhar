import styles from "../css/ActionButtons.module.css";
import Button from "../../common/jsx/Button";

export default function ActionButtons({ onAction }) {
  const actions = [
    { label: "Create New Phase", id: "create-phase", variant: "primary" },
    { label: "Update Phase", id: "update-phase", variant: "secondary" },
    { label: "Delete Phase", id: "delete-phase", variant: "danger" },
    { label: "View Phase", id: "view-phase", variant: "primary" },
    { label: "Create User", id: "create-user", variant: "primary" },
    { label: "View User", id: "view-user", variant: "primary" },
    { label: "Update User", id: "update-user", variant: "secondary" },
    { label: "Delete User", id: "delete-user", variant: "danger" },
    { label: "View Form", id: "view-item-form", variant: "primary" },
    { label: "Create Item Form", id: "create-item-form", variant: "primary" },
    { label: "View Dashboard", id: "view-dashboard", variant: "secondary" },
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
