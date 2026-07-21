'use client';

import React, { useState } from 'react';
import {
  Briefcase,
  Search,
  Plus,
  LayoutGrid,
  List,
  CheckCircle2,
  Clock,
  AlertTriangle,
  UserCheck,
  Calendar,
  X,
  Star,
} from 'lucide-react';
import { Project, ProjectStatus, ServiceType, Client, User } from '@/lib/types';
import { crmStore } from '@/lib/store';

interface ProjectsModuleProps {
  projects: Project[];
  clients: Client[];
  users: User[];
  onRefresh: () => void;
}

export const ProjectsModule: React.FC<ProjectsModuleProps> = ({
  projects,
  clients,
  users,
  onRefresh,
}) => {
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Project Form
  const [newProject, setNewProject] = useState({
    clientId: clients[0]?.id || '',
    name: '',
    serviceType: 'AI Voice Agents' as ServiceType,
    status: 'IN_PROGRESS' as ProjectStatus,
    targetDelivery: new Date(Date.now() + 86400000 * 20).toISOString().split('T')[0],
    assigneeNames: ['Alex Rivera'],
  });

  const statuses: { key: ProjectStatus; label: string; badgeClass: string }[] = [
    { key: 'PENDING', label: 'Pending / Delayed', badgeClass: 'bg-amber-100 text-amber-800 border-amber-200' },
    { key: 'IN_PROGRESS', label: 'In Progress', badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
    { key: 'COMPLETED', label: 'Completed', badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    { key: 'ON_HOLD', label: 'On Hold', badgeClass: 'bg-slate-100 text-slate-800 border-slate-200' },
  ];

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.serviceType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'ALL' || p.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    const client = clients.find((c) => c.id === newProject.clientId);
    crmStore.addProject({
      ...newProject,
      clientName: client ? client.companyName : 'Unknown Client',
      assignees: newProject.assigneeNames,
    });
    setShowAddModal(false);
    onRefresh();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 uppercase tracking-wider mb-1">
            <Briefcase className="w-4 h-4 text-indigo-600" /> Client Deliverables & Projects
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Project Command Board
          </h2>
          <p className="text-sm text-slate-600 font-medium mt-0.5">
            Orchestrating technical builds, milestones, assignees, & delivery timelines
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
                viewMode === 'kanban' ? 'bg-indigo-600 text-white shadow-xs font-bold' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Board View
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
                viewMode === 'table' ? 'bg-indigo-600 text-white shadow-xs font-bold' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" /> List View
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" /> New Project
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by name, client, or service type..."
            className="w-full pl-10 pr-10 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 font-semibold placeholder-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2.5 p-0.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded"
              title="Clear search filter"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-800 font-bold focus:outline-none focus:border-indigo-600"
        >
          <option value="ALL">All Project Statuses</option>
          {statuses.map((s) => (
            <option key={s.key} value={s.key}>{s.label}</option>
          ))}
        </select>
      </div>

      {/* KANBAN BOARD VIEW */}
      {viewMode === 'kanban' && (
        <div className="flex gap-4 overflow-x-auto pb-6">
          {statuses.map((col) => {
            const colProjects = filteredProjects.filter((p) => p.status === col.key);
            return (
              <div
                key={col.key}
                className="w-80 shrink-0 bg-slate-100/70 border border-slate-200 rounded-2xl p-3 flex flex-col max-h-[75vh]"
              >
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-bold border ${col.badgeClass}`}>
                    {col.label}
                  </span>
                  <span className="text-xs font-bold text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded-full">
                    {colProjects.length}
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {colProjects.map((proj) => (
                    <div
                      key={proj.id}
                      className="p-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-indigo-300 transition-all space-y-3 shadow-xs group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-800 border border-indigo-200 text-[10px] font-bold mb-1.5 inline-block">
                            {proj.serviceType}
                          </span>
                          <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {proj.name}
                          </h4>
                          <p className="text-xs text-slate-600 font-medium">{proj.clientName}</p>
                        </div>
                      </div>

                      {/* Blocker Notes if any */}
                      {proj.blockerNotes && (
                        <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-1.5 font-bold">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <span>Blocker: {proj.blockerNotes}</span>
                        </div>
                      )}

                      {/* Delivery Date */}
                      <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                        <span className="flex items-center gap-1 text-[11px] font-semibold">
                          <Calendar className="w-3.5 h-3.5 text-indigo-600" /> Target: {proj.targetDelivery}
                        </span>
                      </div>

                      {/* Status Selector */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-slate-600 text-[11px] font-bold">
                          {proj.assignees.join(', ')}
                        </span>
                        <select
                          value={proj.status}
                          onChange={(e) => {
                            crmStore.updateProjectStatus(proj.id, e.target.value as ProjectStatus);
                            onRefresh();
                          }}
                          className="bg-slate-50 text-slate-800 text-xs font-bold px-2 py-0.5 rounded border border-slate-300 focus:outline-none"
                        >
                          {statuses.map((s) => (
                            <option key={s.key} value={s.key}>{s.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-800">
              <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[11px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-4">Project & Client</th>
                  <th className="p-4">Service Category</th>
                  <th className="p-4">Target Delivery</th>
                  <th className="p-4">Assignees</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredProjects.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-bold">
                      <p className="text-slate-900 text-sm">{p.name}</p>
                      <p className="text-slate-600 text-xs font-medium">{p.clientName}</p>
                    </td>
                    <td className="p-4 font-extrabold text-indigo-700">{p.serviceType}</td>
                    <td className="p-4 text-slate-700 font-mono text-xs font-semibold">{p.targetDelivery}</td>
                    <td className="p-4 text-slate-800 font-medium">{p.assignees.join(', ')}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${statuses.find((s) => s.key === p.status)?.badgeClass}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <select
                        value={p.status}
                        onChange={(e) => {
                          crmStore.updateProjectStatus(p.id, e.target.value as ProjectStatus);
                          onRefresh();
                        }}
                        className="bg-slate-50 text-slate-800 text-xs px-2.5 py-1 rounded-lg border border-slate-300 font-bold"
                      >
                        {statuses.map((s) => (
                          <option key={s.key} value={s.key}>{s.label}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* NEW PROJECT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-600" /> Create New Client Project
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-slate-800 font-bold mb-1">Select Client *</label>
                <select
                  value={newProject.clientId}
                  onChange={(e) => setNewProject({ ...newProject, clientId: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-semibold focus:outline-none focus:border-indigo-600"
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>{c.companyName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-1">Project Name *</label>
                <input
                  type="text"
                  required
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  placeholder="e.g. AI Voice Receptionist Setup"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-semibold focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-800 font-bold mb-1">Service Category</label>
                  <select
                    value={newProject.serviceType}
                    onChange={(e) => setNewProject({ ...newProject, serviceType: e.target.value as ServiceType })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-semibold focus:outline-none focus:border-indigo-600"
                  >
                    <option value="AI Voice Agents">AI Voice Agents</option>
                    <option value="GoHighLevel Setup">GoHighLevel Setup</option>
                    <option value="Missed-Call Text-Back">Missed-Call Text-Back</option>
                    <option value="n8n Automation">n8n Automation</option>
                    <option value="Chatbots">Chatbots</option>
                    <option value="Meta Ads">Meta Ads</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-800 font-bold mb-1">Target Delivery</label>
                  <input
                    type="date"
                    value={newProject.targetDelivery}
                    onChange={(e) => setNewProject({ ...newProject, targetDelivery: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-semibold focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold border border-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-sm transition-colors"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
