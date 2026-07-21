'use client';

import React from 'react';
import { X, Award, Briefcase, Star, FileText, CheckCircle2, ShieldCheck, Mail, Phone, Calendar } from 'lucide-react';
import { User } from '@/lib/types';

interface EmployeeBackgroundModalProps {
  user: User;
  onClose: () => void;
}

export const EmployeeBackgroundModal: React.FC<EmployeeBackgroundModalProps> = ({ user, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-xl p-6 shadow-xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-4">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-xl object-cover border border-slate-200"
            />
            <div>
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                {user.name}
                <span className="badge-indigo">
                  {user.role}
                </span>
              </h3>
              <p className="text-sm font-semibold text-indigo-600">{user.department}</p>
              <p className="text-xs text-slate-500 mt-0.5">Joined DigitalX: {user.startDate}</p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Contact Strip */}
        <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-lg border border-slate-200">
          <div>
            <span className="text-slate-500 block font-medium">Email Address</span>
            <span className="font-semibold text-slate-900">{user.email}</span>
          </div>
          <div>
            <span className="text-slate-500 block font-medium">Direct Phone</span>
            <span className="font-semibold text-slate-900">{user.phone}</span>
          </div>
        </div>

        {/* Certifications */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-600" /> Professional Certifications & Diplomas
          </h4>
          <div className="flex flex-wrap gap-2">
            {user.certifications.map((cert) => (
              <span
                key={cert}
                className="badge-amber font-medium flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5" /> {cert}
              </span>
            ))}
          </div>
        </div>

        {/* Experience Notes */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-indigo-600" /> Prior Experience & Track Record
          </h4>
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed font-medium">
            {user.experienceNotes}
          </div>
        </div>

        {/* Performance Score & Review */}
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-600">Internal Performance Review Score</p>
            <p className="text-xl font-bold text-amber-600 flex items-center gap-1.5 mt-1">
              <Star className="w-5 h-5 fill-amber-400 text-amber-500" /> {user.rating} / 5.0 Rating
            </p>
          </div>
          <button className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm transition-colors">
            View Downloadable CV / Resume
          </button>
        </div>
      </div>
    </div>
  );
};

