import React from 'react'
import { GraduationCap, Plus, Trash2 } from 'lucide-react'

const EducationForm = ({data, onChange}) => {
     const addEducation = () => {
        const newEducation = {
            institution: '',
            degree: '',
            field: '',
            graduation_date: '',
            gpa:"",
        };
        onChange([...data, newEducation]);
    };

const removeEducation = (index) => {
    const updated = data.filter((_,i)=> i !== index)
    onChange(updated)
}
const updateEducation = (index,field,value) => {
    const updatedEducation = [...data]
    updatedEducation[index] = {...updatedEducation[index], [field]:value}
    onChange(updatedEducation)
}
  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div>
                <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>Education</h3>
                <p className='text-sm text-gray-500'>Add your education details</p>
            </div>
            <button onClick={addEducation} className='flex items-center gap-2 py-1 px-3 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors'>
                <Plus className='size-4' />
                Add Education
            </button>
        </div>
        {data.length === 0 ? (
            <div className='text-center py-8 text-gray-500'>
                <GraduationCap className='w-12 h-12 mx-auto mb-3 text-gray-300 '/>
                <p>No education details added yet.</p>
                <p className='text-sm'>Click "Add Education" to get started.</p>
            </div>
        ) : (
            <div className='space-y-4'>
                {data.map((education,index)=>(
                    <div key={index} className='border border-gray-200 rounded-lg p-4 space-y-3'>
                        <div className='flex justify-between items-start'>
                            <h4>Education #{index + 1}</h4>
                            <button onClick={()=> removeEducation(index)} className='text-red-500 hover:text-red-700 transition-colors'>
                                <Trash2 className='size-4'/>
                            </button>
                        </div>
                        <div className='grid md:grid-cols-2 gap-3'>
                            <input type="text" placeholder='Institution' value={education.institution || ""} onChange={(e)=> updateEducation(index,"institution",e.target.value)} className='w-full p-2 border border-gray-300 rounded text-sm' />
                            <input type="text" placeholder='Degree' value={education.degree || ""} onChange={(e)=> updateEducation(index,"degree",e.target.value)} className='w-full p-2 border border-gray-300 rounded text-sm' />
                            <input type="text" placeholder='Field' value={education.field || ""} onChange={(e)=> updateEducation(index,"field",e.target.value)} className='w-full p-2 border border-gray-300 rounded text-sm' />
                            <input type="date" placeholder='Graduation Date' value={education.graduation_date || ""} onChange={(e)=> updateEducation(index,"graduation_date",e.target.value)} className='w-full p-2 border border-gray-300 rounded text-sm' />
                            <input type="text"placeholder='GPA' value={education.gpa || ""} onChange={(e)=> updateEducation(index,"gpa",e.target.value)} className='w-full p-2 border border-gray-300 rounded text-sm' />
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>
  )
}

export default EducationForm