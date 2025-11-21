import React, { useState } from 'react';
import { Task, Priority, Category } from '../types';
import { Plus, CheckCircle, Circle, Calendar, Clock, AlertCircle, Play, Filter } from 'lucide-react';

interface TaskManagerProps {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  onStartFocus: (task: Task) => void;
}

export const TaskManager: React.FC<TaskManagerProps> = ({ tasks, setTasks, onStartFocus }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    priority: Priority.MEDIUM,
    category: Category.STUDY,
    durationMinutes: 60
  });

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title || !newTask.deadline) return;

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      deadline: newTask.deadline,
      priority: newTask.priority || Priority.MEDIUM,
      category: newTask.category || Category.STUDY,
      durationMinutes: newTask.durationMinutes || 60,
      completed: false
    };

    setTasks([...tasks, task]);
    setNewTask({ title: '', priority: Priority.MEDIUM, category: Category.STUDY, durationMinutes: 60 });
    setIsAdding(false);
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const getPriorityColor = (p: Priority) => {
    switch (p) {
      case Priority.URGENT: return 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/30 border-rose-200 dark:border-rose-800';
      case Priority.HIGH: return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800';
      case Priority.MEDIUM: return 'text-[var(--primary-600)] dark:text-[var(--primary-400)] bg-[var(--primary-50)] dark:bg-[var(--primary-900)]/30 border-[var(--primary-200)] dark:border-[var(--primary-800)]';
      default: return 'text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-700';
    }
  };

  const sortedTasks = [...tasks]
    .filter(t => {
        if (filter === 'pending') return !t.completed;
        if (filter === 'completed') return t.completed;
        return true;
    })
    .sort((a, b) => {
    if (a.completed === b.completed) {
      const priorityWeight = { [Priority.URGENT]: 3, [Priority.HIGH]: 2, [Priority.MEDIUM]: 1, [Priority.LOW]: 0 };
      if (priorityWeight[a.priority] !== priorityWeight[b.priority]) {
        return priorityWeight[b.priority] - priorityWeight[a.priority];
      }
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    }
    return a.completed ? 1 : -1;
  });

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Task Manager</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Organize and prioritize your study load.</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 bg-[var(--primary-600)] text-white px-5 py-2.5 rounded-xl hover:brightness-110 transition-all shadow-lg shadow-[var(--primary-600)]/20 font-medium active:scale-95"
        >
          <Plus size={20} strokeWidth={2.5} /> New Task
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAddTask} className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-lg shadow-slate-200/50 dark:shadow-black/20 border border-slate-100 dark:border-slate-700 mb-10 animate-slide-up transition-colors">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Task Name</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-[var(--primary-500)] focus:border-transparent outline-none transition-all bg-slate-50 dark:bg-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900"
                placeholder="e.g., Finish Chapter 4 Notes"
                value={newTask.title}
                onChange={e => setNewTask({ ...newTask, title: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Deadline</label>
              <input
                type="datetime-local"
                required
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-[var(--primary-500)] outline-none bg-slate-50 dark:bg-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900"
                value={newTask.deadline || ''}
                onChange={e => setNewTask({ ...newTask, deadline: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Duration (mins)</label>
              <input
                type="number"
                min="10"
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-[var(--primary-500)] outline-none bg-slate-50 dark:bg-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900"
                value={newTask.durationMinutes}
                onChange={e => setNewTask({ ...newTask, durationMinutes: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Priority</label>
              <select
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-[var(--primary-500)] outline-none bg-slate-50 dark:bg-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900"
                value={newTask.priority}
                onChange={e => setNewTask({ ...newTask, priority: e.target.value as Priority })}
              >
                {Object.values(Priority).map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Category</label>
              <select
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-[var(--primary-500)] outline-none bg-slate-50 dark:bg-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900"
                value={newTask.category}
                onChange={e => setNewTask({ ...newTask, category: e.target.value as Category })}
              >
                {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="mt-8 flex justify-end gap-3">
            <button type="button" onClick={() => setIsAdding(false)} className="px-6 py-2.5 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl font-medium transition-colors">Cancel</button>
            <button type="submit" className="px-6 py-2.5 bg-[var(--primary-600)] text-white rounded-xl hover:brightness-110 shadow-md font-medium">Save Task</button>
          </div>
        </form>
      )}

      <div className="flex gap-2 mb-6 border-b border-slate-200 dark:border-slate-700 pb-1 overflow-x-auto">
          {['all', 'pending', 'completed'].map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t as any)}
                className={`px-4 py-2 text-sm font-medium capitalize rounded-lg transition-all ${
                    filter === t 
                    ? 'text-[var(--primary-700)] dark:text-[var(--primary-300)] bg-[var(--primary-50)] dark:bg-[var(--primary-900)]/20' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                  {t}
              </button>
          ))}
      </div>

      <div className="space-y-3">
        {sortedTasks.map(task => (
          <div key={task.id} className={`group bg-white dark:bg-slate-800 p-5 rounded-2xl border transition-all duration-500 hover:shadow-lg hover:border-[var(--primary-200)] relative overflow-hidden ${task.completed ? 'border-slate-100 dark:border-slate-700 opacity-60 bg-slate-50 dark:bg-slate-800/50' : 'border-slate-100 dark:border-slate-700 shadow-sm'}`}>
            {/* Progress Hint Bar for non-completed */}
            {!task.completed && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--primary-500)] rounded-l-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>}

            <div className="flex items-center gap-5">
                <button onClick={() => toggleTask(task.id)} className="text-slate-300 hover:text-[var(--primary-600)] transition-colors flex-shrink-0">
                {task.completed ? <CheckCircle className="text-emerald-500 animate-pop" size={26} /> : <Circle size={26} strokeWidth={2} />}
                </button>
                
                <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1">
                    <h3 className={`font-bold text-lg text-slate-800 dark:text-slate-100 truncate pr-4 ${task.completed ? 'line-through text-slate-500' : ''}`}>{task.title}</h3>
                    {!task.completed && task.priority === Priority.URGENT && (
                        <div className="flex items-center gap-1 text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/30 px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider animate-pulse">
                            <AlertCircle size={14} /> Urgent
                        </div>
                    )}
                </div>
                
                <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-slate-500 dark:text-slate-400 items-center">
                    <span className="flex items-center gap-1.5"><Calendar size={15} className="text-slate-400" /> {new Date(task.deadline).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1.5"><Clock size={15} className="text-slate-400" /> {task.durationMinutes}m</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getPriorityColor(task.priority)}`}>{task.priority}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">{task.category}</span>
                </div>
                </div>

                {!task.completed && (
                    <button 
                        onClick={() => onStartFocus(task)}
                        className="w-12 h-12 rounded-full bg-[var(--primary-50)] dark:bg-[var(--primary-900)]/30 text-[var(--primary-600)] dark:text-[var(--primary-400)] flex items-center justify-center hover:bg-[var(--primary-600)] hover:text-white transition-all transform hover:scale-110 shadow-sm group-hover:shadow-[var(--primary-200)] flex-shrink-0"
                        title="Start Focus Timer"
                    >
                        <Play size={20} fill="currentColor" className="ml-0.5" />
                    </button>
                )}
            </div>
          </div>
        ))}
        
        {tasks.length === 0 && (
          <div className="text-center py-16 text-slate-400 dark:text-slate-500 bg-white/50 dark:bg-slate-800/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700">
            <div className="bg-slate-50 dark:bg-slate-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300 dark:text-slate-500">
                <Filter size={24} />
            </div>
            <p>No tasks found. Time to add some!</p>
          </div>
        )}
      </div>
    </div>
  );
};