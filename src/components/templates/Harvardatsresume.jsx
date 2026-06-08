const HarvardATSResume = ({ data, accentColor }) => {
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const [year, month] = dateStr.split("-");
        return new Date(year, month - 1).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
        });
    };

    // ── Skill categorization by keyword matching ──────────────────────────────
    const LANG_KW = new Set([
        "javascript", "typescript", "python", "java", "c++", "c#", "c", "ruby", "go",
        "golang", "rust", "swift", "kotlin", "php", "perl", "scala", "r", "matlab", "dart",
        "lua", "shell", "bash", "sql", "html", "html5", "css", "css3", "sass", "less",
        "scss", "objective-c", "assembly", "haskell", "elixir", "clojure", "groovy",
        "powershell", "ocaml", "f#", "vba", "cobol", "fortran", "lisp", "prolog", "tcl",
        "solidity", "move", "apex", "pl/sql", "t-sql",
    ]);

    const FRAMEWORK_KW = [
        "react", "angular", "vue", "next", "nuxt", "svelte", "sveltekit", "remix",
        "gatsby", "ember", "backbone", "express", "fastapi", "django", "flask",
        "spring", "rails", "laravel", "nestjs", "asp.net", "blazor", ".net", "jquery",
        "tailwind", "bootstrap", "material ui", "mui", "chakra", "ant design",
        "node", "nodejs", "deno", "bun", "electron", "ionic", "flutter",
        "react native", "graphql", "rest api", "rest apis", "trpc", "apollo",
        "web accessibility", "full stack development", "redux", "zustand",
        "mobx", "jotai", "rxjs", "socket.io", "prisma", "sequelize", "mongoose",
        "typeorm", "drizzle", "webpack", "vite", "rollup", "parcel", "esbuild",
        "storybook", "jest", "vitest", "cypress", "playwright", "testing library",
        "three.js", "d3", "chart.js", "framer motion",
    ];

    const DB_KW = new Set([
        "mongodb", "mysql", "postgresql", "postgres", "sqlite", "redis", "cassandra",
        "dynamodb", "firebase", "firestore", "supabase", "oracle", "mariadb", "couchdb",
        "neo4j", "elasticsearch", "mssql", "sql server", "cockroachdb", "fauna",
        "influxdb", "timescaledb", "planetscale", "neon", "turso", "airtable",
    ]);

    const categorizeSkills = (skills = []) => {
        const out = { programming: [], frameworks: [], databases: [], tools: [] };
        skills.forEach((skill) => {
            const lower = skill.toLowerCase().trim();
            if (LANG_KW.has(lower)) {
                out.programming.push(skill);
            } else if (FRAMEWORK_KW.some((kw) => lower === kw || lower.startsWith(kw + " ") || lower.endsWith(" " + kw) || lower.includes(kw))) {
                out.frameworks.push(skill);
            } else if (DB_KW.has(lower)) {
                out.databases.push(skill);
            } else {
                out.tools.push(skill);
            }
        });
        return out;
    };

    const flatSkills = Array.isArray(data.skills) ? data.skills : [];
    const categorized = categorizeSkills(flatSkills);

    const SKILL_CATS = [
        { label: "Programming Languages", key: "programming" },
        { label: "Frameworks & Libraries", key: "frameworks" },
        { label: "Databases", key: "databases" },
        { label: "Tools & Technologies", key: "tools" },
    ];

    // ── Styles (applied via style tag so @media print works) ─────────────────
    const pageStyle = `
        @media print {
            @page { size: A4; margin: 16mm 18mm; }
            .harvard-resume { padding: 0 !important; max-width: 100% !important; box-shadow: none !important; }
            .harvard-resume * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
    `;

    // Shared heading style
    const SectionHeading = ({ children }) => (
        <h2
            style={{
                fontFamily: "'Times New Roman', Times, serif",
                fontSize: "11pt",
                fontWeight: "bold",
                textAlign: "center",
                borderBottom: "1px solid #111",
                paddingBottom: "2px",
                marginBottom: "6px",
                marginTop: "0",
                letterSpacing: "0.02em",
                color: "#111",
            }}
        >
            {children}
        </h2>
    );

    const baseStyle = {
        fontFamily: "'Times New Roman', Times, serif",
        fontSize: "11pt",
        lineHeight: "1.45",
        color: "#111",
        background: "#fff",
    };

    const xs = { fontSize: "10pt" };
    const bold = { fontWeight: "bold" };
    const upperBold = { fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.03em" };
    const italic = { fontStyle: "italic" };
    const row = { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" };
    const noWrap = { whiteSpace: "nowrap", flexShrink: 0 };

    return (
        <>
            <style>{pageStyle}</style>
            <div
                className="harvard-resume"
                style={{
                    ...baseStyle,
                    maxWidth: "210mm",
                    margin: "0 auto",
                    padding: "16mm 18mm",
                    background: "#fff",
                    boxSizing: "border-box",
                }}
            >
                {/* ── Header ───────────────────────────────────────────────────── */}
                <header style={{ textAlign: "center", marginBottom: "25px" }}>
                    {data.personal_info?.category && (
                        <p style={{ ...xs, fontStyle: "italic", textAlign: "right", marginBottom: "2px" }}>
                            {data.personal_info.category}
                        </p>
                    )}
                    <h1 style={{ fontSize: "13pt", fontWeight: "bold", margin: "0 0 3px", letterSpacing: "0.01em" }}>
                        {data.personal_info?.full_name || "Your Name"}
                    </h1>
                    <p style={{ ...xs, margin: 0, color: "#333" }}>
                        {[
                            data.personal_info?.location,
                            data.personal_info?.email,
                            data.personal_info?.phone,
                            data.personal_info?.website || data.personal_info?.linkedin,
                        ]
                            .filter(Boolean)
                            .join(" • ")}
                    </p>
                </header>

                {/* ── Professional Summary ────────────────────────────────────────── */}
                {data.professional_summary && (
                    <section style={{ marginBottom: "12px" }}>
                        <SectionHeading>Professional Summary</SectionHeading>
                        <p style={{ ...xs, margin: "2px 0 0", lineHeight: "1.4" }}>
                            {data.professional_summary}
                        </p>
                    </section>
                )}
                {/* ── Education ────────────────────────────────────────────────── */}
                {data.education && data.education.length > 0 && (
                    <section style={{ marginBottom: "12px" }}>
                        <SectionHeading>Education</SectionHeading>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            {data.education.map((edu, i) => (
                                <div key={i}>
                                    <div style={row}>
                                        <span style={{ ...xs, ...upperBold }}>{edu.institution}</span>
                                        {edu.location && (
                                            <span style={{ ...xs, ...noWrap }}>{edu.location}</span>
                                        )}
                                    </div>
                                    <div style={row}>
                                        <span style={xs}>
                                            {edu.degree}
                                            {edu.field ? ` in ${edu.field}` : ""}
                                            {edu.gpa ? `, GPA: ${edu.gpa}` : ""}
                                        </span>
                                        {edu.graduation_date && (
                                            <span style={{ ...xs, ...noWrap }}>{formatDate(edu.graduation_date)}</span>
                                        )}
                                    </div>
                                    {edu.coursework && (
                                        <p style={{ ...xs, margin: "2px 0 0" }}>
                                            <strong>Relevant Coursework:</strong> {edu.coursework}
                                        </p>
                                    )}
                                    {edu.notes && (
                                        <p style={{ ...xs, margin: "2px 0 0" }}>{edu.notes}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* ── Technical Skills ─────────────────────────────────────────── */}
                {flatSkills.length > 0 && (
                    <section style={{ marginBottom: "12px" }}>
                        <SectionHeading>Technical Skills</SectionHeading>
                        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                            {SKILL_CATS.map((cat) =>
                                categorized[cat.key] && categorized[cat.key].length > 0 ? (
                                    <p key={cat.key} style={{ ...xs, margin: 0 }}>
                                        <strong>{cat.label}:</strong>{" "}
                                        {categorized[cat.key].join(", ")}
                                    </p>
                                ) : null
                            )}
                        </div>
                    </section>
                )}

                {/* ── Projects ─────────────────────────────────────────────────── */}
                {data.project && data.project.length > 0 && (
                    <section style={{ marginBottom: "12px" }}>
                        <SectionHeading>Projects</SectionHeading>
                        <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
                            {data.project.map((proj, i) => (
                                <div key={i}>
                                    <div style={row}>
                                        <span style={{ ...xs, ...bold }}>{proj.name}</span>
                                        {(proj.start_date || proj.end_date) && (
                                            <span style={{ ...xs, ...noWrap }}>
                                                {proj.start_date && proj.end_date
                                                    ? `${formatDate(proj.start_date)} – ${formatDate(proj.end_date)}`
                                                    : proj.start_date
                                                        ? formatDate(proj.start_date)
                                                        : formatDate(proj.end_date)}
                                            </span>
                                        )}
                                    </div>
                                    {proj.description && (
                                        <p style={{ ...xs, margin: "2px 0 0", lineHeight: "1.4" }}>
                                            {proj.description}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* ── Experience ──────────────────────────────────────── */}
                {data.experience && data.experience.length > 0 && (
                    <section style={{ marginBottom: "12px" }}>
                        <SectionHeading> Experience</SectionHeading>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            {data.experience.map((exp, i) => (
                                <div key={i}>
                                    <div style={row}>
                                        <span style={{ ...xs, ...upperBold }}>{exp.company}</span>
                                        {exp.location && (
                                            <span style={{ ...xs, ...noWrap }}>{exp.location}</span>
                                        )}
                                    </div>
                                    <div style={row}>
                                        <span style={{ ...xs, ...bold, ...italic }}>{exp.position}</span>
                                        {exp.start_date && (
                                            <span style={{ ...xs, ...noWrap }}>
                                                {formatDate(exp.start_date)} –{" "}
                                                {exp.is_current ? "Present" : formatDate(exp.end_date)}
                                            </span>
                                        )}
                                    </div>
                                    {exp.description && (
                                        <p style={{ ...xs, margin: "2px 0 0", lineHeight: "1.4", whiteSpace: "pre-line" }}>
                                            {exp.description}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </>
    );
};

export default HarvardATSResume;