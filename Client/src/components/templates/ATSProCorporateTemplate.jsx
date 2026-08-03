const ATSProCorporateTemplate = ({ data, accentColor }) => {
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const [year, month] = dateStr.split("-");
        return new Date(year, month - 1).toLocaleDateString("en-US", { year: "numeric", month: "short" });
    };

    return (
        <div className="max-w-4xl mx-auto bg-white text-gray-900" style={{ fontFamily: "'Calibri', 'Arial', sans-serif" }}>
            {/* Header block */}
            <header className="px-10 py-7" style={{ backgroundColor: accentColor }}>
                <h1 className="text-3xl font-bold text-white tracking-wide uppercase">
                    {data.personal_info?.full_name || "Your Name"}
                </h1>
                <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-white text-sm opacity-90">
                    {data.personal_info?.email && <span>✉ {data.personal_info.email}</span>}
                    {data.personal_info?.phone && <span>✆ {data.personal_info.phone}</span>}
                    {data.personal_info?.location && <span>⌖ {data.personal_info.location}</span>}
                    {data.personal_info?.linkedin && <span className="break-all">in {data.personal_info.linkedin}</span>}
                    {data.personal_info?.website && <span className="break-all">⊙ {data.personal_info.website}</span>}
                </div>
            </header>

            <div className="px-10 py-8 space-y-7">
                {/* Profile */}
                {data.professional_summary && (
                    <section>
                        <h2 className="text-xs font-bold tracking-widest uppercase mb-2 pb-1 border-b-2" style={{ color: accentColor, borderColor: accentColor }}>
                            Professional Profile
                        </h2>
                        <p className="text-sm text-gray-700 leading-relaxed">{data.professional_summary}</p>
                    </section>
                )}

                {/* Skills — top of ATS scan */}
                {data.skills && data.skills.length > 0 && (
                    <section>
                        <h2 className="text-xs font-bold tracking-widest uppercase mb-2 pb-1 border-b-2" style={{ color: accentColor, borderColor: accentColor }}>
                            Key Skills
                        </h2>
                        <div className="grid grid-cols-3 gap-x-4 gap-y-1">
                            {data.skills.map((skill, i) => (
                                <div key={i} className="text-sm text-gray-800 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: accentColor }} />
                                    {skill}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Experience */}
                {data.experiences && data.experiences.length > 0 && (
                    <section>
                        <h2 className="text-xs font-bold tracking-widest uppercase mb-3 pb-1 border-b-2" style={{ color: accentColor, borderColor: accentColor }}>
                            Work Experience
                        </h2>
                        <div className="space-y-5">
                            {data.experiences.map((exp, i) => (
                                <div key={i}>
                                    <div className="flex justify-between items-baseline">
                                        <div>
                                            <span className="font-bold text-sm text-gray-900">{exp.position}</span>
                                            <span className="text-gray-500 mx-2">|</span>
                                            <span className="text-sm font-semibold" style={{ color: accentColor }}>{exp.company}</span>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            {exp.location && <span className="text-xs text-gray-500 mb-1">{exp.location}</span>}
                                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5">
                                                {formatDate(exp.start_date)} – {exp.is_present ? "Present" : formatDate(exp.end_date)}
                                            </span>
                                        </div>
                                    </div>
                                    {exp.description && (
                                        <p className="text-sm text-gray-700 mt-1.5 leading-relaxed whitespace-pre-line pl-3 border-l border-gray-200">
                                            {exp.description}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Projects */}
                {(data.project || data.projects) && (data.project || data.projects).length > 0 && (
                    <section>
                        <h2 className="text-xs font-bold tracking-widest uppercase mb-3 pb-1 border-b-2" style={{ color: accentColor, borderColor: accentColor }}>
                            Notable Projects
                        </h2>
                        <div className="space-y-3">
                            {(data.project || data.projects).map((proj, i) => (
                                <div key={i} className="flex flex-col gap-1">
                                    <div className="flex gap-3">
                                        <span className="font-bold text-sm text-gray-900 min-w-fit">{proj.name}:</span>
                                        <span className="text-sm text-gray-700 leading-relaxed">{proj.description}</span>
                                    </div>
                                    <div className="flex gap-4 text-xs text-gray-600">
                                        {proj.tech_stack && (Array.isArray(proj.tech_stack) ? proj.tech_stack.length > 0 : String(proj.tech_stack).trim()) && (
                                            <span><strong>Tech:</strong> {Array.isArray(proj.tech_stack) ? proj.tech_stack.join(", ") : String(proj.tech_stack)}</span>
                                        )}
                                        {proj.link && (
                                            <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                {proj.link}
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Education */}
                {data.educations && data.educations.length > 0 && (
                    <section>
                        <h2 className="text-xs font-bold tracking-widest uppercase mb-3 pb-1 border-b-2" style={{ color: accentColor, borderColor: accentColor }}>
                            Education
                        </h2>
                        <div className="space-y-3">
                            {data.educations.map((edu, i) => (
                                <div key={i} className="flex justify-between items-start">
                                    <div>
                                        <p className="font-bold text-sm text-gray-900">{edu.degree}{edu.field ? ` in ${edu.field}` : ""}</p>
                                        <p className="text-sm text-gray-600">{edu.institution}</p>
                                        {edu.gpa && <p className="text-xs text-gray-500">GPA: {edu.gpa}</p>}
                                    </div>
                                    <div className="flex flex-col items-end">
                                        {edu.location && <span className="text-xs text-gray-500 mb-1">{edu.location}</span>}
                                        <span className="text-xs text-gray-500">{formatDate(edu.graduation_date)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default ATSProCorporateTemplate;