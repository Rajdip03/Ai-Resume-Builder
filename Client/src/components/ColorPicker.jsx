import { Check, Palette } from 'lucide-react'
import React, { useState } from 'react'

const ColorPicker = ({ SelectedColor, onChange }) => {
    const colors = [
        { label: "Blue", value: "#3B82F6" },
        { label: "Teal", value: "#14B8A6" },
        { label: "Orange", value: "#F97316" },
        { label: "Purple", value: "#8B5CF6" },
        { label: "Green", value: "#22C55E" },
        { label: "Pink", value: "#EC4899" },
        { label: "Yellow", value: "#F59E0B" },
        { label: "Cyan", value: "#06B6D4" },
        { label: "Slate", value: "#64748B" },
        { label: "Rose", value: "#F43F5E" },
        { label: "Emerald", value: "#10B981" },
        { label: "Lime", value: "#84CC16" },
        { label: "Black", value: "#1F2937" },
        { label: "Gray", value: "#6B7280" },
        { label: "Red", value: "#EF4444" },
    ]
    const [isOpen, setIsOpen] = useState(false)


    return (
        <div className='relative'>
            <button onClick={() => setIsOpen(!isOpen)} className='flex items-center gap-1 text-sm text-purple-600 bg-gradient-to-br from-purple-50 to-purple-100 ring-purple-300 hover:ring transition-all px-3 py-2 rounded-lg'>
                <Palette size={16} /> <span className='max-sm:hidden'>Accent</span>
            </button>
            {isOpen && (
                <div className='grid grid-cols-4 w-60 gap-2 absolute top-full left-0 right-0 p-3 mt-2 z-10 bg-white rounded-md border border-gray-200 shadow-sm'>
                    {colors.map((color) => (
                        <div key={color.value} className='relative   cursor-pointer group flex flex-col' onClick={() => {onChange(color.value); setIsOpen(false) }}>
                            <div className='w-12 h-12 rounded-full border-2 borrder-transparent group-hover:border-black/25 transition-all' style={{ backgroundColor: color.value }}>
                            </div>
                            {SelectedColor== color.value && (
                                <div className='absolute top-0 left-0 right-0 bottom-4.5 flex items-center justify-center'>
                                    <Check className='size-5 text-white'/>
                                </div>
                              )}
                              <p className='text-xs text-center mt-1 text-gray-600'>{color.label}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
export default ColorPicker