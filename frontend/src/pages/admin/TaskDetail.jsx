import { useEffect, useState } from "react";
import { fetchTaskById, submitTaskReport } from "../../api/task.api";
import { useParams } from "react-router-dom";

export default function TaskDetail() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [remark, setRemark] = useState("");

  useEffect(() => {
    fetchTaskById(id).then(res => setTask(res.data));
  }, [id]);

  const submit = async () => {
    await submitTaskReport(id, {
      remark,
      visitDate: new Date()
    });
    alert("Report submitted");
  };

  if (!task) return null;

  return (
    <div>
      <h2>Task Detail</h2>

      <p><b>Lead:</b> {task.lead.name}</p>
      <p><b>Manager:</b> {task.manager.name}</p>

      <textarea
        placeholder="Visit remark"
        value={remark}
        onChange={e => setRemark(e.target.value)}
      />

      <button onClick={submit}>Submit Report</button>

      <h3>Reports</h3>
      {task.reports.map(r => (
        <div key={r.id}>
          <p>{r.remark}</p>
          <small>{new Date(r.visitDate).toDateString()}</small>
        </div>
      ))}
    </div>
  );
}
