const AcademicResearcherTemplate = ({ data, accentColor }) => {
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const [year, month] = dateStr.split("-");
        return new Date(year, month - 1).toLocaleDateString("en-US", { year: "numeric", month: "short" });
    };

    return (
        <div className="max-w-4xl mx-auto bg-white text-gray-900" style={{ fontFamily: "'Palatino Linotype', 'Palatino', 'Book Antiqua', serif" }}>
            {/* CV-style header */}
            <header className="px-12 pt-10 pb-8">
                <h1 className="text-3xl font-normal text-gray-900 mb-1">
                    {data.personal_info?.full_name || "Your Name"}
                </h1>
                {data.personal_info?.profession && (
                    <p className="text-base text-gray-600 font-light mb-4">{data.personal_info.profession}</p>
                )}
                {/* Contact in a structured table-like format */}
                <div className="border-t border-b border-gray-400 py-3 flex flex-wrap gap-x-8 gap-y-1 text-sm text-gray-600" style={{ fontFamily: "'Arial', sans-serif" }}>
                    {data.personal_info?.email && (
                        <span><span className="font-semibold text-gray-800">Email:</span> {data.personal_info.email}</span>
                    )}
                    {data.personal_info?.phone && (
                        <span><span className="font-semibold text-gray-800">Tel:</span> {data.personal_info.phone}</span>
                    )}
                    {data.personal_info?.location && (
                        <span><span className="font-semibold text-gray-800">Location:</span> {data.personal_info.location}</span>
                    )}
                    {data.personal_info?.website && (
                        <span><span className="font-semibold text-gray-800">Web:</span> <span className="break-all">{data.personal_info.website}</span></span>
                    )}
                    {data.personal_info?.linkedin && (
                        <span><span className="font-semibold text-gray-800">LinkedIn:</span> <span className="break-all">{data.personal_info.linkedin}</span></span>
                    )}
                </div>
            </header>

            <div className="px-12 pb-10 space-y-7">
                {/* Research Statement */}
                {data.professional_summary && (
                    <section>
                        <h2 className="text-base font-bold uppercase tracking-widest mb-3" style={{ color: accentColor }}>Research Statement</h2>
                        <p className="text-sm text-gray-700 leading-loose">{data.professional_summary}</p>
                    </section>
                )}

                {/* Education — top position for academic CV */}
                {data.education && data.education.length > 0 && (
                    <section>
                        <h2 className="text-base font-bold uppercase tracking-widest mb-3" style={{ color: accentColor }}>Education</h2>
                        <div className="space-y-4">
                            {data.education.map((edu, i) => (
                                <div key={i} className="grid grid-cols-4 gap-4 text-sm" style={{ fontFamily: "'Arial', sans-serif" }}>
                                    <div className="col-span-1 text-right text-gray-500 pt-0.5">
                                        {edu.location && <div className="mb-1">{edu.location}</div>}
                                        {formatDate(edu.graduation_date)}
                                    </div>
                                    <div className="col-span-3">
                                        <p className="font-semibold text-gray-900">{edu.degree}{edu.field ? ` in ${edu.field}` : ""}</p>
                                        <p className="text-gray-600">{edu.institution}</p>
                                        {edu.gpa && <p className="text-gray-500 text-xs mt-0.5">GPA: {edu.gpa}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Experience — called Positions */}
                {data.experience && data.experience.length > 0 && (
                    <section>
                        <h2 className="text-base font-bold uppercase tracking-widest mb-3" style={{ color: accentColor }}>Academic & Professional Positions</h2>
                        <div className="space-y-5">
                            {data.experience.map((exp, i) => (
                                <div key={i} className="grid grid-cols-4 gap-4 text-sm" style={{ fontFamily: "'Arial', sans-serif" }}>
                                    <div className="col-span-1 text-right text-gray-500 pt-0.5">
                                        {exp.location && <div className="mb-1">{exp.location}</div>}
                                        {formatDate(exp.start_date)} –<br />{exp.is_current ? "Present" : formatDate(exp.end_date)}
                                    </div>
                                    <div className="col-span-3">
                                        <p className="font-semibold text-gray-900">{exp.position}</p>
                                        <p className="italic text-gray-600">{exp.company}</p>
                                        {exp.description && (
                                            <p className="text-gray-700 mt-1.5 leading-relaxed whitespace-pre-line">{exp.description}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Publications / Projects */}
                {(data.project || data.projects) && (data.project || data.projects).length > 0 && (
                    <section>
                        <h2 className="text-base font-bold uppercase tracking-widest mb-3" style={{ color: accentColor }}>Selected Publications & Projects</h2>
                        <ol className="space-y-3 list-decimal list-inside text-sm" style={{ fontFamily: "'Arial', sans-serif" }}>
                            {(data.project || data.projects).map((proj, i) => (
                                <li key={i} className="mb-2">
                                    <span className="font-semibold text-gray-900">"{proj.name}."</span>{" "}
                                    <span className="text-gray-600 italic">{proj.description}</span>
                                    {(proj.tech_stack?.length > 0 || proj.link) && (
                                        <div className="ml-4 mt-1 text-gray-600 flex flex-wrap gap-4 text-xs">
                                            {proj.tech_stack?.length > 0 && <span><strong>Tech:</strong> {proj.tech_stack.join(", ")}</span>}
                                            {proj.link && <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{proj.link}</a>}
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ol>
                    </section>
                )}

                {/* Skills — labeled as Research Competencies */}
                {data.skills && data.skills.length > 0 && (
                    <section>
                        <h2 className="text-base font-bold uppercase tracking-widest mb-3" style={{ color: accentColor }}>Research Competencies</h2>
                        <p className="text-sm text-gray-700 leading-relaxed" style={{ fontFamily: "'Arial', sans-serif" }}>
                            {data.skills.join(" · ")}
                        </p>
                    </section>
                )}
            </div>
        </div>
    );
};

export default AcademicResearcherTemplate;