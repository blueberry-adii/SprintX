import React, { useState } from 'react';
import { Task, Priority, Category } from '../types';
import { Plus, CheckCircle, Circle, Calendar, Clock, AlertCircle, Play, Filter, Trash2, MoreVertical, Edit2 } from 'lucide-react';

interface TaskManagerProps {
  tasks: Task[];
  onAddTask: (task: Task) => void;
  onUpdateTask: (task: Task) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onStartFocus: (task: Task) => void;
}

export const TaskManager: React.FC<TaskManagerProps> = ({ tasks, onAddTask, onUpdateTask, onToggleTask, onDeleteTask, onStartFocus }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const defaultTaskState = {
    title: '',
    priority: Priority.MEDIUM,
    category: Category.STUDY,
    durationMinutes: 60,
    deadline: ''
  };

  const [formData, setFormData] = useState<Partial<Task>>(defaultTaskState);

  const resetForm = () => {
    setFormData(defaultTaskState);
    setEditingTaskId(null);
    setIsFormOpen(false);
  };

  const handleAddNewClick = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const toDateTimeLocal = (isoString: string) => {
    try {
        const date = new Date(isoString);
        if (isNaN(date.getTime())) return '';
        
        const pad = (num: number) => num.toString().padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
    } catch (e) {
        return '';
    }
  };

  const handleEditClick = (task: Task) => {
    setFormData({
        title: task.title,
        deadline: toDateTimeLocal(task.deadline),
        priority: task.priority,
        category: task.category,
        durationMinutes: task.durationMinutes
    });
    setEditingTaskId(task.id);
    setIsFormOpen(true);
    setActiveMenuId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.deadline) return;

    if (editingTaskId) {
        // Update existing
        const originalTask = tasks.find(t => t.id === editingTaskId);
        const updatedTask: Task = {
            ...originalTask!,
            title: formData.title,
            deadline: formData.deadline, 
            priority: formData.priority!,
            category: formData.category!,
            durationMinutes: formData.durationMinutes!,
        };
        onUpdateTask(updatedTask);
    } else {
        // Create new
        const task: Task = {
            id: '', 
            title: formData.title,
            deadline: formData.deadline,
            priority: formData.priority || Priority.MEDIUM,
            category: formData.category || Category.STUDY,
            durationMinutes: formData.durationMinutes || 60,
            completed: false
        };
        onAddTask(task);
    }
    resetForm();
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
          onClick={handleAddNewClick}
          className="flex items-center gap-2 bg-[var(--primary-600)] text-white px-5 py-2.5 rounded-xl hover:brightness-110 transition-all shadow-lg shadow-[var(--primary-600)]/20 font-medium active:scale-95 hover:-translate-y-0.5 duration-200"
        >
          <Plus size={20} strokeWidth={2.5} /> New Task
        </button>
      </div>

      {isFormOpen && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-lg shadow-slate-200/50 dark:shadow-black/20 border border-slate-100 dark:border-slate-700 mb-10 animate-slide-up transition-colors duration-300">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">
              {editingTaskId ? 'Edit Task' : 'Create New Task'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Task Name</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-[var(--primary-500)] focus:border-transparent outline-none transition-all bg-slate-50 dark:bg-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900"
                placeholder="e.g., Finish Chapter 4 Notes"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Deadline</label>
              <input
                type="datetime-local"
                required
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-[var(--primary-500)] outline-none bg-slate-50 dark:bg-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900"
                value={formData.deadline || ''}
                onChange={e => setFormData({ ...formData, deadline: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Duration (mins)</label>
              <input
                type="number"
                min="10"
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-[var(--primary-500)] outline-none bg-slate-50 dark:bg-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900"
                value={formData.durationMinutes}
                onChange={e => setFormData({ ...formData, durationMinutes: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Priority</label>
              <select
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-[var(--primary-500)] outline-none bg-slate-50 dark:bg-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900"
                value={formData.priority}
                onChange={e => setFormData({ ...formData, priority: e.target.value as Priority })}
              >
                {Object.values(Priority).map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Category</label>
              <select
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-[var(--primary-500)] outline-none bg-slate-50 dark:bg-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900"
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value as Category })}
              >
                {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="mt-8 flex justify-end gap-3">
            <button type="button" onClick={resetForm} className="px-6 py-2.5 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl font-medium transition-colors active:scale-95">Cancel</button>
            <button type="submit" className="px-6 py-2.5 bg-[var(--primary-600)] text-white rounded-xl hover:brightness-110 shadow-md font-medium active:scale-95 transition-transform">
                {editingTaskId ? 'Update Task' : 'Save Task'}
            </button>
          </div>
        </form>
      )}

      <div className="flex gap-2 mb-6 border-b border-slate-200 dark:border-slate-700 pb-1 overflow-x-auto">
          {['all', 'pending', 'completed'].map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t as any)}
                className={`px-4 py-2 text-sm font-medium capitalize rounded-lg transition-all active:scale-95 ${
                    filter === t 
                    ? 'text-[var(--primary-700)] dark:text-white bg-[var(--primary-50)] dark:bg-[var(--primary-600)]' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                  {t}
              </button>
          ))}
      </div>

      {/* Backdrop for menu */}
      {activeMenuId && (
        <div className="fixed inset-0 z-10 bg-transparent" onClick={() => setActiveMenuId(null)}></div>
      )}

      <div className="space-y-3">
        {sortedTasks.map(task => (
          <div 
            key={task.id} 
            className={`group bg-white dark:bg-slate-800 p-5 rounded-2xl border transition-all duration-300 ease-out hover:shadow-lg hover:border-[var(--primary-200)] relative hover:-translate-y-0.5 ${task.completed ? 'border-slate-100 dark:border-slate-700 opacity-60 bg-slate-50 dark:bg-slate-800/50' : 'border-slate-100 dark:border-slate-700 shadow-sm'} ${activeMenuId === task.id ? 'z-50' : ''}`}
          >
            {/* Progress Hint Bar for non-completed */}
            {!task.completed && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--primary-500)] rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>}

            <div className="flex items-center gap-5">
                <button onClick={() => onToggleTask(task.id)} className="text-slate-300 hover:text-[var(--primary-600)] transition-all duration-300 flex-shrink-0 active:scale-90">
                {task.completed ? <CheckCircle className="text-emerald-500 animate-pop" size={26} /> : <Circle size={26} strokeWidth={2} className="hover:scale-110 transition-transform" />}
                </button>
                
                <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1">
                    <h3 className={`font-bold text-lg text-slate-800 dark:text-slate-100 truncate pr-4 transition-all duration-300 ${task.completed ? 'line-through text-slate-500' : ''}`}>{task.title}</h3>
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

                <div className="flex items-center gap-2 relative">
                    {!task.completed && (
                        <button 
                            onClick={() => onStartFocus(task)}
                            className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[var(--primary-50)] dark:bg-[var(--primary-600)]/20 text-[var(--primary-600)] dark:text-[var(--primary-400)] flex items-center justify-center hover:bg-[var(--primary-600)] hover:text-white transition-all transform hover:scale-110 active:scale-95 shadow-sm group-hover:shadow-[var(--primary-200)] flex-shrink-0"
                            title="Start Focus Timer"
                        >
                            <Play size={20} fill="currentColor" className="ml-0.5" />
                        </button>
                    )}
                    
                    {/* Menu Trigger */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuId(activeMenuId === task.id ? null : task.id);
                        }}
                        className="w-10 h-10 md:w-12 md:h-12 rounded-full text-slate-400 hover:text-slate-600 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center transition-colors flex-shrink-0 active:scale-95"
                    >
                        <MoreVertical size={20} />
                    </button>

                    {/* Dropdown Menu */}
                    {activeMenuId === task.id && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl shadow-slate-200/50 dark:shadow-black/50 border border-slate-100 dark:border-slate-700 z-50 overflow-hidden animate-pop origin-top-right">
                            <button 
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditClick(task);
                                }}
                                className="w-full text-left px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 transition-colors"
                            >
                                <Edit2 size={16} /> Edit
                            </button>
                            <button 
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteTask(task.id);
                                    setActiveMenuId(null);
                                }}
                                className="w-full text-left px-4 py-3 text-sm font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 flex items-center gap-2 transition-colors"
                            >
                                <Trash2 size={16} /> Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>
          </div>
        ))}
        
        {tasks.length === 0 && (
          <div className="text-center py-16 text-slate-400 dark:text-slate-500 bg-white/50 dark:bg-slate-800/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 animate-fade-in">
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