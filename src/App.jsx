
import { useEffect, useState } from 'react';


function uid() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return String(Date.now()) + Math.random().toString(16).slice(2);
}

export default function App() {
  const [tasks, setTasks] = useState(() => {
    try { return JSON.parse(localStorage.getItem('tasks') || '[]'); }
    catch { return []; }
  });
  const [text, setText] = useState('');

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  function addTask() {
    const name = text.trim();
    if (!name) return;
    setTasks(prev => [...prev, { id: uid(), name }]);
    setText('');
  }

  function editTask(id) {
    const t = tasks.find(x => x.id === id);
    if (!t) return;
    const next = prompt('Edit task', t.name);
    if (!next || !next.trim()) return;
    setTasks(prev => prev.map(x => (x.id === id ? { ...x, name: next.trim() } : x)));
  }

  function deleteTask(id) {
    setTasks(prev => prev.filter(x => x.id !== id));
  }

  function onKeyDown(e) {
    if (e.key === 'Enter') addTask();
  }

  return (
    <div className="min-h-screen bg-emerald-950 text-emerald-50 flex items-start justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-emerald-900/60 border border-emerald-800/60 rounded-2xl shadow-xl backdrop-blur p-5">
          <h1 className="text-xl font-semibold mb-4 tracking-wide">Simple React To-Do</h1>

          <div className="flex gap-2 mb-4">
            <input
              className="flex-1 rounded-xl border border-emerald-800/60 bg-emerald-900/50 px-3 py-2 outline-none
                         placeholder-emerald-300/60 focus:ring-2 focus:ring-emerald-500/50"
              placeholder="Add a task"
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={onKeyDown}
            />
            <button
              className="rounded-xl px-4 py-2 font-medium bg-emerald-500 text-emerald-950 hover:bg-emerald-400 transition"
              onClick={addTask}
            >
              Add
            </button>
          </div>

          <ul className="space-y-2">
            {tasks.map(t => (
              <li key={t.id} className="flex items-center justify-between bg-emerald-900/50 border border-emerald-800/60 rounded-xl px-3 py-2">
                <span className="flex-1 mr-2 break-words">{t.name}</span>
                <div className="flex gap-2">
                  <button
                    className="rounded-lg px-3 py-1 bg-emerald-600 text-emerald-50 hover:bg-emerald-500 transition"
                    onClick={() => editTask(t.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="rounded-lg px-3 py-1 bg-rose-600 text-rose-50 hover:bg-rose-500 transition"
                    onClick={() => deleteTask(t.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
            {tasks.length === 0 && (
              <li className="text-emerald-300/80 text-sm text-center py-4">
                No tasks yet — add your first one!
              </li>
            )}
          </ul>

          <div className="mt-4 text-emerald-300/80 text-sm">
            {tasks.length} task{tasks.length === 1 ? '' : 's'}
          </div>
        </div>
      </div>
    </div>
  );
}
