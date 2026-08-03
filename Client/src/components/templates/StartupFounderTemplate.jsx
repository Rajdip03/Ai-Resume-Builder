const StartupFounderTemplate = ({ data, accentColor }) => {
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const [year, month] = dateStr.split("-");
        return new Date(year, month - 1).toLocaleDateString("en-US", { year: "numeric", month: "short" });
    };

    return (
        <div className="max-w-4xl mx-auto bg-white text-gray-900" style={{ fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif" }}>
            {/* Full-bleed hero strip */}
            <header className="relative px-10 py-10 overflow-hidden" style={{ backgroundColor: "#0f0f0f" }}>
                {/* Decorative accent bar */}
                <div className="absolute top-0 left-0 w-2 h-full" style={{ backgroundColor: accentColor }} />
                <div className="ml-4">
                    <p className="text-xs tracking-widest uppercase mb-1" style={{ color: accentColor }}>
                        {data.personal_info?.profession || "Professional Resume"}
                    </p>
                    <h1 className="text-5xl font-black text-white leading-none tracking-tight">
                        {(data.personal_info?.full_name || "Your Name").split(" ").map((w, i) => (
                            <span key={i} className={i % 2 === 1 ? "ml-3" : ""}>{w} </span>
                        ))}
                    </h1>
                    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs text-gray-400">
                        {data.personal_info?.email && <span>{data.personal_info.email}</span>}
                        {data.personal_info?.phone && <span>{data.personal_info.phone}</span>}
                        {data.personal_info?.location && <span>{data.personal_info.location}</span>}
                        {data.personal_info?.linkedin && <span className="break-all">{data.personal_info.linkedin}</span>}
                        {data.personal_info?.website && <span style={{ color: accentColor }} className="break-all">{data.personal_info.website}</span>}
                    </div>
                </div>
            </header>

            <div className="px-10 py-8">
                {/* TL;DR summary */}
                {data.professional_summary && (
                    <section className="mb-8 flex gap-6 items-start">
                        <span className="text-2xl font-black mt-0.5" style={{ color: accentColor }}>→</span>
                        <p className="text-base text-gray-800 leading-relaxed font-light">{data.professional_summary}</p>
                    </section>
                )}

                {/* Skills as tag cloud */}
                {data.skills && data.skills.length > 0 && (
                    <section className="mb-8">
                        <h2 className="text-xs font-black tracking-widest uppercase mb-3 text-gray-400">Stack & Skills</h2>
                        <div className="flex flex-wrap gap-2">
                            {data.skills.map((skill, i) => (
                                <span key={i} className="text-xs font-semibold px-3 py-1 rounded-full border" style={{ borderColor: accentColor, color: accentColor }}>
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </section>
                )}

                {/* Experience — card style */}
                {data.experiences && data.experiences.length > 0 && (
                    <section className="mb-8">
                        <h2 className="text-xs font-black tracking-widest uppercase mb-4 text-gray-400">Where I've Built</h2>
                        <div className="space-y-4">
                            {data.experiences.map((exp, i) => (
                                <div key={i} className="relative p-5 border border-gray-100 hover:border-gray-300 transition-colors">
                                    <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: i === 0 ? accentColor : "#e5e7eb" }} />
                                    <div className="flex justify-between items-start flex-wrap gap-2">
                                        <div>
                                            <h3 className="font-black text-base text-gray-900">{exp.position}</h3>
                                            <p className="text-sm font-semibold" style={{ color: accentColor }}>{exp.company}</p>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            {exp.location && <span className="text-xs text-gray-400 mb-0.5">{exp.location}</span>}
                                            <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1">
                                                {formatDate(exp.start_date)} – {exp.is_present ? "Now" : formatDate(exp.end_date)}
                                            </span>
                                        </div>
                                    </div>
                                    {exp.description && (
                                        <p className="text-sm text-gray-600 mt-2 leading-relaxed whitespace-pre-line">{exp.description}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Projects — bold grid */}
                {(data.project || data.projects) && (data.project || data.projects).length > 0 && (
                    <section className="mb-8">
                        <h2 className="text-xs font-black tracking-widest uppercase mb-4 text-gray-400">Things I've Shipped</h2>
                        <div className="grid grid-cols-2 gap-3">
                            {(data.project || data.projects).map((proj, i) => (
                                <div key={i} className="p-4 bg-gray-50 border-t-2 flex flex-col justify-between" style={{ borderColor: accentColor }}>
                                    <div>
                                        <h3 className="font-black text-sm text-gray-900">{proj.name}</h3>
                                        <p className="text-xs text-gray-600 mt-1 leading-relaxed">{proj.description}</p>
                                    </div>
                                    {(proj.tech_stack?.length > 0 || proj.link) && (
                                        <div className="mt-3 text-[11px] text-gray-500 space-y-1 font-medium">
                                            {proj.tech_stack && (Array.isArray(proj.tech_stack) ? proj.tech_stack.length > 0 : String(proj.tech_stack).trim()) && <div><span className="text-gray-400 font-bold uppercase tracking-wider text-[9px]">Stack:</span> {Array.isArray(proj.tech_stack) ? proj.tech_stack.join(", ") : String(proj.tech_stack)}</div>}
                                            {proj.link && <div><a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View Project ↗</a></div>}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Education inline */}
                {data.educations && data.educations.length > 0 && (
                    <section>
                        <h2 className="text-xs font-black tracking-widest uppercase mb-3 text-gray-400">Education</h2>
                        <div className="flex flex-wrap gap-6">
                            {data.educations.map((edu, i) => (
                                <div key={i} className="text-sm">
                                    <span className="font-bold text-gray-900">{edu.degree}{edu.field ? ` / ${edu.field}` : ""}</span>
                                    <span className="text-gray-400 mx-2">·</span>
                                    <span className="text-gray-600">{edu.institution}</span>
                                    <span className="text-gray-400 mx-2">·</span>
                                    <span className="text-gray-400 inline-flex flex-col items-center align-middle relative -top-1">
                                        {edu.location && <span className="text-[10px] leading-none mb-0.5">{edu.location}</span>}
                                        <span>{formatDate(edu.graduation_date)}</span>
                                    </span>
                                    {edu.gpa && <span className="text-gray-400 ml-2">· GPA {edu.gpa}</span>}
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default StartupFounderTemplate;