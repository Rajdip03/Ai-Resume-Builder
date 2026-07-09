import React from 'react'
import { Plus, Sparkles, Trash2 } from 'lucide-react'

const ProjectForm = ({data, onChange,}) => {
  const addProject = () => {
    const newProject = {
        name:"",
        tech_stack:[],
        link:"",
        description:"",
    };
            onChange([...data, newProject]);
  };
const updateProject = (index, field, value) => {
    const updatedProjects = [...data]
    updatedProjects[index] = {...updatedProjects[index],[field]:value}
    onChange(updatedProjects)
}

const removeProject = (index) => {
    const updated = data.filter((_, i) => i !== index)
    onChange(updated)
}
  return (
    <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>Projects</h3>
                    <p className='text-sm text-gray-500'>Add details of your projects</p>
                </div>
                <button onClick={addProject} className='flex items-center gap-2 py-1 px-3 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors'>
                    <Plus className='size-4'/>
                    Add Project
                </button>
            </div>
            {data.length === 0 ? (
                <div className='text-center py-8 text-gray-500'>
                    <Sparkles className='w-12 h-12 mx-auto mb-3 text-gray-300 '/>
                    <p>No projects added yet.</p>
                    <p className='text-sm'>Click "Add Project" to get started.</p>
                </div>
            ) : (
                <div className='space-y-4'>
                    {data.map((project, index)=>(  
                        <div key={index} className='border border-gray-200 rounded-lg p-4 space-y-3'>
                            <div className='flex justify-between items-start'>
                                <h4>Project #{index + 1}</h4>
                                <button onClick={()=> removeProject(index)} className='text-red-500 hover:text-red-700 transition-colors'>
                                    <Trash2 className='size-4'/>
                                </button>
                            </div>
                            <div className='grid md:grid-cols-2 gap-3'>
                                <input type="text" placeholder='Project Name' value={project.name || ""} onChange={(e)=> updateProject(index,"name",e.target.value)} className='w-full p-2 border border-gray-300 rounded text-sm' />
                                <input type="url" placeholder='Project Link' value={project.link || ""} onChange={(e)=> updateProject(index,"link",e.target.value)} className='w-full p-2 border border-gray-300 rounded text-sm' />
                                <div className='md:col-span-2'>
                                    <input type="text" placeholder='Tech Stack' value={project.tech_stack?.join(",") || ""} onChange={(e)=> updateProject(index,"tech_stack",e.target.value.split(",").map(t=>t.trim()))} className='w-full p-2 border border-gray-300 rounded text-sm' />
                                </div>
                                <textarea placeholder='Description' value={project.description || ""} onChange={(e)=> updateProject(index,"description",e.target.value)} className='w-full p-2 border border-gray-300 rounded text-sm md:col-span-2 h-24' />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
  )
}

export default ProjectForm