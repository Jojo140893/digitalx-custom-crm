'use client';

import React from 'react';
import { CheckCircle2, Star, DollarSign, Calendar, Quote, Award, Lock } from 'lucide-react';
import { Project } from '@/lib/types';

interface CompletedProjectsModuleProps {
  projects: Project[];
  isAdmin: boolean;
}

export const CompletedProjectsModule: React.FC<CompletedProjectsModuleProps> = ({
  projects,
  isAdmin,
}) => {
  const completedProjects = projects.filter((p) => p.status === 'COMPLETED');

  const totalValue = completedProjects.reduce((acc, p) => acc + (p.finalInvoiceValue || 0), 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">
            <CheckCircle2 className="w-4 h-4" /> Delivered Engagements
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Completed Projects Showcase
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Delivered agency projects, final invoice values, CSAT star scores, & client testimonials
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 px-5 py-3 rounded-lg">
          <div>
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Completed Projects</p>
            <p className="text-xl font-bold text-emerald-600">{completedProjects.length} Builds</p>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div>
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Total Delivered Value</p>
            <p className="text-xl font-bold text-slate-900">{isAdmin ? `$${totalValue.toLocaleString()}` : <span className="inline-flex items-center gap-1 text-slate-400 font-normal"><Lock className="w-4 h-4" /> Masked</span>}</p>
          </div>
        </div>
      </div>

      {/* Completed Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {completedProjects.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-xl p-6 border border-slate-200 hover:border-emerald-300 transition-all space-y-4 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="badge-emerald mb-1 inline-block">
                  {p.serviceType}
                </span>
                <h3 className="text-lg font-bold text-slate-900">{p.name}</h3>
                <p className="text-xs text-slate-500">Client: {p.clientName}</p>
              </div>

              {/* Star Rating */}
              <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full text-amber-700 text-xs font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                <span>{p.csatRating || 5}.0 / 5.0</span>
              </div>
            </div>

            {/* Testimonial Quote */}
            {p.testimonialQuote && (
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 italic relative">
                <Quote className="w-4 h-4 text-emerald-600 absolute top-2 right-2 opacity-30" />
                &quot;{p.testimonialQuote}&quot;
              </div>
            )}

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 block font-medium">Completion Date</span>
                <span className="font-semibold text-slate-800 font-mono text-[11px]">{p.completionDate || 'Recent'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block font-medium">Final Invoice Value</span>
                <span className="font-bold text-emerald-700">
                  {isAdmin ? `$${(p.finalInvoiceValue || 0).toLocaleString()}` : <Lock className="w-3.5 h-3.5 text-slate-400 inline" />}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
