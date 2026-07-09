import { Check, Layout } from 'lucide-react';
import React, { useState } from 'react'

const TemplateSelector = ({ selectedTemplate, onChange }) => {

    const [isOpen, setIsOpen] = useState(false);

    const templates = [
        {
            id: 'classic',
            name: 'Classic',
            preview: "A clean traditional resume format with clear sections and professional typography"
        },
        {
            id: 'modern',
            name: 'Modern',
            preview: "Sleek design with strategic use of color and modern font choices"
        },
        {
            id: 'minimal',
            name: 'Minimal',
            preview: "Ultra clean design that puts your content front and center"
        },
        {
            id: 'minimal-image',
            name: 'Minimal Image',
            preview: "Minimal design with a single image and clean typography"
        },
        {
            id: 'ats-pro-corporate',
            name: 'ATS Pro Corporate',
            preview: "Clean, professional, and ATS-optimized layout with a modern corporate feel"
        },
        {
            id: 'academic-researcher',
            name: 'Academic Researcher',
            preview: "Classic academic CV format with clean typography and structured sections"
        },
        {
            id: 'hybrid-timeline',
            name: 'Hybrid Timeline',
            preview: "Modern resume combining a traditional layout with a timeline visualization for experience"
        },
        {
            id: 'premium-clean-grid',
            name: 'Premium Clean Grid',
            preview: "Premium two-column layout with a clean grid structure and modern design"
        },
        {
            id: 'executive-board-room',
            name: 'Executive Board Room',
            preview: "Executive resume with a bold layout and prominent display of achievements"
        },
        {
            id: 'finance-consultant',
            name: 'Finance Consultant',
            preview: "Professional finance resume template with a modern and sophisticated design"
        },
        {
            id: 'startup-founder',
            name: 'Startup Founder',
            preview: "Creative resume template for startup founders with a modern and dynamic layout"
        },
        {
            id: 'technical-engineer',
            name: 'Technical Engineer',
            preview: "Technical resume template with a clean layout and prominent display of skills"
        },
        {
            id: 'harvard-ats',
            name: 'Harvard ATS',
            preview: "Clean, professional, and ATS-optimized layout with a modern corporate feel"
        },
    ]
    return (
        <div className='relative'>
            <button onClick={() => setIsOpen(!isOpen)} className='inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-sm text-gray-600 rounded-lg border border-gray-300 shadow-sm transition-colors'>
                <Layout size={14} /> <span className='max-sm:hidden'>Template</span>
            </button>
            {isOpen && (
                <div className='absolute top-full w-xs p-3 mt-2 space-y-3 z-10 bg-white rounded-md border border-gray-200 shadow-md' style={{maxHeight: '70vh', overflowY: 'scroll'}}>
                    {templates.map((template) => (
                        <div key={template.id} onClick={() => { onChange(template.id); setIsOpen(false) }} className={`relative p-3 border rounded-md cursor-pointer transition-all ${selectedTemplate === template.id ? 'border-blue-400 bg-blue-100' : 'border-gray-300 hover:border-gray-400 bg-gray-100'}`}>
                            {selectedTemplate === template.id && (
                                <div className='absolute top-2 right-2'>
                                    <div className='size-5 bg-blue-400 rounded-full flex items-center justify-center'>
                                        <Check className='w-3 h-3 text-white' />
                                    </div>
                                </div>
                            )}
                            <div className='space-y-1'>
                                <h4 className='font-medium text-gray-800'>{template.name}</h4>
                                <div className='mt-2 p-2 bg-blue-50 rounded text-xs text-gray-500 italic'>{template.preview}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default TemplateSelector