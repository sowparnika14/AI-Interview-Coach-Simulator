import React, { useState } from 'react';
import {
  User as UserIcon,
  Save,
  CheckCircle2,
  Video,
  Mic,
  RotateCcw,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { User } from '../types';

interface SettingsViewProps {
  currentUser: User | null;
  onUpdateUser: (updates: Partial<User>) => void;
  onResetData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  currentUser,
  onUpdateUser,
  onResetData,
}) => {
  const [name, setName] = useState(currentUser?.name || '');
  const [targetRole, setTargetRole] = useState(currentUser?.targetRole || 'Senior Frontend Engineer');
  const [experienceLevel, setExperienceLevel] = useState<any>(currentUser?.experienceLevel || 'Mid-level');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      name,
      targetRole,
      experienceLevel,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 selection:bg-[#7657F6]/20">
      <div>
        <h1 className="text-3xl font-extrabold text-[#10152B] tracking-tight font-heading">
          Profile & Preferences
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Customize your career targets and simulator hardware preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left: Profile Form (md:col-span-8) */}
        <div className="md:col-span-8 bg-white rounded-2xl p-6 sm:p-8 border border-[#F0EDFF] shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
            <div className="w-12 h-12 rounded-full bg-[#7657F6]/15 text-[#7657F6] font-bold text-sm flex items-center justify-center border border-[#7657F6]/20">
              {name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'AI'}
            </div>
            <div>
              <h2 className="text-base font-bold text-[#10152B]">Candidate Profile</h2>
              <p className="text-xs text-gray-500">Your profile details guide question difficulty</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            {savedSuccess && (
              <div className="p-3 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Profile updated successfully!</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7657F6]/20 focus:border-[#7657F6]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Target Job Title</label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7657F6]/20 focus:border-[#7657F6]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Experience Tier</label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7657F6]/20 focus:border-[#7657F6]"
              >
                <option value="Entry-level">Entry-level (0-2 years)</option>
                <option value="Mid-level">Mid-level (3-5 years)</option>
                <option value="Senior">Senior (5-8 years)</option>
                <option value="Lead / Principal">Lead / Principal (8+ years)</option>
              </select>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#7657F6] hover:bg-[#6344E8] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right: Hardware & Reset (md:col-span-4) */}
        <div className="md:col-span-4 space-y-6">
          {/* Quick Hardware Checklist */}
          <div className="bg-white rounded-2xl p-6 border border-[#F0EDFF] shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Hardware Status
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-2.5 text-xs font-medium text-gray-700">
                  <Mic className="w-4 h-4 text-[#7657F6]" />
                  <span>Microphone</span>
                </div>
                <span className="text-[11px] font-bold text-[#20BFA9]">Ready</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-2.5 text-xs font-medium text-gray-700">
                  <Video className="w-4 h-4 text-[#7657F6]" />
                  <span>Webcam Preview</span>
                </div>
                <span className="text-[11px] font-bold text-[#20BFA9]">Connected</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-2.5 text-xs font-medium text-gray-700">
                  <ShieldCheck className="w-4 h-4 text-[#7657F6]" />
                  <span>Audio Synthesis</span>
                </div>
                <span className="text-[11px] font-bold text-[#20BFA9]">Supported</span>
              </div>
            </div>
          </div>

          {/* Reset / Sample Data */}
          <div className="bg-white rounded-2xl p-6 border border-[#F0EDFF] shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Local Storage
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Your mock interviews and uploaded resumes are preserved in your browser's local storage.
            </p>
            <button
              onClick={onResetData}
              className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Sample Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
