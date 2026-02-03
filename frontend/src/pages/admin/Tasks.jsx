import { useEffect, useState } from "react";
import { fetchTasks } from "../../api/task.api";
import { useNavigate } from "react-router-dom";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks().then(res => setTasks(res.data));
  }, []);

  return (
    <div>
      <h2>Tasks</h2>

      <table>
        <thead>
          <tr>
            <th>Lead</th>
            <th>Manager</th>
            <th>Date</th>
            <th>Status</th>
            <th>View</th>
          </tr>
        </thead>

        <tbody>
          {tasks.map(t => (
            <tr key={t.id}>
              <td>{t.lead.name || t.lead.phone}</td>
              <td>{t.manager.name}</td>
              <td>{new Date(t.assignedForDate).toDateString()}</td>
              <td>{t.status}</td>
              <td>
                <button onClick={() => navigate(`/admin/tasks/${t.id}`)}>
                  👁
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
