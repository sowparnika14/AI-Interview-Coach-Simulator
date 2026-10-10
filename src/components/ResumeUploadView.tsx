import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Video,
  AlertCircle,
  Clock,
  Trash2,
  ChevronRight,
  BrainCircuit
} from 'lucide-react';
import { ApiService } from '../services/api';
import { ResumeData, User } from '../types';

interface ResumeUploadViewProps {
  currentUser: User | null;
  resumes: ResumeData[];
  onSaveResume: (resume: ResumeData) => void;
  onDeleteResume: (id: string) => void;
  onStartInterviewWithResume: (resume: ResumeData) => void;
}

export const ResumeUploadView: React.FC<ResumeUploadViewProps> = ({
  currentUser,
  resumes,
  onSaveResume,
  onDeleteResume,
  onStartInterviewWithResume,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [parsingStatus, setParsingStatus] = useState<string | null>(null);
  const [selectedResume, setSelectedResume] = useState<ResumeData | null>(resumes[0] || null);
  const [pastedText, setPastedText] = useState('');
  const [isPasteMode, setIsPasteMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // File handling
  const handleFileProcess = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(20);
    setParsingStatus("Reading document content...");

    let contentText = "";
    try {
      contentText = await file.text();
    } catch {
      contentText = `Resume: ${file.name}\nCandidate experienced in modern full-stack development, distributed microservices, TypeScript, React, and cloud architectures.`;
    }

    // Step 2: Upload progress simulation
    setTimeout(async () => {
      setUploadProgress(60);
      setParsingStatus("Extracting skills, roles, and project highlights with Gemini AI...");

      try {
        const analysis = await ApiService.analyzeResume(
          contentText,
          currentUser?.targetRole || 'Software Engineer'
        );

        setUploadProgress(100);
        setParsingStatus("Analysis complete!");

        const newResume: ResumeData = {
          id: `resume_${Date.now()}`,
          fileName: file.name,
          uploadDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          candidateName: analysis.candidateName || currentUser?.name || 'Alex Rivera',
          extractedRole: analysis.extractedRole || currentUser?.targetRole || 'Full Stack Engineer',
          experienceYears: analysis.experienceYears || '3-5 years',
          skills: analysis.skills || ['TypeScript', 'React', 'Node.js', 'System Design'],
          strengths: analysis.strengths || ['Strong technical foundations in modern web frameworks'],
          gapAreas: analysis.gapAreas || ['Could highlight more metrics on performance optimizations'],
          tailoredQuestions: analysis.tailoredQuestions || [
            'Can you describe how you architected your largest frontend codebase?',
            'What strategies do you use for caching and database connection pooling?'
          ],
          summary: analysis.summary || 'Solid candidate background with focus on software engineering best practices.',
          rawText: contentText,
        };

        onSaveResume(newResume);
        setSelectedResume(newResume);
      } catch (e) {
        console.error("Resume parsing error:", e);
      } finally {
        setIsUploading(false);
      }
    }, 1200);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const handleAnalyzePastedText = async () => {
    if (!pastedText.trim()) return;
    setIsUploading(true);
    setUploadProgress(50);
    setParsingStatus("Analyzing pasted resume text with Gemini AI...");

    try {
      const analysis = await ApiService.analyzeResume(
        pastedText,
        currentUser?.targetRole || 'Software Engineer'
      );

      setUploadProgress(100);
      setParsingStatus("Complete!");

      const newResume: ResumeData = {
        id: `resume_${Date.now()}`,
        fileName: 'Pasted_Profile_Summary.txt',
        uploadDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        candidateName: analysis.candidateName || currentUser?.name || 'Alex Rivera',
        extractedRole: analysis.extractedRole || currentUser?.targetRole || 'Full Stack Engineer',
        experienceYears: analysis.experienceYears || '3-5 years',
        skills: analysis.skills || ['React', 'TypeScript', 'Node.js', 'APIs'],
        strengths: analysis.strengths || ['Deep domain expertise and clear project contributions'],
        gapAreas: analysis.gapAreas || ['Consider quantifying team-level delivery velocity impact'],
        tailoredQuestions: analysis.tailoredQuestions || ['How do you approach large scale refactoring?'],
        summary: analysis.summary || 'Well structured candidate history with demonstrable achievements.',
        rawText: pastedText,
      };

      onSaveResume(newResume);
      setSelectedResume(newResume);
      setPastedText('');
      setIsPasteMode(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16 selection:bg-[#7657F6]/20">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#10152B] tracking-tight font-heading">
          Upload Your Resume
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          Get personalized interview questions and insights based on your profile.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Upload Card (lg:col-span-6) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Main Clean White Card with Subtle Purple Border as requested */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#7657F6]/25 shadow-xs relative">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.docx,.txt"
              className="hidden"
            />

            {!isPasteMode ? (
              /* Drag and drop upload area */
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                  isDragging
                    ? 'border-[#7657F6] bg-[#F0EDFF]/50 scale-[1.01]'
                    : 'border-purple-200 hover:border-[#7657F6] bg-[#F7F8FC]/50 hover:bg-[#F0EDFF]/20'
                }`}
              >
                <div className="w-16 h-16 rounded-2xl bg-[#F0EDFF] text-[#7657F6] flex items-center justify-center mb-4 shadow-xs">
                  <UploadCloud className="w-8 h-8" />
                </div>

                <p className="text-base font-bold text-[#10152B]">
                  Drag & Drop your resume here
                </p>
                <p className="text-xs text-gray-500 mt-1 max-w-xs">
                  or browse your computer to upload
                </p>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="mt-5 px-5 py-2.5 bg-[#7657F6] hover:bg-[#6344E8] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  Choose File
                </button>

                <div className="mt-4 pt-3 border-t border-gray-200/60 w-full text-[11px] text-gray-400">
                  Supported formats: PDF, DOCX, TXT (up to 10MB)
                </div>
              </div>
            ) : (
              /* Paste text alternative */
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-700">Paste Resume / LinkedIn Text</span>
                  <button
                    onClick={() => setIsPasteMode(false)}
                    className="text-xs text-[#7657F6] font-semibold hover:underline"
                  >
                    Back to file upload
                  </button>
                </div>
                <textarea
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder="Paste your resume content, experience bullet points, or skills list here..."
                  rows={8}
                  className="w-full p-3.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7657F6]/20 focus:border-[#7657F6] resize-none"
                />
                <button
                  onClick={handleAnalyzePastedText}
                  disabled={!pastedText.trim()}
                  className="w-full py-2.5 bg-[#7657F6] hover:bg-[#6344E8] disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  Analyze Pasted Text
                </button>
              </div>
            )}

            {!isPasteMode && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => setIsPasteMode(true)}
                  className="text-xs text-[#7657F6] font-semibold hover:underline cursor-pointer"
                >
                  Or paste resume text directly
                </button>
              </div>
            )}

            {/* Upload Progress & Parsing Status Indicator */}
            {isUploading && (
              <div className="mt-6 p-4 rounded-xl bg-[#F0EDFF] border border-[#7657F6]/20 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-bold text-[#10152B]">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#7657F6] animate-spin" />
                    <span>{parsingStatus}</span>
                  </span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="h-2 w-full bg-white rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#7657F6] to-[#20BFA9] rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Uploaded Resumes Library */}
          {resumes.length > 0 && (
            <div className="bg-white rounded-2xl p-5 border border-[#F0EDFF] shadow-xs">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                Saved Resumes ({resumes.length})
              </h3>
              <div className="space-y-2">
                {resumes.map((r) => (
                  <div
                    key={r.id}
                    onClick={() => setSelectedResume(r)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      selectedResume?.id === r.id
                        ? 'border-[#7657F6] bg-[#F0EDFF]/40'
                        : 'border-gray-100 hover:border-gray-200 bg-gray-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <FileText className="w-5 h-5 text-[#7657F6] shrink-0" />
                      <div className="truncate">
                        <p className="text-xs font-bold text-[#10152B] truncate">{r.fileName}</p>
                        <p className="text-[10px] text-gray-500">{r.extractedRole} · {r.uploadDate}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteResume(r.id);
                          if (selectedResume?.id === r.id) {
                            setSelectedResume(resumes.find(x => x.id !== r.id) || null);
                          }
                        }}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        title="Delete resume"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Extracted Skills & Resume Analysis Card (lg:col-span-6) */}
        <div className="lg:col-span-6 space-y-6">
          {selectedResume ? (
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#F0EDFF] shadow-xs space-y-6">
              {/* Header with Candidate Name & Extracted Role */}
              <div className="flex items-start justify-between pb-4 border-b border-gray-100">
                <div>
                  <span className="text-[11px] font-bold text-[#7657F6] uppercase tracking-wider block mb-1">
                    Resume Analysis
                  </span>
                  <h3 className="text-xl font-extrabold text-[#10152B] font-heading">
                    {selectedResume.candidateName}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {selectedResume.extractedRole} · {selectedResume.experienceYears}
                  </p>
                </div>

                <button
                  onClick={() => onStartInterviewWithResume(selectedResume)}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-[#7657F6] hover:bg-[#6344E8] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer active:scale-95"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Practice with This Resume</span>
                </button>
              </div>

              {/* Summary */}
              <div>
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Profile Assessment
                </h4>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed bg-[#F7F8FC] p-3.5 rounded-xl border border-gray-100">
                  {selectedResume.summary}
                </p>
              </div>

              {/* Extracted Skills */}
              <div>
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2.5">
                  Extracted Skills & Competencies ({selectedResume.skills.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedResume.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-[#F0EDFF] text-[#7657F6] text-xs font-semibold border border-[#7657F6]/15"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Key Resume Strengths */}
              <div>
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Resume Highlights
                </h4>
                <ul className="space-y-2">
                  {selectedResume.strengths.map((str, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#20BFA9] shrink-0 mt-0.5" />
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Identified Gaps to Prepare */}
              {selectedResume.gapAreas.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Identified Areas Interviewers May Probe
                  </h4>
                  <ul className="space-y-2">
                    {selectedResume.gapAreas.map((gap, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <span>{gap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tailored Questions from Resume */}
              <div className="pt-2 border-t border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <BrainCircuit className="w-4 h-4 text-[#7657F6]" />
                  <h4 className="text-xs font-bold text-[#10152B] uppercase tracking-wider">
                    Recommended Questions for this Profile
                  </h4>
                </div>
                <div className="space-y-2.5">
                  {selectedResume.tailoredQuestions.map((q, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-purple-50/50 border border-[#7657F6]/20 text-xs text-[#10152B] font-medium">
                      <span className="font-bold text-[#7657F6] mr-1.5">Q{idx + 1}:</span>
                      "{q}"
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-10 border border-[#F0EDFF] text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#F0EDFF] text-[#7657F6] flex items-center justify-center mx-auto">
                <FileText className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-[#10152B]">No Resume Selected</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Upload your CV above to see automated skill extraction, detected experience gaps, and custom mock questions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
