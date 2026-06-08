const FinanceConsultantTemplate = ({ data, accentColor }) => {
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const [year, month] = dateStr.split("-");
        return new Date(year, month - 1).toLocaleDateString("en-US", { year: "numeric", month: "short" });
    };

    return (
        <div className="max-w-4xl mx-auto bg-white" style={{ fontFamily: "'Times New Roman', 'Times', serif" }}>
            {/* Double-line top border */}
            <div className="h-2" style={{ backgroundColor: accentColor }} />
            <div className="h-0.5 bg-gray-200" />

            {/* Name block — centered, formal */}
            <header className="text-center px-10 py-8 border-b border-gray-300">
                <h1 className="text-4xl font-normal tracking-widest uppercase text-gray-900">
                    {data.personal_info?.full_name || "Your Name"}
                </h1>
                {data.personal_info?.profession && (
                    <p className="text-sm tracking-widest text-gray-500 mt-2 uppercase">{data.personal_info.profession}</p>
                )}
                <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 mt-4 text-xs text-gray-600" style={{ fontFamily: "'Arial', sans-serif" }}>
                    {data.personal_info?.email && <span>{data.personal_info.email}</span>}
                    {data.personal_info?.phone && <span>{data.personal_info.phone}</span>}
                    {data.personal_info?.location && <span>{data.personal_info.location}</span>}
                    {data.personal_info?.linkedin && <span className="break-all">{data.personal_info.linkedin}</span>}
                    {data.personal_info?.website && <span className="break-all">{data.personal_info.website}</span>}
                </div>
            </header>

            <div className="px-12 py-8">
                {/* Summary */}
                {data.professional_summary && (
                    <section className="mb-7 text-center">
                        <p className="text-sm text-gray-700 leading-relaxed italic max-w-2xl mx-auto">
                            {data.professional_summary}
                        </p>
                    </section>
                )}

                <hr className="border-gray-300 mb-7" />

                {/* Two-column: Experience + right rail */}
                <div className="flex gap-10">
                    {/* Left: Experience */}
                    <div className="flex-1">
                        {data.experience && data.experience.length > 0 && (
                            <section className="mb-7">
                                <h2 className="text-xs font-bold tracking-widest uppercase text-center mb-4" style={{ color: accentColor }}>
                                    ── Professional Experience ──
                                </h2>
                                <div className="space-y-5">
                                    {data.experience.map((exp, i) => (
                                        <div key={i}>
                                            <div className="flex justify-between items-baseline">
                                                <h3 className="font-bold text-sm text-gray-900">{exp.position}</h3>
                                                <span className="text-xs text-gray-500" style={{ fontFamily: "'Arial', sans-serif" }}>
                                                    {formatDate(exp.start_date)} – {exp.is_current ? "Present" : formatDate(exp.end_date)}
                                                </span>
                                            </div>
                                            <p className="text-xs font-semibold tracking-wide uppercase mt-0.5" style={{ color: accentColor }}>
                                                {exp.company}
                                            </p>
                                            {exp.description && (
                                                <p className="text-xs text-gray-700 mt-1.5 leading-relaxed whitespace-pre-line" style={{ fontFamily: "'Arial', sans-serif" }}>
                                                    {exp.description}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Projects */}
                        {data.project && data.project.length > 0 && (
                            <section>
                                <h2 className="text-xs font-bold tracking-widest uppercase text-center mb-4" style={{ color: accentColor }}>
                                    ── Engagements & Projects ──
                                </h2>
                                <div className="space-y-3">
                                    {data.project.map((proj, i) => (
                                        <div key={i} className="flex gap-3 text-xs" style={{ fontFamily: "'Arial', sans-serif" }}>
                                            <span className="font-bold text-gray-900 min-w-fit">{proj.name}</span>
                                            <span className="text-gray-400">|</span>
                                            <span className="text-gray-600 leading-relaxed">{proj.description}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Right rail */}
                    <div className="w-48 flex-shrink-0 border-l border-gray-200 pl-8">
                        {data.skills && data.skills.length > 0 && (
                            <section className="mb-7">
                                <h2 className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: accentColor }}>Expertise</h2>
                                <ul className="space-y-1.5">
                                    {data.skills.map((skill, i) => (
                                        <li key={i} className="text-xs text-gray-700 flex items-start gap-1.5" style={{ fontFamily: "'Arial', sans-serif" }}>
                                            <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: accentColor }} />
                                            {skill}
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {data.education && data.education.length > 0 && (
                            <section>
                                <h2 className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: accentColor }}>Education</h2>
                                <div className="space-y-4">
                                    {data.education.map((edu, i) => (
                                        <div key={i} className="text-xs" style={{ fontFamily: "'Arial', sans-serif" }}>
                                            <p className="font-bold text-gray-900">{edu.degree}</p>
                                            {edu.field && <p className="text-gray-600">{edu.field}</p>}
                                            <p className="text-gray-500">{edu.institution}</p>
                                            <p className="text-gray-400">{formatDate(edu.graduation_date)}</p>
                                            {edu.gpa && <p className="text-gray-400">GPA: {edu.gpa}</p>}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>

            <div className="h-0.5 bg-gray-200" />
            <div className="h-2" style={{ backgroundColor: accentColor }} />
        </div>
    );
};

export default FinanceConsultantTemplate;