'use client';

import React, { useState } from 'react';
import { UserProfile } from '@/types/migration';
import { 
  FileText, 
  Printer, 
  Sparkles, 
  X, 
  Plus, 
  Trash2, 
  Loader2,
  CheckCircle2
} from 'lucide-react';

interface ResumeBuilderModalProps {
  profile: UserProfile;
  targetCountry?: string;
  onClose: () => void;
  apiKey?: string;
}

export const ResumeBuilderModal: React.FC<ResumeBuilderModalProps> = ({
  profile,
  targetCountry = 'Germany',
  onClose,
  apiKey,
}) => {
  // اطلاعات اولیه پر شده از فرم کاربر
  const [fullName, setFullName] = useState(profile.personal?.fullName || 'Full Name');
  const [jobTitle, setJobTitle] = useState(profile.work?.jobTitle || 'Software Engineer');
  const [phone, setPhone] = useState(profile.personal?.phone || '+98 912 ...');
  const [email, setEmail] = useState('applicant@email.com');
  const [location, setLocation] = useState('Tehran, Iran (Willing to Relocate)');
  
  const [summary, setSummary] = useState(
    `Dedicated and results-oriented professional with ${profile.work?.yearsExperience || 2}+ years of experience in ${profile.work?.jobTitle || 'the industry'}. Skilled in delivering high-impact solutions, collaborating across multidisciplinary teams, and adapting quickly to international workflows.`
  );

  const [degree, setDegree] = useState<string>(
    profile.education?.degree === 'master' ? 'Master of Science' : profile.education?.degree === 'phd' ? 'Ph.D.' : 'Bachelor of Science'
  );
  const [field, setField] = useState<string>(profile.education?.field || 'Computer Science');
  const [university, setUniversity] = useState<string>(
    profile.education?.universityType === 'state_top' ? 'Sharif / Tehran University' : 'State University of Tehran'
  );
  const [graduationYear, setGraduationYear] = useState('2022');

  const [bullets, setBullets] = useState<string[]>([
    `Executed critical projects aligned with international quality benchmarks in ${profile.work?.jobTitle || 'specialized area'}.`,
    `Streamlined operational processes, resulting in a 25% improvement in workflow efficiency.`,
    `Collaborated with cross-functional stakeholders to deliver milestones ahead of schedule.`
  ]);

  const [skills, setSkills] = useState<string[]>([
    profile.education?.field || 'Engineering',
    profile.work?.jobTitle || 'Specialist',
    'Project Management',
    'Problem Solving',
    'Team Collaboration',
    `English (${profile.languages?.englishLevel || 'Intermediate'})`
  ]);

  const [isPolishing, setIsPolishing] = useState(false);
  const [polishSuccess, setPolishSuccess] = useState(false);

  // اضافه یا حذف بولت
  const handleAddBullet = () => setBullets(prev => [...prev, 'New achievement or key project responsibility.']);
  const handleRemoveBullet = (index: number) => setBullets(prev => prev.filter((_, i) => i !== index));
  const handleUpdateBullet = (index: number, val: string) => {
    setBullets(prev => {
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });
  };

  // اضافه یا حذف مهارت
  const handleAddSkill = () => setSkills(prev => [...prev, 'New Skill']);
  const handleRemoveSkill = (index: number) => setSkills(prev => prev.filter((_, i) => i !== index));
  const handleUpdateSkill = (index: number, val: string) => {
    setSkills(prev => {
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });
  };

  // بهینه‌سازی رزومه با هوش مصنوعی
  const handleAIPolish = async () => {
    setIsPolishing(true);
    setPolishSuccess(false);

    try {
      const res = await fetch('/api/resume-polish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle,
          field,
          text: bullets.join('\n'),
          targetCountry,
          apiKey: apiKey || undefined,
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (data.summary) setSummary(data.summary);
        if (data.bulletPoints && Array.isArray(data.bulletPoints)) setBullets(data.bulletPoints);
        if (data.skills && Array.isArray(data.skills)) setSkills(data.skills);
        setPolishSuccess(true);
        setTimeout(() => setPolishSuccess(false), 4000);
      }
    } catch (err) {
      console.error('Polish failed:', err);
    } finally {
      setIsPolishing(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* نوار ابزار بالا (غیرقابل پرینت) */}
        <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 no-print">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">
                  رزومه‌ساز استاندارد بین‌المللی (ATS-Friendly CV Builder)
                </h3>
                <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] px-2 py-0.5 rounded-full font-bold">
                  ویژه {targetCountry}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                اطلاعات به طور خودکار از پرونده شما نشسته است. می‌توانید عبارات را ویرایش یا با هوش مصنوعی ارتقا دهید.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAIPolish}
              disabled={isPolishing}
              className="px-3.5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
              title="بازنویسی خودکار جملات به زبان انگلیسی تجاری قوی"
            >
              {isPolishing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-amber-300" />}
              <span>{isPolishing ? 'در حال ارتقا با AI...' : '✨ بهینه‌سازی انگلیسی با AI'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-400" />
              <span>چاپ و ذخیره PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {polishSuccess && (
          <div className="bg-emerald-500/10 border-b border-emerald-500/20 text-emerald-300 px-4 py-2 text-xs flex items-center gap-2 no-print">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>رزومه شما با موفقیت به استانداردهای بین‌المللی و عبارات قدرتمند انگلیسی ارتقا یافت!</span>
          </div>
        )}

        {/* برگه پیش‌نمایش و ویرایش رزومه (طراحی تمیز به سبک بین‌المللی) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-950/40">
          <div 
            id="printable-cv"
            dir="ltr" 
            className="bg-white text-slate-900 rounded-2xl p-6 sm:p-10 shadow-2xl max-w-3xl mx-auto space-y-6 font-sans text-left"
          >
            {/* سربرگ مشخصات فردی */}
            <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <div>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight bg-transparent border-b border-dashed border-slate-300 hover:border-slate-800 focus:outline-none focus:border-indigo-600 transition w-full"
                />
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="text-sm sm:text-base font-bold text-indigo-700 mt-1 bg-transparent border-b border-dashed border-slate-300 hover:border-slate-800 focus:outline-none focus:border-indigo-600 transition w-full"
                />
              </div>

              <div className="text-xs text-slate-600 space-y-0.5 text-left sm:text-right">
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-transparent text-xs text-slate-600 text-left sm:text-right border-b border-dashed border-slate-300 focus:outline-none w-full"
                />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent text-xs text-slate-600 text-left sm:text-right border-b border-dashed border-slate-300 focus:outline-none w-full"
                />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="bg-transparent text-xs text-slate-600 text-left sm:text-right border-b border-dashed border-slate-300 focus:outline-none w-full"
                />
              </div>
            </div>

            {/* خلاصه حرفه‌ای (Executive Summary) */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1">
                Professional Summary
              </h4>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={3}
                className="w-full text-xs text-slate-700 leading-relaxed bg-transparent border border-dashed border-slate-200 hover:border-slate-400 p-2 rounded focus:outline-none focus:border-indigo-600"
              />
            </div>

            {/* سوابق شغلی و پروژه‌ها (Experience & Achievements) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b border-slate-200 pb-1">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                  Professional Experience
                </h4>
                <button
                  onClick={handleAddBullet}
                  className="text-[10px] text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 no-print"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Line</span>
                </button>
              </div>

              <div className="flex justify-between items-baseline text-xs font-bold text-slate-800 pt-1">
                <span>{jobTitle} — Primary Enterprise / Tech Firm</span>
                <span className="text-slate-500 font-normal">2020 – Present</span>
              </div>

              <div className="space-y-1.5 pt-1">
                {bullets.map((bullet, idx) => (
                  <div key={idx} className="flex items-start gap-2 group">
                    <span className="text-indigo-600 font-bold mt-1 text-xs">•</span>
                    <input
                      type="text"
                      value={bullet}
                      onChange={(e) => handleUpdateBullet(idx, e.target.value)}
                      className="flex-1 text-xs text-slate-700 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-600 focus:outline-none transition py-0.5"
                    />
                    <button
                      onClick={() => handleRemoveBullet(idx)}
                      className="opacity-0 group-hover:opacity-100 text-rose-500 hover:text-rose-700 transition p-1 no-print"
                      title="Delete line"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* تحصیلات (Education) */}
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1">
                Education & Credentials
              </h4>
              <div className="flex justify-between items-baseline text-xs text-slate-800 pt-1 gap-2">
                <div className="space-y-0.5 flex-1">
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={degree}
                      onChange={(e) => setDegree(e.target.value)}
                      className="font-bold text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:outline-none w-36"
                    />
                    <span>in</span>
                    <input
                      type="text"
                      value={field}
                      onChange={(e) => setField(e.target.value)}
                      className="font-bold text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:outline-none flex-1"
                    />
                  </div>
                  <input
                    type="text"
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    className="text-slate-600 text-[11px] bg-transparent border-b border-transparent hover:border-slate-300 focus:outline-none w-full"
                  />
                </div>
                <input
                  type="text"
                  value={graduationYear}
                  onChange={(e) => setGraduationYear(e.target.value)}
                  className="text-slate-500 text-xs font-mono bg-transparent border-b border-transparent hover:border-slate-300 focus:outline-none text-right w-16"
                />
              </div>
            </div>

            {/* مهارت‌ها و زبان‌ها (Skills & Languages) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b border-slate-200 pb-1">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                  Skills & Languages
                </h4>
                <button
                  onClick={handleAddSkill}
                  className="text-[10px] text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 no-print"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Skill</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {skills.map((skill, sIdx) => (
                  <div 
                    key={sIdx}
                    className="inline-flex items-center gap-1 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded text-[11px] text-slate-800 group"
                  >
                    <input
                      type="text"
                      value={skill}
                      onChange={(e) => handleUpdateSkill(sIdx, e.target.value)}
                      className="bg-transparent border-none focus:outline-none text-[11px] w-auto max-w-[140px]"
                    />
                    <button
                      onClick={() => handleRemoveSkill(sIdx)}
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 transition ml-0.5 no-print"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* فوتر مودال */}
        <div className="p-3 bg-slate-900 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400 no-print px-6">
          <span>فرمت خروجی کاملاً منطبق بر استاندارد بین‌المللی ATS است.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition"
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  );
};
