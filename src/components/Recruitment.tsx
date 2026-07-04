import React, { useState } from 'react';
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Sparkles, 
  Plus, 
  X, 
  FileText,
  Star,
  TrendingUp
} from 'lucide-react';
import { mockJobs, mockCandidates, type Candidate, type Job } from '../data/mockData';

export const Recruitment: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>(mockCandidates);
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [activeTab, setActiveTab] = useState<'pipeline' | 'jobs'>('pipeline');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  
  // Job posting states
  const [showAddJobModal, setShowAddJobModal] = useState(false);
  const [jobTitle, setJobTitle] = useState('');
  const [jobDept, setJobDept] = useState('Engineering');
  const [jobLoc, setJobLoc] = useState('');
  const [jobSalary, setJobSalary] = useState('');
  const [jobDesc, setJobDesc] = useState('');

  const pipelineStages = ['Applied', 'Screened', 'Interview', 'Offered', 'Rejected'] as const;

  // Move candidate to next stage simulation
  const moveCandidate = (candidateId: string, newStatus: Candidate['status']) => {
    setCandidates(prev => prev.map(c => {
      if (c.id === candidateId) {
        // Log an alert simulation
        return { 
          ...c, 
          status: newStatus,
          interviews: newStatus === 'Interview' && c.interviews.length === 0 
            ? [{ round: 'Technical Interview', date: new Date().toISOString().split('T')[0], interviewer: 'Sarah Jenkins', feedback: 'Scheduled in sandbox', rating: 3 }] 
            : c.interviews
        };
      }
      return c;
    }));
    // Update active inspector if visible
    if (selectedCandidate?.id === candidateId) {
      setSelectedCandidate(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle) return;

    const newJob: Job = {
      id: `JOB-${jobs.length + 101}`,
      title: jobTitle,
      department: jobDept,
      location: jobLoc || "Remote",
      type: "Full-Time",
      status: "Open",
      applicantsCount: 0,
      description: jobDesc || "Job description details in sandbox.",
      salaryRange: jobSalary || "$100,000 - $120,000"
    };

    setJobs([...jobs, newJob]);
    setShowAddJobModal(false);
    // reset
    setJobTitle('');
    setJobLoc('');
    setJobSalary('');
    setJobDesc('');
  };

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">Acquisition</span>
          <h2 className="font-outfit text-xl font-bold text-slate-950 dark:text-white">Talent Recruitment Hub</h2>
        </div>

        <div className="flex items-center space-x-2">
          {/* Tab switches */}
          <div className="flex p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800/40">
            <button
              onClick={() => setActiveTab('pipeline')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${activeTab === 'pipeline' ? 'bg-white dark:bg-slate-850 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500'}`}
            >
              Hiring Pipeline
            </button>
            <button
              onClick={() => setActiveTab('jobs')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${activeTab === 'jobs' ? 'bg-white dark:bg-slate-850 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500'}`}
            >
              Job Postings ({jobs.length})
            </button>
          </div>

          {activeTab === 'jobs' && (
            <button
              onClick={() => setShowAddJobModal(true)}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Post a Job</span>
            </button>
          )}
        </div>
      </div>

      {activeTab === 'pipeline' ? (
        /* Hiring Pipeline (Kanban Board) */
        <div className="space-y-6">
          {/* Dashboard metric overlay */}
          <div className="p-4 rounded-xl border border-indigo-100 dark:border-indigo-950/20 bg-indigo-50/20 dark:bg-indigo-950/5 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400 animate-pulse" />
              <span className="font-semibold text-slate-800 dark:text-slate-200">AI Screening Engaged:</span>
              <span className="text-slate-500">Every resume is automatically parsed, graded (0-100), and summarized.</span>
            </div>
            <div className="flex items-center space-x-2 font-semibold">
              <span className="text-emerald-500 flex items-center"><TrendingUp className="h-3.5 w-3.5 mr-1" /> Avg match: 81%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start">
            {pipelineStages.map((stage) => {
              const stageCandidates = candidates.filter(c => c.status === stage);
              return (
                <div key={stage} className="p-3 rounded-2xl bg-slate-100/40 dark:bg-slate-900/20 border border-slate-200/30 dark:border-slate-800/30 space-y-3 min-h-[500px]">
                  {/* Column Header */}
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200/30 dark:border-slate-850">
                    <span className="text-xs font-bold font-outfit text-slate-700 dark:text-slate-300">{stage}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {stageCandidates.length}
                    </span>
                  </div>

                  {/* Cards inside column */}
                  <div className="space-y-2">
                    {stageCandidates.map((cand) => (
                      <div
                        key={cand.id}
                        onClick={() => setSelectedCandidate(cand)}
                        className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer text-xs space-y-2 hover:shadow-md hover:translate-y-[-1px]
                          ${selectedCandidate?.id === cand.id 
                            ? 'border-indigo-500 bg-indigo-50/10 dark:bg-indigo-950/15' 
                            : 'border-slate-250/20 bg-white dark:bg-slate-950 shadow-sm'}`}
                      >
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-slate-900 dark:text-white truncate pr-1">{cand.name}</h4>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center space-x-0.5
                            ${cand.aiScore >= 90 
                              ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400' 
                              : cand.aiScore >= 75
                              ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400'
                              : 'bg-slate-100 dark:bg-slate-900 text-slate-500'}`}>
                            <Sparkles className="h-2.5 w-2.5 mr-0.5" />
                            {cand.aiScore}%
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 truncate">{cand.jobTitle}</p>
                        <div className="flex justify-between items-center text-[10px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-900">
                          <span>{cand.experienceYears} yrs exp</span>
                          <span className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">Review</span>
                        </div>
                      </div>
                    ))}
                    {stageCandidates.length === 0 && (
                      <div className="py-8 text-center text-slate-400 text-[10px] italic border border-dashed border-slate-200/40 dark:border-slate-800/40 rounded-xl">
                        Drop candidate here
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sliding panel Candidate Detail Inspector */}
          {selectedCandidate && (
            <div className="p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 glass-card grid grid-cols-1 md:grid-cols-3 gap-6 relative animate-in slide-in-from-bottom-3 duration-250">
              <button
                onClick={() => setSelectedCandidate(null)}
                className="absolute top-4 right-4 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
              >
                <X className="h-4 w-4 text-slate-400" />
              </button>

              {/* Col 1: Bio */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3.5">
                  <div className="h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center border border-slate-250 dark:border-slate-800 text-slate-500 font-bold">
                    {selectedCandidate.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-outfit text-sm font-bold text-slate-950 dark:text-white">{selectedCandidate.name}</h3>
                    <p className="text-xs text-slate-500">{selectedCandidate.jobTitle}</p>
                    <span className="text-[10px] text-slate-400">{selectedCandidate.id}</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex justify-between py-1 border-b border-slate-100/50 dark:border-slate-900/50"><span className="text-slate-400">Email</span><span>{selectedCandidate.email}</span></div>
                  <div className="flex justify-between py-1 border-b border-slate-100/50 dark:border-slate-900/50"><span className="text-slate-400">Phone</span><span>{selectedCandidate.phone}</span></div>
                  <div className="flex justify-between py-1 border-b border-slate-100/50 dark:border-slate-900/50"><span className="text-slate-400">Experience</span><span>{selectedCandidate.experienceYears} Years</span></div>
                  <div className="flex justify-between py-1 border-b border-slate-100/50 dark:border-slate-900/50"><span className="text-slate-400">CV Asset</span><span className="font-semibold text-indigo-600 dark:text-indigo-400 cursor-pointer flex items-center"><FileText className="h-3 w-3 mr-1" />{selectedCandidate.resumeUrl}</span></div>
                </div>

                {/* Move pipeline buttons */}
                <div className="pt-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-2">Advance Stage</span>
                  <div className="flex flex-wrap gap-1">
                    {pipelineStages.map((stage) => (
                      <button
                        key={stage}
                        disabled={selectedCandidate.status === stage}
                        onClick={() => moveCandidate(selectedCandidate.id, stage as any)}
                        className={`px-2.5 py-1 text-[9px] font-bold rounded-lg transition-colors
                          ${selectedCandidate.status === stage
                            ? 'bg-slate-200 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
                            : 'bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/30 dark:hover:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'}`}
                      >
                        {stage}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Col 2: AI resume analysis */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-violet-50 to-indigo-50/50 dark:from-indigo-950/10 dark:to-violet-950/5 border border-indigo-100 dark:border-indigo-950/50 space-y-3">
                <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400">
                  <Sparkles className="h-4.5 w-4.5 animate-pulse" />
                  <h4 className="font-outfit text-xs font-bold">AI Screening Assessment</h4>
                </div>
                <div className="flex items-center justify-between bg-white dark:bg-slate-950 px-3 py-2 rounded-lg border border-indigo-100/50 dark:border-indigo-900/35">
                  <span className="text-[11px] font-semibold text-slate-500">Skills Matching Coefficient:</span>
                  <span className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400">{selectedCandidate.aiScore}%</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-normal italic">
                  "{selectedCandidate.aiScreeningSummary}"
                </p>
              </div>

              {/* Col 3: Interview notes */}
              <div className="space-y-3">
                <h4 className="font-outfit text-xs font-bold text-slate-900 dark:text-white">Structured Feedbacks</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedCandidate.interviews.map((int, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/25 dark:border-slate-800/25 text-[11px]">
                      <div className="flex justify-between items-center">
                        <span className="font-bold">{int.round}</span>
                        <div className="flex items-center text-amber-500">
                          {Array.from({ length: 5 }).map((_, idx) => (
                            <Star key={idx} className={`h-3 w-3 ${idx < int.rating ? 'fill-current' : 'text-slate-350'}`} />
                          ))}
                        </div>
                      </div>
                      <span className="text-[9px] text-slate-400 block mt-0.5">{int.interviewer} • {int.date}</span>
                      <p className="text-slate-500 leading-normal mt-1 italic">"{int.feedback}"</p>
                    </div>
                  ))}
                  {selectedCandidate.interviews.length === 0 && (
                    <div className="py-8 text-center text-slate-400 text-[10px] italic border border-dashed border-slate-200/40 dark:border-slate-800/40 rounded-xl">
                      No interviews conducted yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Job Postings Tab */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <div key={job.id} className="p-5 rounded-2xl border border-slate-200/40 dark:border-slate-800/40 glass-card flex flex-col justify-between h-48 hover:shadow-md hover:translate-y-[-2px] transition-all duration-300">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <h4 className="font-outfit font-bold text-slate-950 dark:text-white text-sm">{job.title}</h4>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border
                    ${job.status === 'Open' 
                      ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-250/30' 
                      : job.status === 'Draft'
                      ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border-amber-250/30'
                      : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                    {job.status}
                  </span>
                </div>

                <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-slate-400 font-semibold">
                  <span className="flex items-center"><Briefcase className="h-3.5 w-3.5 mr-1" />{job.department}</span>
                  <span className="flex items-center"><MapPin className="h-3.5 w-3.5 mr-1" />{job.location}</span>
                  <span className="flex items-center"><DollarSign className="h-3.5 w-3.5 mr-1" />{job.salaryRange}</span>
                </div>
                
                <p className="text-[11px] text-slate-500 mt-1 leading-normal limit-lines-2">{job.description}</p>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-slate-150/40 dark:border-slate-850 text-[10px]">
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">{job.applicantsCount} Applicants</span>
                <span className="font-bold text-slate-400">{job.id}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Job Modal */}
      {showAddJobModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-200">
          <form 
            onSubmit={handleCreateJob}
            className="w-full max-w-md rounded-2xl border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-950 p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150"
          >
            <div className="flex justify-between items-center pb-2 border-b border-slate-200/40 dark:border-slate-800/40">
              <h3 className="font-outfit text-sm font-bold text-slate-900 dark:text-white">Post New Job Opening</h3>
              <button 
                type="button"
                onClick={() => setShowAddJobModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
              >
                <X className="h-4 w-4 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Job Title *</label>
                <input
                  type="text"
                  required
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Senior Fullstack Engineer"
                  className="w-full px-3 py-2 rounded-xl bg-slate-100/55 dark:bg-slate-900/40 border border-slate-200/40 dark:border-slate-800/40 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Department</label>
                  <select
                    value={jobDept}
                    onChange={(e) => setJobDept(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100/55 dark:bg-slate-900/40 border border-slate-200/40 dark:border-slate-800/40 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Product">Product</option>
                    <option value="HR">HR</option>
                    <option value="Sales">Sales</option>
                    <option value="Finance">Finance</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Location</label>
                  <input
                    type="text"
                    value={jobLoc}
                    onChange={(e) => setJobLoc(e.target.value)}
                    placeholder="San Francisco / Remote"
                    className="w-full px-3 py-2 rounded-xl bg-slate-100/55 dark:bg-slate-900/40 border border-slate-200/40 dark:border-slate-800/40 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Salary Range</label>
                <input
                  type="text"
                  value={jobSalary}
                  onChange={(e) => setJobSalary(e.target.value)}
                  placeholder="e.g. $130,000 - $160,000"
                  className="w-full px-3 py-2 rounded-xl bg-slate-100/55 dark:bg-slate-900/40 border border-slate-200/40 dark:border-slate-800/40 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Job Description</label>
                <textarea
                  value={jobDesc}
                  onChange={(e) => setJobDesc(e.target.value)}
                  rows={3}
                  placeholder="Summarize key skills, responsibilities, and requirements..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-100/55 dark:bg-slate-900/40 border border-slate-200/40 dark:border-slate-800/40 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t border-slate-200/40 dark:border-slate-800/40">
              <button
                type="button"
                onClick={() => setShowAddJobModal(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/10 transition-colors"
              >
                Publish Posting
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
