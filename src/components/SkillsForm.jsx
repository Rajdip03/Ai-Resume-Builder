import React, { useState } from 'react'
import { Plus, Sparkles, Trash2 } from 'lucide-react'

const SkillsForm = ({ data, onChange }) => {
    const [newSkill, setNewSkill] = useState("")

    const AddSkill = () => {
        if (newSkill.trim() && !data.includes(newSkill.trim())) {
            onChange([...data, newSkill.trim()])
            setNewSkill("")
        }
    }

    const RemoveSkill = (index) => {
        onChange(data.filter((_, i) => i !== index))
    }
    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            AddSkill();
        }
    }
    return (
        <div className='space-y-4'>
            <div>
                <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>Skills</h3>
                <p className='text-sm text-gray-500'>Add details of your skills</p>
            </div>
            {/* Add Skills Form */}
            <div className="flex gap-2">
                <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="e.g. JavaScript"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                    onClick={AddSkill}
                    disabled={!newSkill.trim()}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Plus className="size-4" /> Add
                </button>
            </div>
            {data.length > 0 ? (
                <div className='flex flex-wrap gap-2'>
                    {data.map((skill, index) => (
                        <button key={index} onClick={() => RemoveSkill(index)} className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-600 transition-colors">
                            <Trash2 className="size-4" /> {skill}
                        </button>
                    ))}
                </div>
            )
                :
                (
                    <div className='flex flex-col items-center gap-2 text-gray-300'>
                        <Sparkles className='w-10 h-10 mx-auto mb-2 text-gray-300' />
                        <p className='text-sm text-gray-500'>No skills added yet.</p>
                    </div>
                )}
            {/* Skill Tip */}
            <div className='p-3 rounded-lg bg-blue-50 border-l-4 border-blue-400'>
                <p className='text-sm text-gray-600'> <strong>Tip:</strong> Add 8-12 relevant skills to make your resume stand out.</p>
            </div>
        </div>
    )
}

export default SkillsForm