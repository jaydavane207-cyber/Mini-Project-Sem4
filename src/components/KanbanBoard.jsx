import { Plus, X, Tag, Loader2 } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import insforge from '../lib/insforge';

const TAG_OPTIONS = ['Frontend', 'Backend', 'Security', 'DevOps', 'UI/UX', 'Database', 'Testing', 'Documentation'];

export default function KanbanBoard({ groupId }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [columns, setColumns] = useState([
    { id: 'todo', title: 'To Do', tasks: [] },
    { id: 'progress', title: 'In Progress', tasks: [] },
    { id: 'done', title: 'Done', tasks: [] }
  ]);

  const [addingTo, setAddingTo] = useState(null);
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskTags, setNewTaskTags] = useState([]);

  const fetchTasks = async () => {
    setLoading(true);
    const { data, error } = await insforge.database
      .from('tasks')
      .select('*')
      .eq('group_id', groupId);
    
    if (!error && data) {
      setTasks(data);
      // Map tasks to columns
      const updatedColumns = [
        { id: 'todo', title: 'To Do', tasks: data.filter(t => t.column_id === 'todo') },
        { id: 'progress', title: 'In Progress', tasks: data.filter(t => t.column_id === 'progress') },
        { id: 'done', title: 'Done', tasks: data.filter(t => t.column_id === 'done') }
      ];
      setColumns(updatedColumns);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (groupId) fetchTasks();
  }, [groupId]);

  const handleAddTask = async (colId) => {
    if (!newTaskText.trim()) return;
    
    const newTask = {
      group_id: groupId,
      column_id: colId,
      text: newTaskText.trim(),
      tags: newTaskTags.length > 0 ? newTaskTags : ['General']
    };

    const { error } = await insforge.database.from('tasks').insert(newTask);
    
    if (!error) {
      fetchTasks();
      setNewTaskText('');
      setNewTaskTags([]);
      setAddingTo(null);
    } else {
      console.error('Error adding task:', error);
    }
  };

  const toggleTag = (tag) => {
    setNewTaskTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const handleDeleteTask = async (colId, taskId) => {
    const { error } = await insforge.database.from('tasks').delete().eq('id', taskId);
    if (!error) {
      fetchTasks();
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-[var(--color-gs-text-muted)] gap-3">
        <Loader2 className="animate-spin text-[var(--color-gs-cyan)]" size={32} />
        <p className="text-sm font-bold">Syncing Board...</p>
      </div>
    );
  }

  return (
    <div className="flex gap-6 overflow-x-auto pb-4 custom-scrollbar h-96">
      {columns.map(col => (
        <div key={col.id} className="min-w-[300px] w-[300px] flex flex-col gap-3 bg-[var(--color-gs-bg)] rounded-2xl p-4 border border-[var(--color-gs-border)] shrink-0">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-bold text-[var(--color-gs-text-main)]">{col.title} <span className="text-[var(--color-gs-text-muted)] text-sm ml-2">({col.tasks.length})</span></h4>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-3">
            {col.tasks.map(task => (
              <div key={task.id} className="bg-[var(--color-gs-card)] border border-[var(--color-gs-border)] p-4 rounded-xl cursor-grab hover:border-[var(--color-gs-cyan)] transition-colors shadow-sm group relative">
                <button
                  onClick={() => handleDeleteTask(col.id, task.id)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 text-[var(--color-gs-text-muted)] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                >
                  <X size={14} />
                </button>
                <p className="text-sm font-medium text-[var(--color-gs-text-main)] mb-3 pr-6">{task.text}</p>
                <div className="flex flex-wrap gap-2">
                  {task.tags.map(tag => (
                    <span key={tag} className="text-[10px] px-2 py-1 rounded bg-[var(--color-gs-bg)] text-[var(--color-gs-text-muted)] border border-[var(--color-gs-border)]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Add Task Area */}
          {addingTo === col.id ? (
            <div className="bg-[var(--color-gs-card)] border border-[var(--color-gs-cyan)]/50 rounded-xl p-3 space-y-3 animate-[slideInUp_0.15s_ease-out]">
              <input
                type="text"
                value={newTaskText}
                onChange={e => setNewTaskText(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleAddTask(col.id); if (e.key === 'Escape') { setAddingTo(null); setNewTaskText(''); setNewTaskTags([]); } }}
                placeholder="Task title..."
                className="w-full bg-[var(--color-gs-bg)] border border-[var(--color-gs-border)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--color-gs-cyan)] text-[var(--color-gs-text-main)] placeholder-[var(--color-gs-text-muted)]"
                autoFocus
              />

              {/* Tag Selector */}
              <div>
                <p className="text-[10px] text-[var(--color-gs-text-muted)] mb-1.5 flex items-center gap-1"><Tag size={10} /> Tags (optional)</p>
                <div className="flex flex-wrap gap-1.5">
                  {TAG_OPTIONS.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={twMerge(
                        "text-[10px] px-2 py-1 rounded-md border transition-colors",
                        newTaskTags.includes(tag) 
                          ? "bg-[var(--color-gs-cyan)]/15 border-[var(--color-gs-cyan)]/40 text-[var(--color-gs-cyan)]" 
                          : "bg-[var(--color-gs-bg)] border-[var(--color-gs-border)] text-[var(--color-gs-text-muted)] hover:border-[var(--color-gs-cyan)]/30"
                      )}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleAddTask(col.id)}
                  disabled={!newTaskText.trim()}
                  className="flex-1 py-2 bg-[var(--color-gs-cyan)] text-[#0f172a] font-bold text-xs rounded-lg hover:bg-cyan-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Add
                </button>
                <button
                  onClick={() => { setAddingTo(null); setNewTaskText(''); setNewTaskTags([]); }}
                  className="px-3 py-2 text-[var(--color-gs-text-muted)] hover:text-[var(--color-gs-text-main)] text-xs border border-[var(--color-gs-border)] rounded-lg hover:bg-[var(--color-gs-bg)] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => { setAddingTo(col.id); setNewTaskText(''); setNewTaskTags([]); }}
              className="w-full py-3 rounded-xl border-2 border-dashed border-[var(--color-gs-border)] text-[var(--color-gs-text-muted)] hover:border-[var(--color-gs-cyan)] hover:text-[var(--color-gs-cyan)] transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={16} /> Add Task
            </button>
          )}
        </div>
      ))}
    </div>
  );
}