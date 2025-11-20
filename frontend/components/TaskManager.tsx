import React, { useState } from 'react';
import { Task, Priority, Category } from '../types';
import { Plus, CheckCircle, Circle, Calendar, Clock, AlertCircle } from 'lucide-react';

interface TaskManagerProps {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
}

export const TaskManager: React.FC<TaskManagerProps> = ({ tasks, setTasks }) => {
  const [isAdding, setIsAdding] = useState(false);
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
      case Priority.URGENT: return 'text-red-600 bg-red-50 border-red-200';
      case Priority.HIGH: return 'text-orange-600 bg-orange-50 border-orange-200';
      case Priority.MEDIUM: return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  // Sort: Urgent/High first, then by deadline
  const sortedTasks = [...tasks].sort((a, b) => {
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
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Task Manager</h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus size={18} /> Add Task
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAddTask} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mb-8 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Task Name</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="e.g., Finish Chapter 4 Notes"
                value={newTask.title}
                onChange={e => setNewTask({ ...newTask, title: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Deadline</label>
              <input
                type="datetime-local"
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-md"
                value={newTask.deadline || ''}
                onChange={e => setNewTask({ ...newTask, deadline: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Duration (mins)</label>
              <input
                type="number"
                min="10"
                className="w-full px-3 py-2 border border-slate-300 rounded-md"
                value={newTask.durationMinutes}
                onChange={e => setNewTask({ ...newTask, durationMinutes: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
              <select
                className="w-full px-3 py-2 border border-slate-300 rounded-md"
                value={newTask.priority}
                onChange={e => setNewTask({ ...newTask, priority: e.target.value as Priority })}
              >
                {Object.values(Priority).map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <select
                className="w-full px-3 py-2 border border-slate-300 rounded-md"
                value={newTask.category}
                onChange={e => setNewTask({ ...newTask, category: e.target.value as Category })}
              >
                {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-md">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Save Task</button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {sortedTasks.map(task => (
          <div key={task.id} className={`bg-white p-4 rounded-lg border ${task.completed ? 'border-slate-100 opacity-60' : 'border-slate-200 shadow-sm'} flex items-center gap-4 transition-all`}>
            <button onClick={() => toggleTask(task.id)} className="text-slate-400 hover:text-indigo-600 transition-colors">
              {task.completed ? <CheckCircle className="text-green-500" size={24} /> : <Circle size={24} />}
            </button>
            
            <div className="flex-1">
              <h3 className={`font-medium text-slate-800 ${task.completed ? 'line-through text-slate-500' : ''}`}>{task.title}</h3>
              <div className="flex flex-wrap gap-3 text-sm text-slate-500 mt-1">
                <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(task.deadline).toLocaleDateString()}</span>
                <span className="flex items-center gap-1"><Clock size={14} /> {task.durationMinutes}m</span>
                <span className={`px-2 py-0.5 rounded-full text-xs border ${getPriorityColor(task.priority)}`}>{task.priority}</span>
                <span className="px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-600">{task.category}</span>
              </div>
            </div>

            {!task.completed && task.priority === Priority.URGENT && (
               <AlertCircle className="text-red-500" size={20} />
            )}
          </div>
        ))}
        {tasks.length === 0 && (
          <div className="text-center py-12 text-slate-400 bg-white rounded-lg border border-dashed border-slate-300">
            <p>No tasks yet. Add one to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};
