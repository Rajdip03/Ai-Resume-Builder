const HybridTimelineTemplate = ({ data, accentColor }) => {
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const [year, month] = dateStr.split("-");
        return new Date(year, month - 1).toLocaleDateString("en-US", { year: "numeric", month: "short" });
    };

    const getYear = (dateStr) => {
        if (!dateStr) return "";
        return dateStr.split("-")[0];
    };

    return (
        <div className="max-w-4xl mx-auto bg-white text-gray-900" style={{ fontFamily: "'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif" }}>
            {/* Top bar with name */}
            <header className="px-10 py-8 flex justify-between items-start">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900 leading-none">
                        {data.personal_info?.full_name || "Your Name"}
                    </h1>
                    {data.personal_info?.profession && (
                        <p className="text-sm mt-2 font-medium" style={{ color: accentColor }}>{data.personal_info.profession}</p>
                    )}
                </div>
                <div className="text-right text-xs text-gray-500 space-y-1 mt-1">
                    {data.personal_info?.email && <div>{data.personal_info.email}</div>}
                    {data.personal_info?.phone && <div>{data.personal_info.phone}</div>}
                    {data.personal_info?.location && <div>{data.personal_info.location}</div>}
                    {data.personal_info?.linkedin && <div className="break-all">{data.personal_info.linkedin}</div>}
                    {data.personal_info?.website && <div className="break-all">{data.personal_info.website}</div>}
                </div>
            </header>

            {/* Accent divider */}
            <div className="mx-10 h-0.5 bg-gray-900" />
            <div className="mx-10 h-0.5 mt-0.5" style={{ backgroundColor: accentColor }} />

            <div className="px-10 py-8 grid grid-cols-3 gap-8">
                {/* Left column: summary + skills + education */}
                <div className="col-span-1 space-y-7">
                    {data.professional_summary && (
                        <section>
                            <h2 className="text-xs font-extrabold tracking-widest uppercase mb-2 pb-1 border-b" style={{ color: accentColor, borderColor: accentColor }}>
                                About
                            </h2>
                            <p className="text-xs text-gray-700 leading-relaxed">{data.professional_summary}</p>
                        </section>
                    )}

                    {data.skills && data.skills.length > 0 && (
                        <section>
                            <h2 className="text-xs font-extrabold tracking-widest uppercase mb-2 pb-1 border-b" style={{ color: accentColor, borderColor: accentColor }}>
                                Skills
                            </h2>
                            <div className="space-y-1.5">
                                {data.skills.map((skill, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <div className="h-px flex-1 bg-gray-200">
                                            <div className="h-px" style={{ backgroundColor: accentColor, width: `${Math.max(40, 100 - i * 8)}%` }} />
                                        </div>
                                        <span className="text-xs text-gray-700 min-w-fit">{skill}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.educations && data.educations.length > 0 && (
                        <section>
                            <h2 className="text-xs font-extrabold tracking-widest uppercase mb-2 pb-1 border-b" style={{ color: accentColor, borderColor: accentColor }}>
                                Education
                            </h2>
                            <div className="space-y-3">
                                {data.educations.map((edu, i) => (
                                    <div key={i} className="text-xs">
                                        <p className="font-bold text-gray-900">{edu.degree}</p>
                                        {edu.field && <p className="text-gray-600">{edu.field}</p>}
                                        <p className="text-gray-500">{edu.institution}</p>
                                        <p className="text-gray-400">
                                            {edu.location && <span className="block mb-0.5">{edu.location}</span>}
                                            {formatDate(edu.graduation_date)}{edu.gpa ? ` · ${edu.gpa}` : ""}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Right column: timeline of experience + projects */}
                <div className="col-span-2">
                    {data.experiences && data.experiences.length > 0 && (
                        <section className="mb-7">
                            <h2 className="text-xs font-extrabold tracking-widest uppercase mb-4" style={{ color: accentColor }}>
                                Experience
                            </h2>
                            <div className="relative">
                                {/* Vertical line */}
                                <div className="absolute left-12 top-0 bottom-0 w-px bg-gray-200" />
                                <div className="space-y-6">
                                    {data.experiences.map((exp, i) => (
                                        <div key={i} className="flex gap-4">
                                            {/* Year badge */}
                                            <div className="w-12 flex-shrink-0 text-right">
                                                <span className="text-xs font-bold" style={{ color: accentColor }}>{getYear(exp.start_date)}</span>
                                            </div>
                                            {/* Dot */}
                                            <div className="flex-shrink-0 relative">
                                                <div className="w-3 h-3 rounded-full border-2 bg-white mt-0.5" style={{ borderColor: accentColor }} />
                                            </div>
                                            {/* Content */}
                                            <div className="flex-1 pb-2">
                                                <div className="flex justify-between items-baseline flex-wrap gap-1">
                                                    <h3 className="font-bold text-sm text-gray-900">{exp.position}</h3>
                                                    <div className="flex flex-col items-end">
                                                        {exp.location && <span className="text-xs text-gray-500 mb-0.5">{exp.location}</span>}
                                                        <span className="text-xs text-gray-500 font-medium">
                                                            {formatDate(exp.start_date)} – {exp.is_present ? "Present" : formatDate(exp.end_date)}
                                                        </span>
                                                    </div>
                                                </div>
                                                <p className="text-xs font-semibold text-gray-500 mt-0.5">{exp.company}</p>
                                                {exp.description && (
                                                    <p className="text-xs text-gray-600 mt-1.5 leading-relaxed whitespace-pre-line">{exp.description}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Projects */}
                    {(data.project || data.projects) && (data.project || data.projects).length > 0 && (
                        <section>
                            <h2 className="text-xs font-extrabold tracking-widest uppercase mb-4" style={{ color: accentColor }}>
                                Projects
                            </h2>
                            <div className="grid grid-cols-2 gap-3">
                                {(data.project || data.projects).map((proj, i) => (
                                    <div key={i} className="p-3 border border-gray-100 rounded flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ backgroundColor: accentColor }} />
                                                <h3 className="font-bold text-xs text-gray-900">{proj.name}</h3>
                                            </div>
                                            <p className="text-xs text-gray-500 leading-relaxed pl-4">{proj.description}</p>
                                        </div>
                                        <div className="pl-4 mt-2 space-y-1 text-[10px] text-gray-400">
                                            {proj.tech_stack && (Array.isArray(proj.tech_stack) ? proj.tech_stack.length > 0 : String(proj.tech_stack).trim()) && <div><strong>Tech:</strong> {Array.isArray(proj.tech_stack) ? proj.tech_stack.join(", ") : String(proj.tech_stack)}</div>}
                                            {proj.link && <div><a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{proj.link}</a></div>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HybridTimelineTemplate;