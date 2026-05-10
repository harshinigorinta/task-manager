import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProject, createTask, updateTask, deleteTask, addMember } from '../api';
import { useAuth } from '../context/AuthContext';

const STATUS_COLS = ['TODO', 'IN_PROGRESS', 'DONE'];
const STATUS_LABELS = { TODO: 'To do', IN_PROGRESS: 'In progress', DONE: 'Done' };

export default function ProjectDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [taskForm, setTaskForm] = useState({ title: '', description: '', assigneeId: '', dueDate: '', priority: 'MEDIUM' });
  const [memberEmail, setMemberEmail] = useState('');
  const [error, setError] = useState('');

  const load = () => getProject(id).then(r => setProject(r.data)).catch(() => navigate('/dashboard'));
  useEffect(() => { load(); }, [id]);

  const myRole = project?.members?.find(m => m.user.id === user?.id)?.role;

  const handleCreateTask = async (e) => {
  e.preventDefault();
  setError('');
  try {
    const payload = {
      title: taskForm.title,
      description: taskForm.description || undefined,
      assigneeId: taskForm.assigneeId || undefined,
      priority: taskForm.priority,
      dueDate: taskForm.dueDate || undefined
    };
    await createTask(id, payload);
    setTaskForm({ title: '', description: '', assigneeId: '', dueDate: '', priority: 'MEDIUM' });
    setShowTaskForm(false);
    load();
  } catch (err) {
    setError(err.response?.data?.error || 'Failed to create task');
  }
};

  const handleStatusChange = async (taskId, status) => {
    try { await updateTask(taskId, { status }); load(); } catch {}
  };

  const handleDeleteTask = async (taskId) => {
    try { await deleteTask(taskId); load(); } catch {}
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await addMember(id, { email: memberEmail, role: 'MEMBER' });
      setMemberEmail('');
      setShowMemberForm(false);
      load();
    } catch { setError('User not found or already a member'); }
  };

  if (!project) return <div style={{ padding: '2rem' }}>Loading...</div>;

  const tasksByStatus = STATUS_COLS.reduce((acc, s) => {
    acc[s] = project.tasks?.filter(t => t.status === s) || [];
    return acc;
  }, {});

  return (
    <div style={styles.page}>
      <div style={styles.nav}>
        <button style={styles.back} onClick={() => navigate('/dashboard')}>← Back</button>
        <span style={styles.logo}>{project.name}</span>
        <span style={styles.role}>{myRole}</span>
      </div>

      <div style={styles.body}>
        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.topBar}>
          <h2 style={styles.heading}>{project.name}</h2>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button style={styles.btn} onClick={() => setShowTaskForm(!showTaskForm)}>+ Add task</button>
            {myRole === 'ADMIN' && <button style={styles.btnOutline} onClick={() => setShowMemberForm(!showMemberForm)}>+ Add member</button>}
          </div>
        </div>

        {showTaskForm && (
          <form onSubmit={handleCreateTask} style={styles.form}>
            <input style={styles.input} placeholder="Task title *" value={taskForm.title}
              onChange={e => setTaskForm({ ...taskForm, title: e.target.value })} />
            <input style={styles.input} placeholder="Description" value={taskForm.description}
              onChange={e => setTaskForm({ ...taskForm, description: e.target.value })} />
            <select style={styles.input} value={taskForm.assigneeId}
              onChange={e => setTaskForm({ ...taskForm, assigneeId: e.target.value })}>
              <option value="">Assign to...</option>
              {project.members?.map(m => <option key={m.user.id} value={m.user.id}>{m.user.name}</option>)}
            </select>
            <select style={styles.input} value={taskForm.priority}
              onChange={e => setTaskForm({ ...taskForm, priority: e.target.value })}>
              <option value="LOW">Low priority</option>
              <option value="MEDIUM">Medium priority</option>
              <option value="HIGH">High priority</option>
            </select>
            <input style={styles.input} type="date" value={taskForm.dueDate}
              onChange={e => setTaskForm({ ...taskForm, dueDate: e.target.value })} />
            <button style={styles.btn} type="submit">Create task</button>
          </form>
        )}

        {showMemberForm && (
          <form onSubmit={handleAddMember} style={styles.form}>
            <input style={styles.input} placeholder="Member email" value={memberEmail}
              onChange={e => setMemberEmail(e.target.value)} />
            <button style={styles.btn} type="submit">Add member</button>
          </form>
        )}

        <div style={styles.board}>
          {STATUS_COLS.map(status => (
            <div key={status} style={styles.col}>
              <div style={styles.colHeader}>
                <span>{STATUS_LABELS[status]}</span>
                <span style={styles.colCount}>{tasksByStatus[status].length}</span>
              </div>
              {tasksByStatus[status].map(task => (
                <div key={task.id} style={styles.taskCard}>
                  <div style={styles.taskTitle}>{task.title}</div>
                  {task.description && <div style={styles.taskDesc}>{task.description}</div>}
                  {task.assignee && <div style={styles.taskMeta}>👤 {task.assignee.name}</div>}
                  {task.dueDate && <div style={styles.taskMeta}>📅 {new Date(task.dueDate).toLocaleDateString()}</div>}
                  <div style={styles.taskMeta}>
                    <span style={{ ...styles.priority, background: task.priority === 'HIGH' ? '#fff0f0' : task.priority === 'LOW' ? '#f0fff4' : '#fff8f0', color: task.priority === 'HIGH' ? '#e53e3e' : task.priority === 'LOW' ? '#38a169' : '#dd6b20' }}>{task.priority}</span>
                  </div>
                  <select style={styles.statusSelect} value={task.status}
                    onChange={e => handleStatusChange(task.id, e.target.value)}>
                    <option value="TODO">To do</option>
                    <option value="IN_PROGRESS">In progress</option>
                    <option value="DONE">Done</option>
                  </select>
                  {myRole === 'ADMIN' && (
                    <button style={styles.deleteBtn} onClick={() => handleDeleteTask(task.id)}>Delete</button>
                  )}
                </div>
              ))}
              {tasksByStatus[status].length === 0 && <div style={styles.empty}>No tasks</div>}
            </div>
          ))}
        </div>

        <div style={styles.members}>
          <h3 style={styles.sectionTitle}>Team members</h3>
          {project.members?.map(m => (
            <div key={m.id} style={styles.memberItem}>
              <span>{m.user.name} — {m.user.email}</span>
              <span style={styles.roleTag}>{m.role}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#f5f5f5' },
  nav: { background: '#fff', padding: '1rem 2rem', display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid #eee' },
  back: { background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '14px', color: '#6c63ff' },
  logo: { fontWeight: '600', fontSize: '18px', flex: 1 },
  role: { fontSize: '12px', background: '#f0eeff', color: '#6c63ff', padding: '4px 10px', borderRadius: '99px' },
  body: { maxWidth: '1100px', margin: '0 auto', padding: '2rem 1rem' },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  heading: { margin: 0, fontSize: '20px' },
  btn: { padding: '8px 16px', background: '#6c63ff', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' },
  btnOutline: { padding: '8px 16px', background: 'transparent', color: '#6c63ff', border: '1px solid #6c63ff', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' },
  form: { background: '#fff', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', gap: '8px', flexWrap: 'wrap', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  input: { padding: '8px 12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', flex: 1, minWidth: '150px' },
  board: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '2rem' },
  col: { background: '#fff', borderRadius: '12px', padding: '1rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  colHeader: { display: 'flex', justifyContent: 'space-between', fontWeight: '500', marginBottom: '1rem', fontSize: '14px' },
  colCount: { background: '#f0eeff', color: '#6c63ff', borderRadius: '99px', padding: '2px 8px', fontSize: '12px' },
  taskCard: { border: '1px solid #eee', borderRadius: '10px', padding: '10px', marginBottom: '10px' },
  taskTitle: { fontWeight: '500', fontSize: '14px', marginBottom: '4px' },
  taskDesc: { fontSize: '12px', color: '#888', marginBottom: '4px' },
  taskMeta: { fontSize: '12px', color: '#888', marginBottom: '4px' },
  priority: { fontSize: '11px', padding: '2px 8px', borderRadius: '99px', fontWeight: '500' },
  statusSelect: { width: '100%', padding: '4px 8px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '12px', marginTop: '6px' },
  deleteBtn: { marginTop: '6px', background: 'transparent', border: 'none', color: '#e53e3e', cursor: 'pointer', fontSize: '12px' },
  empty: { fontSize: '13px', color: '#ccc', textAlign: 'center', padding: '1rem 0' },
  members: { background: '#fff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  sectionTitle: { margin: '0 0 1rem', fontSize: '16px' },
  memberItem: { display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f5f5f5', fontSize: '14px' },
  roleTag: { fontSize: '11px', background: '#f0eeff', color: '#6c63ff', padding: '2px 8px', borderRadius: '99px' },
  error: { background: '#fff0f0', color: '#e53e3e', padding: '10px', borderRadius: '8px', marginBottom: '12px', fontSize: '14px' },
};