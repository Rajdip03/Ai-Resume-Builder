import React, { useEffect, useState, useMemo } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast';
import { dummyResumeData } from '../assets/assets';
import { ArrowLeftIcon, Briefcase, ChevronLeft, ChevronRight, FileText, FolderIcon, GraduationCap, Sparkles, User, Loader2, Share2Icon, EyeIcon, EyeOffIcon, DownloadIcon, ScanLineIcon } from 'lucide-react';
import PersonalInfoForm from '../components/PersonalInfoForm';
import ResumePreview from '../components/ResumePreview';
import TemplateSelector from '../components/TemplateSelector';
import ColorPicker from '../components/ColorPicker';
import ProfessionalSummaryForm from '../components/ProfessionalSummaryForm';
import ExperienceForm from '../components/ExperienceForm';
import EducationForm from '../components/EducationForm';
import ProjectForm from '../components/ProjectForm';
import SkillsForm from '../components/SkillsForm';
import ResumeChatbot from '../components/ResumeChatbot';
import { useSelector } from 'react-redux';
import api from '../configs/api';

const ResumeBuilder = () => {

  const { resumeId } = useParams()
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const [isSaving, setIsSaving] = useState(false)

  const [resumeData, setResumeData] = useState({
    _id: '',
    title: '',
    personal_info: {},
    professional_summary: "",
    experiences: [],
    educations: [],
    project: [],
    skills: [],
    template: "classic",
    accent_color: "#3B82F6",
    public: false
  })
  const loadExistingResume = async () => {
    if (!resumeId || !token) {
      console.log("loadExistingResume skipped — resumeId:", resumeId, "token:", token);
      return;
    }
    console.log("loadExistingResume called — resumeId:", resumeId, "token:", token);
    try {
      const { data } = await api.get(`/api/resumes/get/` + resumeId, { headers: { Authorization: token } })
      console.log("loadExistingResume response:", data);
      if (data.resume) {
        setResumeData(data.resume)
        console.log("setResumeData called with:", data.resume);
        document.title = data.resume.title;
      }
    } catch (error) {
      console.error("loadExistingResume error:", error);
      toast.error(error?.response?.data?.message || "Failed to load resume")
    }
  }

  const validateResumeData = () => {
    const { personal_info } = resumeData;

    if (!personal_info?.full_name?.trim()) return "Full Name is required in Personal Info.";
    if (!personal_info?.email?.trim()) return "Email is required in Personal Info.";
    if (!personal_info?.phone?.trim()) return "Phone Number is required in Personal Info.";
    if (!personal_info?.location?.trim()) return "Location is required in Personal Info.";
    if (!personal_info?.profession?.trim()) return "Profession is required in Personal Info.";

    return null;
  }

  const handleSave = async () => {
    const errorMsg = validateResumeData();
    if (errorMsg) {
      toast.error(errorMsg);
      setActiveSectionIndex(0); // Jump to personal info if error is there
      return;
    }

    setIsSaving(true);

    try {
      const formData = new FormData();
      formData.append("resumeId", resumeId);
      formData.append("removeBackground", removeBackground);

      let updatedResumeData = structuredClone(resumeData);

      if (updatedResumeData.personal_info && updatedResumeData.personal_info.image instanceof File) {
        formData.append("image", updatedResumeData.personal_info.image);
        delete updatedResumeData.personal_info.image;
      }

      formData.append("resumeData", JSON.stringify(updatedResumeData));

      const { data } = await api.put("/api/resumes/update", formData, {
        headers: {
          Authorization: token
        }
      });

      setResumeData(data.resume);
      toast.success(data.message);
    } catch (error) {
      console.error("Error saving resume:", error);
      toast.error(error.response?.data?.message || "Error saving resume");
    } finally {
      setIsSaving(false);
    }
  }

  const [activeSectionIndex, setActiveSectionIndex] = useState(0)
  const [removeBackground, setRemoveBackground] = useState(false)

  const sections = [
    { id: 'personal', name: "Personal Info", icon: User },
    { id: 'summary', name: "Professional Summary", icon: FileText },
    { id: 'experience', name: "Experience", icon: Briefcase },
    { id: 'education', name: "Education", icon: GraduationCap },
    { id: 'project', name: "Project", icon: FolderIcon },
    { id: 'skills', name: "Skills", icon: Sparkles },
  ]
  const activeSection = sections[activeSectionIndex];


  useEffect(() => {
    loadExistingResume()
  }, [resumeId, token])

  const changeResumeVisibility = async () => {
    try {
      const formData = new FormData()
      formData.append("resumeId", resumeId)
      formData.append("resumeData", JSON.stringify({
        public: !resumeData.public
      }))
      formData.append("removeBackground", removeBackground)

      const { data } = await api.put(`/api/resumes/update`, formData, { headers: { Authorization: token } })

      setResumeData({ ...resumeData, public: !resumeData.public })
      toast.success(data.message)
    } catch (error) {
      toast.error("Error saving resume:", error);
    }
  }
  const handleShare = () => {
    const frontendUrl = window.location.href.split('/app/')[0];
    const resumeUrl = `${frontendUrl}/view/${resumeData._id}`;
    if (navigator.share) {
      navigator.share({ url: resumeUrl, text: "My Resume", })
    } else {
      alert("share not supported on this browser");
    }
  }
  const downloadResume = () => {
    window.print();
  }
  // Build resume context for the chatbot
  const resumeContext = useMemo(() => {
    const ctx = {};
    if (resumeData.personal_info?.profession) ctx.profession = resumeData.personal_info.profession;
    if (resumeData.professional_summary) ctx.professionalSummary = resumeData.professional_summary;
    if (resumeData.skills?.length > 0) ctx.skills = resumeData.skills;
    if (resumeData.experiences?.length > 0) ctx.experiences = resumeData.experiences;
    if (resumeData.educations?.length > 0) ctx.educations = resumeData.educations;
    return Object.keys(ctx).length > 0 ? ctx : null;
  }, [resumeData]);

  return (
    <div>
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Link to={"/app"} className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-all">
          <ArrowLeftIcon className="size-4" />
          Back to Dashboard
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className='grid lg:grid-cols-12 gap-8'>
          {/*left panel form */}
          <div className='relative lg:col-span-5 rounded-lg overflow-hidden'>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 pt-1">
              {/* progress bar */}
              <hr className="absolute top-0 left-0 right-0 border-2 border-gray-200" />
              <hr className='absolute top-0 left-0 h-1 bg-gradient-to-r from-green-500 to-green-600 border-none transition-all duration-2000' style={{ width: `${activeSectionIndex * 100 / (sections.length - 1)}%` }} />

              {/*Section Navigation*/}
              <div className='flex justify-between items-center mb-6 border-b border-gray-300 py-1'>

                <div className='flex items-center gap-2'>
                  <TemplateSelector selectedTemplate={resumeData.template} onChange={(template) => setResumeData(prev => ({ ...prev, template }))} />
                  <ColorPicker SelectedColor={resumeData.accent_color} onChange={(color) => setResumeData(prev => ({ ...prev, accent_color: color }))} />
                </div>

                <div className='flex items-center'>
                  {activeSectionIndex !== 0 && (
                    <button onClick={() => setActiveSectionIndex((prevIndex) => Math.max(prevIndex - 1, 0))} className='flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all' disabled={activeSectionIndex === 0}>
                      <ChevronLeft className='size-4' /> Previous
                    </button>
                  )}
                  <button onClick={() => setActiveSectionIndex((prevIndex) => Math.min(prevIndex + 1, sections.length - 1))} className={`flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all ${activeSectionIndex === sections.length - 1 && 'opacity-50'}`} disabled={activeSectionIndex === sections.length - 1}>
                    Next <ChevronRight className='size-4' />
                  </button>
                </div>
              </div>

              {/*Form Content */}
              <div className='space-y-6'>
                {activeSection.id === "personal" && (
                  <PersonalInfoForm data={resumeData.personal_info} onChange={(data) => setResumeData(prev => ({ ...prev, personal_info: data }))} removeBackground={removeBackground} setRemoveBackground={setRemoveBackground} />
                )}
                {activeSection.id === "summary" && (
                  <ProfessionalSummaryForm data={resumeData.professional_summary} onChange={(data) => setResumeData(prev => ({ ...prev, professional_summary: data }))} />
                )}
                {activeSection.id === "experience" && (
                  <ExperienceForm data={resumeData.experiences} onChange={(data) => setResumeData(prev => ({ ...prev, experiences: data }))} />
                )}
                {activeSection.id === "education" && (
                  <EducationForm data={resumeData.educations} onChange={(data) => setResumeData(prev => ({ ...prev, educations: data }))} />
                )}
                {activeSection.id === "project" && (
                  <ProjectForm data={resumeData.project} onChange={(data) => setResumeData(prev => ({ ...prev, project: data }))} />
                )}
                {activeSection.id === "skills" && (
                  <SkillsForm data={resumeData.skills} onChange={(data) => setResumeData(prev => ({ ...prev, skills: data }))} />
                )}
              </div>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className='w-40 mt-6 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors disabled:opacity-70 disabled:cursor-not-allowed'
              >
                {isSaving ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
          {/*Right panel preview */}
          <div className='lg:col-span-7 max-lg:mt-6'>
            <div className='relative w-full'>
              <div className='absolute bottom-3 left-0 right-0 flex item-center justify-end gap-2'>
                {resumeData.public && (
                  <button onClick={handleShare} className='flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 rounded-lg ring-blue-300 hover:ring transition-colors'>
                    <Share2Icon className='size-4' />
                  </button>
                )}
                <button onClick={changeResumeVisibility} className='flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600 rounded-lg ring-purple-300 hover:ring transition-colors'>
                  {resumeData.public ? <EyeIcon className='size-4' /> :
                    <EyeOffIcon className='size-4' />}
                  {resumeData.public ? 'Public' : 'Private'}
                </button>
                <button onClick={downloadResume} className='flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-green-100 to-green-200 text-green-600 rounded-lg ring-green-300 hover:ring transition-colors'>
                  <DownloadIcon className='size-4' /> Download
                </button>
                <button onClick={() => navigate(`/app/ats/${resumeData._id}`)} className='flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-indigo-100 to-indigo-200 text-indigo-600 rounded-lg ring-indigo-300 hover:ring transition-colors'>
                  <ScanLineIcon className='size-4' /> ATS Scan
                </button>
              </div>
            </div>
            <ResumePreview data={resumeData} template={resumeData.template} accentColor={resumeData.accent_color} />
          </div>
        </div>
      </div>

      {/* AI Resume Chatbot */}
      <ResumeChatbot resumeContext={resumeContext} />
    </div>
  )
}

export default ResumeBuilder
