const ExecutiveBoardroomTemplate = ({ data, accentColor }) => {
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const [year, month] = dateStr.split("-");
        return new Date(year, month - 1).toLocaleDateString("en-US", { year: "numeric", month: "short" });
    };

    return (
        <div className="max-w-4xl mx-auto bg-white text-gray-900" style={{ fontFamily: "'Georgia', serif" }}>
            {/* Top rule */}
            <div className="h-1 w-full" style={{ backgroundColor: accentColor }} />

            {/* Name band */}
            <div className="px-12 pt-8 pb-6">
                <div className="flex items-end justify-between border-b-2 border-gray-900 pb-4">
                    <div>
                        <h1 className="text-5xl font-bold tracking-tight text-gray-900 uppercase">
                            {data.personal_info?.full_name || "Your Name"}
                        </h1>
                        {data.personal_info?.profession && (
                            <p className="text-base mt-1 tracking-widest uppercase" style={{ color: accentColor }}>
                                {data.personal_info.profession}
                            </p>
                        )}
                    </div>
                    <div className="text-right text-sm text-gray-600 space-y-1" style={{ fontFamily: "'Arial', sans-serif" }}>
                        {data.personal_info?.email && <div>{data.personal_info.email}</div>}
                        {data.personal_info?.phone && <div>{data.personal_info.phone}</div>}
                        {data.personal_info?.location && <div>{data.personal_info.location}</div>}
                        {data.personal_info?.linkedin && <div className="break-all">{data.personal_info.linkedin}</div>}
                        {data.personal_info?.website && <div className="break-all">{data.personal_info.website}</div>}
                    </div>
                </div>
            </div>

            <div className="px-12 pb-10">
                {/* Executive Summary */}
                {data.professional_summary && (
                    <section className="mb-8">
                        <div className="flex items-center gap-4 mb-3">
                            <span className="text-xs font-bold tracking-widest uppercase" style={{ color: accentColor }}>Executive Summary</span>
                            <div className="flex-1 h-px bg-gray-300" />
                        </div>
                        <p className="text-gray-800 leading-relaxed text-sm italic border-l-4 pl-4" style={{ borderColor: accentColor }}>
                            {data.professional_summary}
                        </p>
                    </section>
                )}

                {/* Experience */}
                {data.experience && data.experience.length > 0 && (
                    <section className="mb-8">
                        <div className="flex items-center gap-4 mb-4">
                            <span className="text-xs font-bold tracking-widest uppercase" style={{ color: accentColor }}>Career Record</span>
                            <div className="flex-1 h-px bg-gray-300" />
                        </div>
                        <div className="space-y-5">
                            {data.experience.map((exp, i) => (
                                <div key={i} className="grid grid-cols-4 gap-4">
                                    <div className="col-span-1 text-right pt-0.5">
                                        <p className="text-xs text-gray-500" style={{ fontFamily: "'Arial', sans-serif" }}>
                                            {exp.location && <span className="block mb-1">{exp.location}</span>}
                                            {formatDate(exp.start_date)} –<br />{exp.is_current ? "Present" : formatDate(exp.end_date)}
                                        </p>
                                        <p className="text-xs font-semibold text-gray-700 mt-1">{exp.company}</p>
                                    </div>
                                    <div className="col-span-3 border-l-2 border-gray-200 pl-4">
                                        <h3 className="font-bold text-gray-900 text-base">{exp.position}</h3>
                                        {exp.description && (
                                            <p className="text-sm text-gray-700 mt-1 leading-relaxed whitespace-pre-line" style={{ fontFamily: "'Arial', sans-serif" }}>
                                                {exp.description}
                                            </p>
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
                        <div className="flex items-center gap-4 mb-4">
                            <span className="text-xs font-bold tracking-widest uppercase" style={{ color: accentColor }}>Key Initiatives</span>
                            <div className="flex-1 h-px bg-gray-300" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {(data.project || data.projects).map((proj, i) => (
                                <div key={i} className="border border-gray-200 p-4 flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-sm">{proj.name}</h3>
                                        <p className="text-xs text-gray-600 mt-1 leading-relaxed" style={{ fontFamily: "'Arial', sans-serif" }}>{proj.description}</p>
                                    </div>
                                    <div className="mt-3 text-[11px] text-gray-500 space-y-1" style={{ fontFamily: "'Arial', sans-serif" }}>
                                        {proj.tech_stack?.length > 0 && <div><strong>Tech:</strong> {proj.tech_stack.join(", ")}</div>}
                                        {proj.link && <div><a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{proj.link}</a></div>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Bottom row */}
                <div className="grid grid-cols-2 gap-8">
                    {data.education && data.education.length > 0 && (
                        <section>
                            <div className="flex items-center gap-4 mb-4">
                                <span className="text-xs font-bold tracking-widest uppercase" style={{ color: accentColor }}>Education</span>
                                <div className="flex-1 h-px bg-gray-300" />
                            </div>
                            <div className="space-y-3">
                                {data.education.map((edu, i) => (
                                    <div key={i}>
                                        <p className="font-bold text-sm text-gray-900">{edu.degree}{edu.field ? `, ${edu.field}` : ""}</p>
                                        <p className="text-xs text-gray-600" style={{ fontFamily: "'Arial', sans-serif" }}>{edu.institution}</p>
                                        <p className="text-xs text-gray-400">
                                            {edu.location && <span className="block mb-0.5">{edu.location}</span>}
                                            {formatDate(edu.graduation_date)}{edu.gpa ? ` · GPA ${edu.gpa}` : ""}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.skills && data.skills.length > 0 && (
                        <section>
                            <div className="flex items-center gap-4 mb-4">
                                <span className="text-xs font-bold tracking-widest uppercase" style={{ color: accentColor }}>Core Competencies</span>
                                <div className="flex-1 h-px bg-gray-300" />
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {data.skills.map((skill, i) => (
                                    <span key={i} className="text-xs border border-gray-400 px-2 py-0.5 text-gray-700" style={{ fontFamily: "'Arial', sans-serif" }}>
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
            <div className="h-1 w-full" style={{ backgroundColor: accentColor }} />
        </div>
    );
};

export default ExecutiveBoardroomTemplate;