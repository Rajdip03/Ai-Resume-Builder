import { Briefcase, Plus, Sparkles, Trash2 } from 'lucide-react'
import React from 'react'

const ExperienceForm = ({ data, onChange, setResumeData }) => {

    const addExperience = () => {
        const newExperience = {
            company: '',
            position: '',
            start_date: '',
            end_date: '',
            description: '',
            is_current: false,
        };
        onChange([...data, newExperience]);
    };

const removeExperience = (index) => {
    const updated = data.filter((_,i)=> i !== index)
    onChange(updated)
}
const updateExperience = (index,field,value) => {
    const updatedExperience = [...data]
    updatedExperience[index] = {...updatedExperience[index], [field]:value}
    onChange(updatedExperience)
}
    return (
        <div className='space-y-6'>
            <div className='flex items-center justify-between'>
                <div>
                    <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>Professional Experience</h3>
                    <p className='text-sm text-gray-500'>Add your job experience</p>
                </div>
                <button onClick={addExperience} className='flex items-center gap-2 py-1 px-3 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors'>
                    <Plus className='size-4' />
                    Add Experience
                </button>
            </div>
            {data.length === 0 ? (
                <div className='text-center py-8 text-gray-500'>
                    <Briefcase className='w-12 h-12 mx-auto mb-3 text-gray-300 '/>
                    <p>No work experience added yet.</p>
                    <p className='text-sm'>Click "Add Experience" to get started.</p>
                </div>  
            ) : (
                <div className='space-y-4'>
                    {data.map((experience,index)=>(
                        <div key={index} className='border border-gray-200 rounded-lg p-4 space-y-3'>
                            <div className='flex justify-between items-start'>
                                <h4>Experience #{index + 1}</h4>
                                <button onClick={()=> removeExperience(index)} className='text-red-500 hover:text-red-700 transition-colors'>
                                    <Trash2 className='size-4'/>
                                </button>
                            </div>
                            <div className='grid md:grid-cols-2 gap-3'>
                                <input type="text" placeholder='Company Name' value={experience.company || ""} onChange={(e)=> updateExperience(index,"company",e.target.value)} className='w-full p-2 border border-gray-300 rounded text-sm' />
                                <input type="text" placeholder='Job Title' value={experience.position || ""} onChange={(e)=> updateExperience(index,"position",e.target.value)} className='w-full p-2 border border-gray-300 rounded text-sm' />
                                <input type="date" placeholder='Start Date' value={experience.start_date || ""} onChange={(e)=> updateExperience(index,"start_date",e.target.value)} className='w-full p-2 border border-gray-300 rounded text-sm' />
                                <input type="date" disabled={experience.is_current} placeholder='End Date' value={experience.end_date || ""} onChange={(e)=> updateExperience(index,"end_date",e.target.value)} className='w-full p-2 border border-gray-300 rounded text-sm disabled:bg-gray-100' />
                            </div>
                            <label className='flex items-center gap-2'>
                                <input type="checkbox" checked={experience.is_current || false} onChange={(e)=> updateExperience(index,"is_current",e.target.checked ? true : false)} className='rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:border-transparent'/>
                                <span className='text-sm text-gray-700'>Currently working here</span>
                            </label>
                            <div className='space-y-2'>
                                <div className='flex justify-between items-center'>
                                    <label className='text-sm font-medium text-gray-700'>Job Description</label>
                                    <button className='flex items-center gap-2 py-1 px-3 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-50'>
                                        <Sparkles className='w-4 h-3'/>
                                        Enhance with AI
                                    </button>
                                </div>
                                <textarea placeholder='Describe your responsiblities...' value={experience.description || ""} onChange={(e)=> updateExperience(index,"description",e.target.value)} rows={3} className='w-full p-2 border border-gray-300 rounded text-sm resize-none'/>
                                <p className='text-xs text-gray-500'>Tip:Use action verbs and quantifiable achievements to describe your responsiblities</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ExperienceForm