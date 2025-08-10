import ActionButtons from "../../admin/jsx/ActionButtons";

export const AdminActions = () => {
  return (
    <div>
      <h1>Admin Actions</h1>
      <ActionButtons onAction={(action) => console.log(action)} />
    </div>
  );
};
