'use client';

import React, { useState } from 'react';
import { CheckSquare, Plus, Search, Calendar, User, AlertCircle, CheckCircle2, Clock, Timer, X } from 'lucide-react';
import { Task, User as UserModel } from '@/lib/types';
import { crmStore } from '@/lib/store';

interface TasksModuleProps {
  tasks: Task[];
  users: UserModel[];
  onRefresh: () => void;
}

export const TasksModule: React.FC<TasksModuleProps> = ({ tasks, users, onRefresh }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [logTimeTask, setLogTimeTask] = useState<Task | null>(null);
  const [logHours, setLogHours] = useState(2.0);
  const [logDescription, setLogDescription] = useState('Implemented feature updates.');

  // New Task Form
  const [newTask, setNewTask] = useState({
    title: '',
    priority: 'MEDIUM' as Task['priority'],
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    assignedId: users[0]?.id || '',
    estimatedHours: 4.0,
  });

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = selectedPriority === 'ALL' || t.priority === selectedPriority;
    return matchesSearch && matchesPriority;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    const assignedUser = users.find((u) => u.id === newTask.assignedId);
    crmStore.addTask({
      ...newTask,
      status: 'TODO',
      assignedTo: assignedUser ? assignedUser.name : 'Unassigned',
    });
    setShowAddModal(false);
    onRefresh();
  };

  const handleLogTimeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logTimeTask) return;
    crmStore.logTimeOnTask(logTimeTask.id, logHours, logDescription);
    setLogTimeTask(null);
    onRefresh();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">
            <CheckSquare className="w-4 h-4" /> Operations Checklist
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Task & Reminder Command System
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Task execution checklist, priority badges, overdue indicators, & billable time logging
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" /> Create Task
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks by title..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <select
          value={selectedPriority}
          onChange={(e) => setSelectedPriority(e.target.value)}
          className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium focus:outline-none"
        >
          <option value="ALL">All Priorities</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="URGENT">Urgent</option>
        </select>
      </div>

      {/* Tasks Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-4">Status & Title</th>
                <th className="p-4">Project / Client</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Due Date</th>
                <th className="p-4">Assigned To</th>
                <th className="p-4">Logged / Est. Hours</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredTasks.map((t) => {
                const isOverdue = t.status !== 'DONE' && new Date(t.dueDate) < new Date();
                return (
                  <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-medium">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            crmStore.toggleTaskStatus(t.id);
                            onRefresh();
                          }}
                          className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                            t.status === 'DONE'
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'border-slate-300 bg-slate-50 hover:border-indigo-500'
                          }`}
                        >
                          {t.status === 'DONE' && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </button>
                        <span className={`font-bold ${t.status === 'DONE' ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                          {t.title}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600 text-[11px]">
                      {t.projectName || 'General CRM'} <br />
                      <span className="text-slate-400">{t.clientName}</span>
                    </td>
                    <td className="p-4">
                      <span
                        className={
                          t.priority === 'URGENT'
                            ? 'badge-rose'
                            : t.priority === 'HIGH'
                            ? 'badge-amber'
                            : 'badge-indigo'
                        }
                      >
                        {t.priority}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-[11px]">
                      <span className={isOverdue ? 'text-rose-600 font-bold flex items-center gap-1' : 'text-slate-600'}>
                        {isOverdue && <AlertCircle className="w-3.5 h-3.5" />}
                        {t.dueDate}
                      </span>
                    </td>
                    <td className="p-4 text-slate-800 font-semibold">{t.assignedTo}</td>
                    <td className="p-4 text-slate-700 font-mono">
                      {t.loggedHours}h / {t.estimatedHours}h
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setLogTimeTask(t)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-indigo-700 font-semibold text-xs flex items-center gap-1 ml-auto transition-colors"
                      >
                        <Timer className="w-3.5 h-3.5" /> Log Hours
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE TASK MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-600" /> Create Operational Task
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="e.g. Audit Twilio missed-call webhook"
                  className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Task['priority'] })}
                    className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Assigned Employee</label>
                <select
                  value={newTask.assignedId}
                  onChange={(e) => setNewTask({ ...newTask, assignedId: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>{u.name} ({u.department})</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-sm transition-colors"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LOG TIME MODAL */}
      {logTimeTask && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Timer className="w-5 h-5 text-indigo-600" /> Log Hours on &quot;{logTimeTask.title}&quot;
              </h3>
              <button onClick={() => setLogTimeTask(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleLogTimeSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Hours Logged</label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={logHours}
                  onChange={(e) => setLogHours(Number(e.target.value))}
                  className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Work Description</label>
                <textarea
                  rows={3}
                  required
                  value={logDescription}
                  onChange={(e) => setLogDescription(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setLogTimeTask(null)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-sm transition-colors"
                >
                  Save Time Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

