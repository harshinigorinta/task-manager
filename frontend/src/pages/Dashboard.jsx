import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getDashboard, getProjects, createProject } from '../api';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, inProgress: 0, done: 0, overdue: [] });
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    getDashboard().then(r => setStats(r.data)).catch(() => {});
    getProjects().then(r => setProjects(r.data)).catch(() => {});
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await createProject(newProject);
      setProjects([...projects, res.data]);
      setNewProject({ name: '', description: '' });
      setShowForm(false);
    } catch {}
  };

  return (
    <div style={styles.page}>
      <div style={styles.nav}>
        <span style={styles.logo}>TaskManager</span>
        <div style={styles.navRight}>
          <span style={styles.userName}>Hi, {user?.name}</span>
          <button style={styles.logoutBtn} onClick={() => { logoutUser(); navigate('/login'); }}>Logout</button>
        </div>
      </div>

      <div style={styles.body}>
        <h2 style={styles.heading}>Dashboard</h2>
        <div style={styles.cards}>
          <div style={styles.card}><div style={styles.cardNum}>{stats.total}</div><div style={styles.cardLabel}>Total tasks</div></div>
          <div style={styles.card}><div style={styles.cardNum}>{stats.inProgress}</div><div style={styles.cardLabel}>In progress</div></div>
          <div style={styles.card}><div style={styles.cardNum}>{stats.done}</div><div style={styles.cardLabel}>Completed</div></div>
          <div style={{ ...styles.card, background: stats.overdue.length > 0 ? '#fff5f5' : undefined }}>
            <div style={{ ...styles.cardNum, color: stats.overdue.length > 0 ? '#e53e3e' : undefined }}>{stats.overdue.length}</div>
            <div style={styles.cardLabel}>Overdue</div>
          </div>
        </div>

        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h3 style={styles.sectionTitle}>My projects</h3>
            <button style={styles.btn} onClick={() => setShowForm(!showForm)}>+ New project</button>
          </div>

          {showForm && (
            <form onSubmit={handleCreate} style={styles.form}>
              <input style={styles.input} placeholder="Project name" value={newProject.name}
                onChange={e => setNewProject({ ...newProject, name: e.target.value })} />
              <input style={styles.input} placeholder="Description (optional)" value={newProject.description}
                onChange={e => setNewProject({ ...newProject, description: e.target.value })} />
              <button style={styles.btn} type="submit">Create</button>
            </form>
          )}

          <div style={styles.projectList}>
            {projects.map(p => (
              <div key={p.id} style={styles.projectCard} onClick={() => navigate(`/projects/${p.id}`)}>
                <div style={styles.projectName}>{p.name}</div>
                <div style={styles.projectMeta}>{p._count?.tasks || 0} tasks · {p.members?.length || 0} members</div>
              </div>
            ))}
            {projects.length === 0 && <p style={styles.empty}>No projects yet. Create one!</p>}
          </div>
        </div>

        {stats.overdue.length > 0 && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Overdue tasks</h3>
            {stats.overdue.map(t => (
              <div key={t.id} style={styles.overdueItem}>
                <span>{t.title}</span>
                <span style={styles.overdueProject}>{t.project?.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#f5f5f5' },
  nav: { background: '#fff', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee' },
  logo: { fontWeight: '600', fontSize: '18px', color: '#6c63ff' },
  navRight: { display: 'flex', alignItems: 'center', gap: '1rem' },
  userName: { fontSize: '14px', color: '#555' },
  logoutBtn: { padding: '6px 14px', border: '1px solid #ddd', borderRadius: '8px', background: 'transparent', cursor: 'pointer', fontSize: '13px' },
  body: { maxWidth: '900px', margin: '0 auto', padding: '2rem 1rem' },
  heading: { margin: '0 0 1.5rem', fontSize: '22px' },
  cards: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '2rem' },
  card: { background: '#fff', borderRadius: '12px', padding: '1.2rem', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  cardNum: { fontSize: '32px', fontWeight: '600', color: '#6c63ff' },
  cardLabel: { fontSize: '13px', color: '#888', marginTop: '4px' },
  section: { background: '#fff', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' },
  sectionTitle: { margin: 0, fontSize: '16px' },
  btn: { padding: '8px 16px', background: '#6c63ff', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' },
  form: { marginBottom: '1rem', display: 'flex', gap: '8px', flexWrap: 'wrap' },
  input: { padding: '8px 12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', flex: 1 },
  projectList: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' },
  projectCard: { border: '1px solid #eee', borderRadius: '10px', padding: '1rem', cursor: 'pointer', transition: 'box-shadow 0.2s' },
  projectName: { fontWeight: '500', marginBottom: '6px' },
  projectMeta: { fontSize: '12px', color: '#888' },
  empty: { color: '#aaa', fontSize: '14px' },
  overdueItem: { display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f5f5f5', fontSize: '14px' },
  overdueProject: { color: '#888', fontSize: '12px' }
};