const TechnicalEngineerTemplate = ({ data, accentColor }) => {
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const [year, month] = dateStr.split("-");
        return new Date(year, month - 1).toLocaleDateString("en-US", { year: "numeric", month: "short" });
    };

    return (
        <div className="max-w-4xl mx-auto bg-gray-950 text-gray-100" style={{ fontFamily: "'Courier New', 'Courier', monospace" }}>
            {/* Terminal-style header */}
            <header className="px-8 pt-8 pb-6">
                <div className="flex items-center gap-2 mb-4">
                    <span className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="ml-4 text-xs text-gray-500">resume.sh</span>
                </div>
                <div className="text-sm text-gray-400">
                    <span style={{ color: accentColor }}>$ </span>
                    <span className="text-gray-300">whoami</span>
                </div>
                <h1 className="text-3xl font-bold mt-1" style={{ color: accentColor }}>
                    {data.personal_info?.full_name || "Your Name"}
                </h1>
                {data.personal_info?.profession && (
                    <p className="text-sm text-gray-400 mt-1">// {data.personal_info.profession}</p>
                )}
                <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-400">
                    {data.personal_info?.email && <span className="text-gray-300">{data.personal_info.email}</span>}
                    {data.personal_info?.phone && <span>{data.personal_info.phone}</span>}
                    {data.personal_info?.location && <span>{data.personal_info.location}</span>}
                    {data.personal_info?.linkedin && <span className="break-all">{data.personal_info.linkedin}</span>}
                    {data.personal_info?.website && <span className="break-all">{data.personal_info.website}</span>}
                </div>
            </header>

            <div className="border-t border-gray-800 mx-8" />

            <div className="px-8 py-6 space-y-6">
                {/* Skills — shown as a code block */}
                {data.skills && data.skills.length > 0 && (
                    <section>
                        <div className="text-sm mb-2">
                            <span style={{ color: accentColor }}>$ </span>
                            <span className="text-gray-300">cat skills.json</span>
                        </div>
                        <div className="bg-gray-900 rounded p-4 border border-gray-800">
                            <span className="text-yellow-400">{"{"}</span>
                            <div className="ml-4 flex flex-wrap gap-2 my-1">
                                {data.skills.map((skill, i) => (
                                    <span key={i} className="text-sm">
                                        <span className="text-green-400">"{skill}"</span>
                                        {i < data.skills.length - 1 && <span className="text-gray-500">,</span>}
                                    </span>
                                ))}
                            </div>
                            <span className="text-yellow-400">{"}"}</span>
                        </div>
                    </section>
                )}

                {/* Summary */}
                {data.professional_summary && (
                    <section>
                        <div className="text-sm mb-2">
                            <span style={{ color: accentColor }}>$ </span>
                            <span className="text-gray-300">cat summary.txt</span>
                        </div>
                        <p className="text-sm text-gray-300 leading-relaxed pl-4 border-l-2 border-gray-700">{data.professional_summary}</p>
                    </section>
                )}

                {/* Experience */}
                {data.experience && data.experience.length > 0 && (
                    <section>
                        <div className="text-sm mb-3">
                            <span style={{ color: accentColor }}>$ </span>
                            <span className="text-gray-300">ls -la experience/</span>
                        </div>
                        <div className="space-y-4">
                            {data.experience.map((exp, i) => (
                                <div key={i} className="bg-gray-900 rounded p-4 border border-gray-800">
                                    <div className="flex justify-between items-start flex-wrap gap-2">
                                        <div>
                                            <span className="text-sm font-bold" style={{ color: accentColor }}>{exp.position}</span>
                                            <span className="text-gray-500 mx-2">@</span>
                                            <span className="text-sm text-gray-300">{exp.company}</span>
                                        </div>
                                        <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded">
                                            {formatDate(exp.start_date)} → {exp.is_current ? "now" : formatDate(exp.end_date)}
                                        </span>
                                    </div>
                                    {exp.description && (
                                        <div className="mt-2 text-xs text-gray-400 leading-relaxed whitespace-pre-line">
                                            {exp.description.split("\n").map((line, li) => (
                                                <div key={li} className="flex gap-2">
                                                    <span className="text-gray-600 select-none">▸</span>
                                                    <span>{line}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Projects */}
                {data.project && data.project.length > 0 && (
                    <section>
                        <div className="text-sm mb-3">
                            <span style={{ color: accentColor }}>$ </span>
                            <span className="text-gray-300">git log --projects</span>
                        </div>
                        <div className="space-y-3">
                            {data.project.map((proj, i) => (
                                <div key={i} className="pl-4 border-l border-gray-700">
                                    <span className="text-sm font-bold text-yellow-400">[{proj.name}]</span>
                                    <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{proj.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Education */}
                {data.education && data.education.length > 0 && (
                    <section>
                        <div className="text-sm mb-3">
                            <span style={{ color: accentColor }}>$ </span>
                            <span className="text-gray-300">cat education.md</span>
                        </div>
                        <div className="space-y-2">
                            {data.education.map((edu, i) => (
                                <div key={i} className="flex justify-between text-sm">
                                    <div>
                                        <span className="text-gray-200 font-semibold">{edu.degree}{edu.field ? ` in ${edu.field}` : ""}</span>
                                        <span className="text-gray-500 mx-2">·</span>
                                        <span className="text-gray-400">{edu.institution}</span>
                                        {edu.gpa && <span className="text-gray-500 ml-2 text-xs">GPA: {edu.gpa}</span>}
                                    </div>
                                    <span className="text-gray-500 text-xs">{formatDate(edu.graduation_date)}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                <div className="text-xs text-gray-600 pt-2">
                    <span style={{ color: accentColor }}>$ </span>
                    <span className="animate-pulse">_</span>
                </div>
            </div>
        </div>
    );
};

export default TechnicalEngineerTemplate;