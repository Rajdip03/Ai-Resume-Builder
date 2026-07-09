const PremiumCleanGridTemplate = ({ data, accentColor }) => {
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const [year, month] = dateStr.split("-");
        return new Date(year, month - 1).toLocaleDateString("en-US", { year: "numeric", month: "short" });
    };

    return (
        <div className="max-w-4xl mx-auto bg-white text-gray-900" style={{ fontFamily: "'Gill Sans', 'Gill Sans MT', 'Trebuchet MS', sans-serif" }}>
            {/* Header: name left, contact right, accent bottom border */}
            <header className="px-10 pt-10 pb-6">
                <div className="grid grid-cols-5 gap-6">
                    <div className="col-span-3">
                        <div className="w-10 h-1 mb-3" style={{ backgroundColor: accentColor }} />
                        <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                            {data.personal_info?.full_name || "Your Name"}
                        </h1>
                        {data.personal_info?.profession && (
                            <p className="text-sm font-medium mt-2 tracking-widest uppercase text-gray-500">{data.personal_info.profession}</p>
                        )}
                    </div>
                    <div className="col-span-2 flex flex-col justify-end text-xs text-gray-500 space-y-1 pb-1">
                        {data.personal_info?.email && <span className="break-all">{data.personal_info.email}</span>}
                        {data.personal_info?.phone && <span>{data.personal_info.phone}</span>}
                        {data.personal_info?.location && <span>{data.personal_info.location}</span>}
                        {data.personal_info?.linkedin && <span className="break-all">{data.personal_info.linkedin}</span>}
                        {data.personal_info?.website && <span className="break-all">{data.personal_info.website}</span>}
                    </div>
                </div>
                <div className="mt-6 grid grid-cols-5 gap-6">
                    <div className="col-span-3 h-px bg-gray-900" />
                    <div className="col-span-2 h-px" style={{ backgroundColor: accentColor }} />
                </div>
            </header>

            <div className="px-10 pb-10">
                {/* Summary */}
                {data.professional_summary && (
                    <section className="mb-8 grid grid-cols-5 gap-6">
                        <div className="col-span-1">
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-1">Summary</p>
                        </div>
                        <div className="col-span-4">
                            <p className="text-sm text-gray-700 leading-relaxed">{data.professional_summary}</p>
                        </div>
                    </section>
                )}

                {/* Experience */}
                {data.experience && data.experience.length > 0 && (
                    <section className="mb-8">
                        <div className="grid grid-cols-5 gap-6 mb-3">
                            <div className="col-span-1">
                                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Experience</p>
                            </div>
                            <div className="col-span-4 border-b border-gray-200" />
                        </div>
                        <div className="space-y-5">
                            {data.experience.map((exp, i) => (
                                <div key={i} className="grid grid-cols-5 gap-6">
                                    <div className="col-span-1 text-xs text-gray-400 pt-0.5 leading-relaxed">
                                        {exp.location && <p className="mb-1">{exp.location}</p>}
                                        <p>{formatDate(exp.start_date)}</p>
                                        <p>– {exp.is_current ? "Present" : formatDate(exp.end_date)}</p>
                                        <p className="mt-1 font-medium text-gray-500">{exp.company}</p>
                                    </div>
                                    <div className="col-span-4">
                                        <h3 className="font-bold text-sm text-gray-900">{exp.position}</h3>
                                        {exp.description && (
                                            <p className="text-xs text-gray-600 mt-1.5 leading-relaxed whitespace-pre-line">{exp.description}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Projects */}
                {(data.project || data.projects) && (data.project || data.projects).length > 0 && (
                    <section className="mb-8">
                        <div className="grid grid-cols-5 gap-6 mb-3">
                            <div className="col-span-1">
                                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Projects</p>
                            </div>
                            <div className="col-span-4 border-b border-gray-200" />
                        </div>
                        <div className="grid grid-cols-5 gap-6">
                            <div className="col-span-1" />
                            <div className="col-span-4 grid grid-cols-2 gap-4">
                                {(data.project || data.projects).map((proj, i) => (
                                    <div key={i} className="border-l-2 pl-3 flex flex-col justify-between" style={{ borderColor: accentColor }}>
                                        <div>
                                            <h3 className="font-bold text-sm text-gray-900">{proj.name}</h3>
                                            <p className="text-xs text-gray-600 mt-1 leading-relaxed">{proj.description}</p>
                                        </div>
                                        <div className="mt-2 text-[11px] text-gray-500 space-y-0.5">
                                            {proj.tech_stack?.length > 0 && <div><strong>Tech:</strong> {proj.tech_stack.join(", ")}</div>}
                                            {proj.link && <div><a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{proj.link}</a></div>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Education + Skills row */}
                <div className="grid grid-cols-2 gap-8">
                    {data.education && data.education.length > 0 && (
                        <section>
                            <div className="flex items-center gap-3 mb-3">
                                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Education</p>
                                <div className="flex-1 h-px bg-gray-200" />
                            </div>
                            <div className="space-y-3">
                                {data.education.map((edu, i) => (
                                    <div key={i} className="text-xs">
                                        <p className="font-bold text-gray-900">{edu.degree}{edu.field ? ` in ${edu.field}` : ""}</p>
                                        <p className="text-gray-500">{edu.institution}</p>
                                        {edu.location && <p className="text-gray-400 mb-0.5">{edu.location}</p>}
                                        <p className="text-gray-400">{formatDate(edu.graduation_date)}{edu.gpa ? ` · GPA ${edu.gpa}` : ""}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.skills && data.skills.length > 0 && (
                        <section>
                            <div className="flex items-center gap-3 mb-3">
                                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Skills</p>
                                <div className="flex-1 h-px bg-gray-200" />
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {data.skills.map((skill, i) => (
                                    <span key={i} className="text-xs px-2.5 py-0.5 bg-gray-100 text-gray-700">{skill}</span>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PremiumCleanGridTemplate;