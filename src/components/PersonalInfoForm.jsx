import { BriefcaseBusiness, Globe, Linkedin, Mail, MapPin, Phone, User, Loader2 } from 'lucide-react'
import React, { useState, useEffect } from 'react'

const PersonalInfoForm = ({ data, onChange, removeBackground, setRemoveBackground }) => {
  const [originalImage, setOriginalImage] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processedImageUrl, setProcessedImageUrl] = useState(null)

  useEffect(() => {
    return () => {
      if (processedImageUrl) {
        URL.revokeObjectURL(processedImageUrl);
      }
    };
  }, [processedImageUrl]);

  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setOriginalImage(file);
      handleChange("image", file);
      if (removeBackground) {
        setRemoveBackground(false);
      }
    }
  };

  const handleToggleBackground = async () => {
    const newValue = !removeBackground;
    setRemoveBackground(newValue);

    if (newValue) {
      if (!originalImage && data.image) {
        setOriginalImage(data.image);
      }

      setIsProcessing(true);
      try {
        const { removeBackground: removeBg } = await import('@imgly/background-removal');
        const imageSource = originalImage || data.image;
        if (!imageSource) return;

        const blob = await removeBg(imageSource);
        const url = URL.createObjectURL(blob);

        setProcessedImageUrl(url);
        handleChange("image", url);
      } catch (error) {
        console.error("Error removing background:", error);
        setRemoveBackground(false);
      } finally {
        setIsProcessing(false);
      }
    } else {
      if (originalImage) {
        handleChange("image", originalImage);
      }
    }
  };
  const fields = [

    { key: "full_name", label: "Full Name", icon: User, type: "text", required: true },
    { key: "phone", label: "Phone Number", icon: Phone, type: "tel", required: true },
    { key: "email", label: "Email", icon: Mail, type: "email", required: true },
    { key: "location", label: "Location", icon: MapPin, type: "text", required: true },
    { key: "profession", label: "Profession", icon: BriefcaseBusiness, type: "text", required: true },
    { key: "linkedin", label: "LinkedIn", icon: Linkedin, type: "url" },
    { key: "website", label: "Personal Website", placeholder: "rajdip.com", icon: Globe, type: "url" },

  ]
  return (
    <div>
      <h3 className='text-lg font-semibold text-gray-900'>Personal Information</h3>
      <p className='text-sm text-gray-600'>Get Started With the personal Information</p>
      <div className='flex items-center gap-2'>
        <label>
          {data.image ? (
            <img src={typeof data.image === "string" ? data.image : URL.createObjectURL(data.image)} alt="User-image" className='w-16 h-16 rounded-full object-cover mt-5 ring ring-slate-300 hover:opacity-80' />

          ) : (
            <div className='inline-flex items-center gap-2 mt-5 text-slate-600 hover:text-slate-700 cursor-pointer'>
              <User className='size-10 p-2.5 border rounded-full' />
              Upload User Image
            </div>
          )}
          <input type="file" onChange={handleImageChange} accept='image/*' className='hidden' />
        </label>
        {(originalImage || typeof data.image === 'object') && (
          <div className='flex flex-col gap-1 text-sm'>
            <p className='flex items-center gap-2'>
              Remove Background
              {isProcessing && <Loader2 className="size-3 animate-spin text-blue-600" />}
            </p>
            <label className={`relative inline-flex items-center cursor-pointer text-gray-900 gap-3 ${isProcessing ? 'opacity-70' : ''}`}>
              <input type="checkbox" className='peer sr-only' checked={removeBackground} onChange={handleToggleBackground} disabled={isProcessing} />
              <div className={`w-9 h-5 rounded-full peer transition-colors duration-200 ${isProcessing ? 'bg-slate-300' : 'bg-slate-300 peer-checked:bg-green-600'}`}>

              </div>
              <span className='dot absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4'></span>
            </label>
          </div>
        )}
      </div>
      {fields.map((field) => {
        const Icon = field.icon;
        return (
          <div key={field.key} className='space-y-1 mt-5'>
            <label className='flex items-center gap-2 text-sm font-medium text-gray-600'>
              <Icon className='size-4' />
              {field.label}
              {field.required && <span className='text-red-500 ml-1'>*</span>}
            </label>
            <input type={field.type} className='mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm' value={data[field.key] || ""} onChange={(e) => handleChange(field.key, e.target.value)} placeholder={`Enter Your ${field.label.toLocaleLowerCase()}`} required={field.required} />

          </div>
        )
      })}
    </div>
  )
}

export default PersonalInfoForm