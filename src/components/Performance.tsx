import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  BookOpen, 
  Play, 
  Star, 
  ArrowRight,
  Sparkles,
  Plus
} from 'lucide-react';
import { mockGoals, mockCourses, type Goal, type Course } from '../data/mockData';

interface PerformanceProps {
  defaultSubTab?: 'okrs' | 'feedback' | 'lms';
}

export const Performance: React.FC<PerformanceProps> = ({ defaultSubTab = 'okrs' }) => {
  const [goals, setGoals] = useState<Goal[]>(mockGoals);
  const [courses] = useState<Course[]>(mockCourses);
  const [activeSubTab, setActiveSubTab] = useState<'okrs' | 'feedback' | 'lms'>(defaultSubTab);

  useEffect(() => {
    setActiveSubTab(defaultSubTab);
  }, [defaultSubTab]);

  // Self assessment state
  const [achievements, setAchievements] = useState('');
  const [roadblocks, setRoadblocks] = useState('');
  const [assessmentScore, setAssessmentScore] = useState(4);

  // LMS active video course mock
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleCreateGoal = () => {
    const title = prompt("Enter goal title:");
    if (!title) return;
    
    const newGoal: Goal = {
      id: `G-${goals.length + 301}`,
      employeeId: "EMP-2026-004",
      title,
      type: "Personal",
      target: "Self development milestone",
      progress: 0,
      status: "In-Progress",
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
    setGoals([...goals, newGoal]);
  };

  const handleUpdateProgress = (goalId: string, currentProgress: number) => {
    const nextProgress = Math.min(100, currentProgress + 10);
    setGoals(prev => prev.map(g => {
      if (g.id === goalId) {
        return { 
          ...g, 
          progress: nextProgress, 
          status: nextProgress === 100 ? 'Completed' : 'In-Progress' 
        };
      }
      return g;
    }));
  };

  const handleAssessmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!achievements) return;
    alert("Self assessment dossier locked and dispatched to reporting manager.");
    setAchievements('');
    setRoadblocks('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">Evaluation & Training</span>
          <h2 className="font-outfit text-xl font-bold text-slate-950 dark:text-white">Performance reviews & LMS</h2>
        </div>

        <div className="flex p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800/40 text-xs font-semibold">
          <button
            onClick={() => setActiveSubTab('okrs')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${activeSubTab === 'okrs' ? 'bg-white dark:bg-slate-850 text-indigo-650 dark:text-indigo-400 shadow-sm' : 'text-slate-500'}`}
          >
            OKRs & Goals
          </button>
          <button
            onClick={() => setActiveSubTab('feedback')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${activeSubTab === 'feedback' ? 'bg-white dark:bg-slate-850 text-indigo-650 dark:text-indigo-400 shadow-sm' : 'text-slate-500'}`}
          >
            Review Feedback
          </button>
          <button
            onClick={() => setActiveSubTab('lms')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${activeSubTab === 'lms' ? 'bg-white dark:bg-slate-850 text-indigo-650 dark:text-indigo-400 shadow-sm' : 'text-slate-500'}`}
          >
            Learning LMS
          </button>
        </div>
      </div>

      {activeSubTab === 'okrs' && (
        /* OKRs Panel */
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start animate-in fade-in duration-200">
          <div className="xl:col-span-2 p-5 rounded-2xl border border-slate-200/40 dark:border-slate-800/40 glass-card space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-150/40 dark:border-slate-850">
              <h3 className="font-outfit text-sm font-bold text-slate-950 dark:text-white">Active Objectives (Q3)</h3>
              <button
                onClick={handleCreateGoal}
                className="flex items-center space-x-1 px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[10px] font-semibold transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Goal</span>
              </button>
            </div>

            <div className="space-y-4">
              {goals.map((goal) => (
                <div key={goal.id} className="p-4 rounded-xl bg-slate-50/50 dark:bg-slate-900/30 border border-slate-200/20 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className={`px-2 py-0.5 text-[8px] font-bold rounded uppercase tracking-wider
                        ${goal.type === 'OKR' 
                          ? 'bg-violet-50 dark:bg-violet-950/20 text-violet-600 border border-violet-200/30' 
                          : 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 border border-indigo-200/30'}`}>
                        {goal.type}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-2">{goal.title}</h4>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Target: {goal.target}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">Due: {goal.dueDate}</span>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold">
                      <span>Progress Status</span>
                      <span>{goal.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${goal.progress}%` }}></div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className={`text-[10px] font-semibold ${goal.status === 'Completed' ? 'text-emerald-500' : 'text-amber-500'}`}>
                      {goal.status}
                    </span>
                    {goal.status !== 'Completed' && (
                      <button
                        onClick={() => handleUpdateProgress(goal.id, goal.progress)}
                        className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        Advance Progress +10%
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Insights & Performance Suggestions */}
          <div className="p-5 rounded-2xl border border-indigo-150 dark:border-indigo-950 bg-gradient-to-br from-indigo-50/50 to-violet-50/30 dark:from-indigo-950/10 dark:to-violet-950/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-24 h-24 rounded-full bg-indigo-500/10 blur-xl animate-pulse-slow"></div>
            
            <div className="flex items-center space-x-2 text-indigo-650 dark:text-indigo-400 mb-4">
              <Sparkles className="h-4.5 w-4.5 animate-pulse" />
              <h4 className="font-outfit text-sm font-bold">HelixAI Review Suggestions</h4>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-white dark:bg-slate-950 border border-indigo-100 dark:border-indigo-900/40 rounded-xl">
                <span className="font-bold block text-slate-850 dark:text-slate-200">Engineering Performance:</span>
                <p className="text-[10px] text-slate-500 leading-normal mt-1">Vikram Mehta matches 94.6% competency scale in React Architecture. Promoted suggestion: Lead Q4 UX consolidation initiative.</p>
              </div>

              <div className="p-3 bg-white dark:bg-slate-950 border border-indigo-100 dark:border-indigo-900/40 rounded-xl">
                <span className="font-bold block text-slate-850 dark:text-slate-200">Goal Alignment Alert:</span>
                <p className="text-[10px] text-slate-500 leading-normal mt-1">Leave requests pattern intersects with critical goal: "Launch onboarding redesign". AI advised moving due date back by 5 business days.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'feedback' && (
        /* Reviews Hub */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start animate-in fade-in duration-200">
          {/* Assessment Form */}
          <form 
            onSubmit={handleAssessmentSubmit}
            className="lg:col-span-2 p-5 rounded-2xl border border-slate-200/40 dark:border-slate-800/40 glass-card space-y-4"
          >
            <h3 className="font-outfit text-sm font-bold text-slate-950 dark:text-white pb-2 border-b border-slate-150/40">Self-Assessment Portal</h3>
            
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Key achievements this quarter *</label>
                <textarea
                  required
                  rows={3}
                  value={achievements}
                  onChange={(e) => setAchievements(e.target.value)}
                  placeholder="Completed migration to PostgreSQL, designed 4 new components, resolved 12 backend anomalies..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-100/55 dark:bg-slate-900/40 border border-slate-200/40 dark:border-slate-800/40 focus:outline-none focus:border-indigo-500 resize-none text-[11px]"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Key obstacles / roadblocks faced</label>
                <textarea
                  rows={2}
                  value={roadblocks}
                  onChange={(e) => setRoadblocks(e.target.value)}
                  placeholder="Experienced transient dev server lag, complex third-party API documentation delays..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-100/55 dark:bg-slate-900/40 border border-slate-200/40 dark:border-slate-800/40 focus:outline-none focus:border-indigo-500 resize-none text-[11px]"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1.5">Rate your overall performance (1-5)</label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setAssessmentScore(num)}
                      className={`h-9 w-9 rounded-xl flex items-center justify-center border font-bold transition-all duration-200
                        ${assessmentScore === num
                          ? 'bg-indigo-650 border-indigo-600 text-white shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-500'}`}
                    >
                      {num}
                    </button>
                  ))}
                  <span className="text-[11px] font-semibold text-slate-450 ml-2">
                    {assessmentScore === 5 ? 'Exceptional' : assessmentScore === 4 ? 'Exceeds Expectations' : 'Meets Expectations'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-650 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/10 transition-colors"
              >
                Dispatch Review Roster
              </button>
            </div>
          </form>

          {/* Feedback list */}
          <div className="p-5 rounded-2xl border border-slate-200/40 dark:border-slate-800/40 glass-card space-y-4">
            <h4 className="font-outfit text-sm font-bold text-slate-950 dark:text-white">Peer & Manager Review Summary</h4>
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-50/50 dark:bg-slate-900/30 border border-slate-200/20 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold">VP Engineering Feedbacks</span>
                  <div className="flex items-center text-amber-500"><Star className="h-3.5 w-3.5 fill-current" /><Star className="h-3.5 w-3.5 fill-current" /><Star className="h-3.5 w-3.5 fill-current" /><Star className="h-3.5 w-3.5 fill-current" /><Star className="h-3.5 w-3.5 fill-current text-slate-300 dark:text-slate-800" /></div>
                </div>
                <span className="text-[9px] text-slate-450 block mt-0.5">Marcus Vance • June 2026</span>
                <p className="text-[10px] text-slate-500 italic leading-normal mt-2">"Vikram demonstrates stellar frontend technical acumen. Self-directed and requires minimal oversight. Recommended for team architectural scaling tasks."</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50/50 dark:bg-slate-900/30 border border-slate-200/20 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold">Principal Engineer Feedbacks</span>
                  <div className="flex items-center text-amber-500"><Star className="h-3.5 w-3.5 fill-current" /><Star className="h-3.5 w-3.5 fill-current" /><Star className="h-3.5 w-3.5 fill-current" /><Star className="h-3.5 w-3.5 fill-current" /><Star className="h-3.5 w-3.5 fill-current" /></div>
                </div>
                <span className="text-[9px] text-slate-450 block mt-0.5">Sarah Jenkins • May 2026</span>
                <p className="text-[10px] text-slate-500 italic leading-normal mt-2">"Outstanding collaboration skillsets. Standardized UI component states during our system architecture migration."</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'lms' && (
        /* LMS Video Player */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start animate-in fade-in duration-200">
          {/* Main course player/list */}
          <div className="lg:col-span-2 space-y-6">
            {activeCourse ? (
              /* Custom mock course player */
              <div className="p-5 rounded-2xl border border-slate-200/40 dark:border-slate-800/40 glass-card space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-indigo-500">{activeCourse.category}</span>
                    <h3 className="font-outfit text-sm font-bold text-slate-950 dark:text-white mt-1">{activeCourse.title}</h3>
                  </div>
                  <button
                    onClick={() => {
                      setActiveCourse(null);
                      setIsPlaying(false);
                    }}
                    className="px-2.5 py-1.5 border border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900 rounded-xl text-[10px] font-bold"
                  >
                    Back to courses
                  </button>
                </div>

                {/* Video container mock */}
                <div className="relative h-64 w-full bg-slate-950 rounded-xl border border-slate-900 flex flex-col items-center justify-center text-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-indigo-950/20 to-transparent"></div>
                  
                  {isPlaying ? (
                    <div className="space-y-3 z-10 animate-pulse">
                      <div className="h-10 w-10 rounded-full border-2 border-indigo-500 flex items-center justify-center mx-auto text-indigo-500 font-bold font-mono">▶</div>
                      <span className="text-[10px] font-mono text-slate-350">Streaming Sandbox Video feed... (Duration: {activeCourse.duration})</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsPlaying(true)}
                      className="h-14 w-14 rounded-full bg-indigo-600 hover:bg-indigo-700 hover:scale-105 transition-all text-white flex items-center justify-center z-10 shadow-lg shadow-indigo-650/20"
                    >
                      <Play className="h-6 w-6 fill-current translate-x-0.5" />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* Courses list */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {courses.map((course) => (
                  <div key={course.id} className="p-4 rounded-2xl border border-slate-200/40 dark:border-slate-800/40 glass-card flex flex-col justify-between h-56 hover:shadow-md hover:translate-y-[-2px] transition-all duration-300">
                    <div className="space-y-2">
                      <span className="text-[9px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">{course.category}</span>
                      <h4 className="font-outfit font-bold text-slate-950 dark:text-white text-xs">{course.title}</h4>
                      <p className="text-[10px] text-slate-400">{course.modulesCount} modules • {course.duration}</p>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-900 mt-4 text-[10px]">
                      <span className="flex items-center text-amber-500 font-semibold"><Star className="h-3.5 w-3.5 fill-current mr-1" />{course.rating}</span>
                      <button
                        onClick={() => setActiveCourse(course)}
                        className="flex items-center space-x-1 text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                      >
                        <span>Start Training</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Curriculum widget */}
          <div className="p-5 rounded-2xl border border-slate-200/40 dark:border-slate-800/40 glass-card space-y-4">
            <h4 className="font-outfit text-sm font-bold text-slate-950 dark:text-white">Active Training Course Syllabus</h4>
            <p className="text-[10px] text-slate-500 leading-normal mt-0.5">Assigned learning progress parameters for certification credit.</p>
            
            <div className="space-y-2 text-[11px]">
              <div className="flex items-center space-x-2.5 p-2 bg-slate-50/50 dark:bg-slate-900/30 rounded-lg">
                <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                <span className="text-slate-700 dark:text-white font-medium">1. Enterprise IAM Security (Passed)</span>
              </div>
              <div className="flex items-center space-x-2.5 p-2 bg-slate-50/50 dark:bg-slate-900/30 rounded-lg">
                <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                <span className="text-slate-700 dark:text-white font-medium">2. Data Anonymization Protocols (Passed)</span>
              </div>
              <div className="flex items-center space-x-2.5 p-2 bg-indigo-500/5 dark:bg-indigo-950/20 border border-indigo-500/10 rounded-lg">
                <BookOpen className="h-4 w-4 text-indigo-500 flex-shrink-0" />
                <span className="text-indigo-650 dark:text-indigo-400 font-bold">3. Network Access Controls (Enrolled)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
