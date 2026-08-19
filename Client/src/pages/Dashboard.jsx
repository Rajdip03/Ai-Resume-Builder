import { FilePenLineIcon, LoaderCircle, LoaderCircleIcon, PenIcon, PlusIcon, TrashIcon, UploadCloud, UploadCloudIcon, XIcon } from "lucide-react";
import React from "react";
import { dummyResumeData } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../configs/api";
import toast from "react-hot-toast";
import pdfToText from 'react-pdftotext'
import ResumeChatbot from '../components/ResumeChatbot'

// Floating chatbot mascot with auto speech bubble
const ChatbotMascot = () => {
  const [showBubble, setShowBubble] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setShowBubble(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div
        className="fixed right-5 z-40 print:hidden"
        style={{ bottom: '88px' }}
      >
        {/* Speech Bubble */}
        {showBubble && (
          <div
            style={{
              position: 'absolute',
              right: '70px',
              bottom: '12px',
              background: 'linear-gradient(135deg, #7c3aed, #6366f1)',
              color: '#fff',
              padding: '10px 16px',
              borderRadius: '16px 16px 4px 16px',
              fontSize: '13px',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 20px rgba(99, 102, 241, 0.35)',
              animation: 'chatMascotFadeIn 0.5s ease-out',
              letterSpacing: '0.2px',
            }}
          >
            hey! how can i help You
            <button
              onClick={() => setShowBubble(false)}
              style={{
                position: 'absolute',
                top: '-6px',
                right: '-6px',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: '#1e1b4b',
                color: '#fff',
                border: 'none',
                fontSize: '11px',
                lineHeight: '18px',
                textAlign: 'center',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
              }}
              aria-label="Close speech bubble"
            >
              ×
            </button>
            {/* Bubble tail */}
            <div
              style={{
                position: 'absolute',
                bottom: '6px',
                right: '-6px',
                width: 0,
                height: 0,
                borderLeft: '8px solid #6366f1',
                borderTop: '6px solid transparent',
                borderBottom: '6px solid transparent',
              }}
            />
          </div>
        )}

        {/* Mascot Image */}
        <img
          src="/image_280bee.png"
          alt="Chatbot Mascot"
          style={{
            width: '58px',
            height: '58px',
            objectFit: 'contain',
            borderRadius: '50%',
            filter: 'drop-shadow(0 4px 12px rgba(99, 102, 241, 0.3))',
            animation: 'chatMascotFloat 3s ease-in-out infinite',
            cursor: 'pointer',
          }}
          onClick={() => setShowBubble((prev) => !prev)}
        />
      </div>

      <style>{`
        @keyframes chatMascotFadeIn {
          from { opacity: 0; transform: translateY(8px) scale(0.9); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes chatMascotFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </>
  );
};

const Dashboard = () => {

  const { user, token } = useSelector(state => state.auth)

  const colors = ["#9333ea", "#d97706", "#dc2626", "#0254c7", "#16a34a"];
  const [allResume, setAllResume] = React.useState([]);
  const [ShowCreateResume, SetShowCreateResume] = React.useState(false);
  const [ShowUploadResume, SetShowUploadResume] = React.useState(false);
  const [resume, setResume] = React.useState(null);
  const [title, setTitle] = React.useState("");
  const [editResumeId, setEditResumeId] = React.useState("");

  const [isLoading, setIsLoading] = React.useState(false)

  const navigate = useNavigate()

  const loadAllResume = async () => {
    try {
      const { data } = await api.get('/api/users/resumes', { headers: { Authorization: token } })
      setAllResume(data);
    } catch (error) {
      console.log("Error loading all resume:", error);
      toast.error(error?.response?.data?.message || error.message);
    }
  }

  const CreateResume = async (event) => {
    try {
      event.preventDefault()
      const { data } = await api.post('/api/resumes/create', { title }, { headers: { Authorization: token } })
      setAllResume([...allResume, data.resume])
      setTitle('')
      SetShowCreateResume(false)
      navigate(`/app/builder/${data.resume._id}`)
    } catch (error) {
      console.log("Error creating resume:", error);
      toast.error(error?.response?.data?.message || error.message);
    }
  }
  const UploadResume = async (event) => {
    event.preventDefault()
    setIsLoading(true)
    try {
      const resumeText = await pdfToText(resume)
      const { data } = await api.post('/api/ai/upload-resume', { title, resumeText }, { headers: { Authorization: token } })
      setTitle('')
      setResume(null)
      SetShowUploadResume(false)
      navigate(`/app/builder/${data.resume._id}`)
    } catch (error) {
      console.log("Error uploading resume:", error);
      toast.error(error?.response?.data?.message || error.message);
    }
    setIsLoading(false)
  }
  const editTitle = async (event) => {
    try {
      event.preventDefault()
      const { data } = await api.put(`/api/resumes/update/${editResumeId}`, { resumeId: editResumeId, resumeData: {title} }, { headers: { Authorization: token } })
      setAllResume(allResume.map((resume) => resume._id === editResumeId ? {...resume,  title} : resume))
      setTitle('')
      setEditResumeId('')
      toast.success(data.message)
    } catch (error) {
      console.log("Error editing title:", error);
      toast.error(error?.response?.data?.message || error.message);
    }
  }
  const deleteResume = async (resumeId) => {
    try {
      const confirm = window.confirm('Are you sure you want to delete this resume?')
      if (confirm) {
        const { data } = await api.delete(`/api/resumes/delete/${resumeId}`, {
          headers: { Authorization: token },
          data: { resumeId }
        })
        setAllResume(allResume.filter((resume) => resume._id !== resumeId))
        toast.success(data.message)
      }
    }
    catch (error) {
      console.log("Error deleting resume:", error);
      toast.error(error?.response?.data?.message || error.message);
    }
  }

  React.useEffect(() => {
    loadAllResume();
  }, []);

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-2xl font-medium mb-6 bg-gradient-to-r from-slate-600 to-slate-700 bg-clip-text text-transparent sm:hidden">
          Welcome, Rajdip Mondal
        </p>
        <div className="flex gap-4">
          <button onClick={() => SetShowCreateResume(true)} className="w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center gap-2 rounded-lg border text-slate-600 border border-dashed border-slate-300  group hover:border-indigo-500 hover:shadow-lg transition-all duration-300 cursor-pointer">
            <PlusIcon className="size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-indigo-300 to-indigo-500 text-white rounded-full" />
            <p className="text-sm group-hover:text-indigo-600 transition-all duration-300">
              Create Resume
            </p>
          </button>
          <button onClick={() => SetShowUploadResume(true)} className="w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center gap-2 rounded-lg border text-slate-600 border border-dashed border-slate-300  group hover:border-indigo-purple-500 hover:shadow-lg transition-all duration-300 cursor-pointer">
            <UploadCloudIcon className="size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-purple-300 to-purple-500 text-white rounded-full" />
            <p className="text-sm group-hover:text-purple-600 transition-all duration-300">
              Upload Existing Resume
            </p>
          </button>
        </div>
        <hr className="border-slate-300 my-6 sm:w-[305px]" />
        <div className="grid grid-cols-2 sm:flex flex-wrap gap-4">
          {allResume?.map((resume, index) => {
            const baseColor = colors[index % colors.length];
            return (
              <button key={index} onClick={() => navigate(`/app/builder/${resume._id}`)} className="relative w-full sm:max-w-36 h-48 flex flex-col items-center justify-center gap-2 rounded-lg border group hover:shadow-lg transition-all duration-300 cursor-pointer" style={{ background: `linear-gradient(135deg, ${baseColor}10, ${baseColor}40)`, borderColor: baseColor + '40' }}>
                <FilePenLineIcon className="sizez-7 group-hover:scale-105 transition-all" style={{ color: baseColor }} />
                <p className="text-sm group-hover:scale-105 transition-all px-2 text-center" style={{ color: baseColor }}>{resume.title}</p>
                <p className="absolute bottom-1 text-[11px] text-slate-400  group-hover:text-slate-500 duration-300 px-2 text-center" style={{ color: baseColor + '90' }}>
                  Updated On {new Date(resume.updatedAt).toLocaleDateString()}
                </p>
                <div onClick={(e) => e.stopPropagation()} className="absolute top-1 right-1 group-hover:flex items-center hidden">
                  <TrashIcon onClick={() => deleteResume(resume._id)} className="size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors cursor-pointer" />
                  <PenIcon onClick={() => { setEditResumeId(resume._id); setTitle(resume.title) }} className="size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors cursor-pointer" />
                </div>
              </button>
            )
          })}
        </div>
        {/* popup to create resume */}
        <div>
          {
            ShowCreateResume && (
              <form onSubmit={CreateResume} onClick={() => SetShowCreateResume(false)} className="fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center">
                <div onClick={e => e.stopPropagation()} className="reletive bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6">
                  <h2 className="text-xl font-bold mb-4">Create a Resume</h2>
                  <input onChange={(event) => { setTitle(event.target.value) }} value={title} type="text" placeholder="Enter Resume Title" className="w-full px-4 p-2 mb-4 focus:border-green-600 ring-green-600" required />
                  <button className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">Create Resume</button>
                  <XIcon className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors" onClick={() => { SetShowCreateResume(false); setTitle('') }} />
                </div>
              </form>
            )
          }
        </div>
        {/* popup to upload resume */}
        <div>
          {
            ShowUploadResume && (
              <form onSubmit={UploadResume} onClick={() => SetShowUploadResume(false)} className="fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center">
                <div onClick={e => e.stopPropagation()} className="reletive bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6">
                  <h2 className="text-xl font-bold mb-4">Upload Resume</h2>
                  <input onChange={(event) => { setTitle(event.target.value) }} value={title} type="text" placeholder="Enter Resume Title" className="w-full px-4 p-2 mb-4 focus:border-green-600 ring-green-600" required />
                  <div>
                    <label htmlFor="resume-input" className="block text-sm text-slate-700">
                      Select Resume File
                      <div className="flex flex-col items-center justify-center gap-2 border group text-slate-400 border-slate-400 border-dashed rounded-md p-4 py-10 my-4 hover:border-green-500 hover:text-green-700 cursor-pointer transition-colors">
                        {resume ? (
                          <p className="ktext-green-700">{resume.name}</p>
                        ) : (
                          <>
                            <UploadCloud className="size-14 stroke-1 " />
                            <p>Upload Resume</p>
                          </>
                        )}
                      </div>
                    </label>
                    <input type="file" accept=".pdf" id="resume-input" hidden onChange={(event) => { setResume(event.target.files[0]) }} />
                  </div>
                  <button disabled={isLoading} className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                    {isLoading && <LoaderCircleIcon className="animate-spin size-4 text-white" />}
                    {isLoading ? 'uploading...' : 'Upload Resume'}
                  </button>
                  <XIcon className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors" onClick={() => { SetShowUploadResume(false); setTitle('') }} />
                </div>
              </form>
            )
          }
        </div>
        {/* popup to edit resume title */}
        {
          editResumeId && (
            <form onSubmit={editTitle} onClick={() => setEditResumeId('')} className="fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center">
              <div onClick={e => e.stopPropagation()} className="reletive bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6">
                <h2 className="text-xl font-bold mb-4">Edit Resume Title</h2>
                <input onChange={(event) => { setTitle(event.target.value) }} value={title} type="text" placeholder="Enter Resume Title" className="w-full px-4 p-2 mb-4 focus:border-green-600 ring-green-600" required />
                <button className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">Update</button>
                <XIcon className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors" onClick={() => { setEditResumeId(''); setTitle('') }} />
              </div>
            </form>
          )
        }
      </div>

      {/* Floating Chatbot Mascot Image & Speech Bubble */}
      <ChatbotMascot />

      {/* AI Resume Chatbot */}
      <ResumeChatbot />
    </div>
  );
};

export default Dashboard;
