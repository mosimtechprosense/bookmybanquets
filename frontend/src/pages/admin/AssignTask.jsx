import { useState } from "react";
import { assignTask } from "../../api/task.api";

export default function AssignTask({ leadId }) {
  const [managerId, setManagerId] = useState("");
  const [date, setDate] = useState("");

  const submit = async () => {
    await assignTask({
      banquet_inquiry_id: leadId,
      manager_id: managerId,
      assignedForDate: date
    });
    alert("Task assigned");
  };

  return (
    <div>
      <h3>Assign Task</h3>

      <input
        placeholder="Manager ID"
        onChange={e => setManagerId(e.target.value)}
      />

      <input
        type="date"
        onChange={e => setDate(e.target.value)}
      />

      <button onClick={submit}>Assign</button>
    </div>
  );
}
