/* 
   ==========================================================================
   TACTICAL_SEEDED: MAJOR_INTEL MIGRATION
   ==========================================================================
   
   PREREQUISITE: Run the following SQL in the Supabase SQL Editor:

   CREATE TABLE IF NOT EXISTS major_intel (
       id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
       uni_full TEXT NOT NULL,
       uni_short TEXT NOT NULL,
       faculty_name TEXT NOT NULL,
       faculty_short TEXT,
       major_name TEXT NOT NULL,
       tags TEXT[] DEFAULT '{}',
       icon TEXT,
       insights TEXT,
       quota TEXT,
       eng_prof TEXT,
       gpax TEXT,
       tuition TEXT,
       location TEXT,
       outlook TEXT,
       submit_requirements TEXT[] DEFAULT '{}',
       scores JSONB DEFAULT '[]',
       port_specs TEXT,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
   );

   ALTER TABLE major_intel ENABLE ROW LEVEL SECURITY;
   CREATE POLICY "Public Read Access" ON major_intel FOR SELECT USING (true);
   ==========================================================================
*/

const facultyData = [
    {
        uni: "Chulalongkorn University (CU)", faculties: [
            { name: "ISE (Int. School of Engineering)", short: "ISE", tags: ["ENG"], majors: ["AI / Robotics", "AERO", "ADME", "ICE", "NANO"], icon: "bi-cpu" },
            { name: "Faculty of Engineering", short: "ENG", tags: ["ENG"], majors: ["CEDT", "Computer Eng", "Mechanical Eng", "Electrical Eng", "Civil Eng", "Chemical Eng", "Water Resources"], icon: "bi-gear-fill" },
            { name: "Faculty of Science", short: "SCI", tags: ["SCI"], majors: ["Comp Sci", "BioTech", "Chemistry", "Biology", "Physics", "Math"], icon: "bi-calculator" }
        ]
    }
];

const intelStore = {
    "AI / Robotics": {
        insights: "Primary intercept for autonomous systems architecture and cognitive robotics.",
        quota: "30 SEATS",
        engProf: "IELTS 6.0+ / DUOLINGO 105+",
        gpax: "3.25 PREFERRED",
        tuition: "128,000 THB / SEM",
        location: "CU MAIN CAMPUS",
        outlook: "AI ENGINEER, ROBOTICS ARCHITECT, ML OPS",
        submit: ["E-PORTFOLIO", "SOP", "SAT_MATH"],
        scores: [
            { label: "SAT MATH (DIGITAL)", value: "700+ PT" },
            { label: "CU-ATS (SCI)", value: "800+ PT" },
            { label: "IELTS_MIN", value: "6.0 CORE" }
        ],
        port: "Mechanical/electronic prototypes mandatory. Evidence of Python/C++ logic deployment required."
    },
    "CEDT": {
        insights: "Core Digital Transformation node. Focuses on full-stack architecture and mission-critical cloud deployment.",
        quota: "120 SEATS",
        engProf: "IELTS 5.5+ / THAI_PROF",
        gpax: "3.50 THRESHOLD",
        tuition: "96,000 THB / SEM",
        location: "CU MAIN CAMPUS",
        outlook: "FULL-STACK DEV, CLOUD ARCHITECT, SEC OPS",
        submit: ["TECH_PORTFOLIO", "TRANSCRIPT", "APTITUDE"],
        scores: [
            { label: "TGAT (COMM)", value: "20%" },
            { label: "TPAT3 (LOGIC)", value: "40%" },
            { label: "A-LEVEL MATH 1", value: "40%" }
        ],
        port: "Highlight GitHub activity, live web-apps, or network security audits."
    },
    }
};

async function seedMajorIntel() {
    console.log("INITIATING MISSION: DATABASE_MIGRATION...");

    const entries = [];

    facultyData.forEach(u => {
        const uniShort = u.uni.split('(')[1]?.replace(')', '') || u.uni;
        const uniFull = u.uni.split('(')[0].trim();

        u.faculties.forEach(f => {
            const majors = (f.majors && f.majors.length > 0) ? f.majors : [null];

            majors.forEach(m => {
                const majorName = m || f.name.replace('Faculty of ', '').replace('College of ', '');
                const isInter = f.name.includes("ISE") || f.short === "BBA" || f.short === "SIIT" || f.short === "MUIC" || f.short === "TEP";

                const info = intelStore[majorName] || (isInter ? {
                    insights: `Strategic International track in ${majorName}. Global-standard technical deployment.`,
                    quota: "110 SEATS (EST)",
                    engProf: "IELTS 6.5+ / DUOLINGO 115+",
                    gpax: "3.00+ COMPETITIVE",
                    tuition: "125,000 THB / SEM",
                    location: "MAIN CAMPUS",
                    outlook: "INTERNATIONAL PROFESSIONAL",
                    submit: ["E-PORTFOLIO", "IELTS", "SAT_MATH"],
                    scores: [
                        { label: "SAT MATH", value: "700 PT" },
                        { label: "IELTS_MIN", value: "6.5" }
                    ],
                    port: "Dossier of international interest and core subject mastery."
                } : {
                    insights: `Specialized track focused on ${majorName}. Vital node in the ${f.name} industrial chain.`,
                    quota: "35-50 SEATS",
                    engProf: "IELTS 5.0+ / THAI_STD",
                    gpax: "2.75 - 3.00+",
                    tuition: "45,000 - 65,000 THB",
                    location: "PRIMARY_DOMAIN",
                    outlook: "GENERAL FIELD SPECIALIST",
                    submit: ["TRANSCRIPT", "TGAT/TPAT"],
                    scores: [
                        { label: "TGAT_TOTAL", value: "30%" },
                        { label: "TPAT_CORE", value: "30%" },
                        { label: "A-LEVEL_SUB", value: "40%" }
                    ],
                    port: "Academic focus summary and evidence of interest in the track."
                });

                entries.push({
                    uni_full: uniFull,
                    uni_short: uniShort,
                    faculty_name: f.name,
                    faculty_short: f.short,
                    major_name: majorName,
                    tags: f.tags || [],
                    icon: f.icon || 'bi-layers',
                    insights: info.insights,
                    quota: info.quota,
                    eng_prof: info.engProf,
                    gpax: info.gpax,
                    tuition: info.tuition,
                    location: info.location,
                    outlook: info.outlook,
                    submit_requirements: info.submit,
                    scores: info.scores,
                    port_specs: info.port
                });
            });
        });
    });

    console.log(`PREPARED ${entries.length} ENTRIES. ATTEMPTING SYNC...`);

    // Note: Assuming 'supabase' client is initialized globally as per existing project patterns
    const { data, error } = await supabase
        .from('major_intel')
        .insert(entries);

    if (error) {
        console.error("SYNC_ERROR:", error.message);
        alert("CRITICAL_FAILURE: " + error.message);
    } else {
        console.log("INTELLIGENCE_DEPLOYED: Mission Successful.");
        alert("SUCCESS: DATABASE SEEDED WITH " + entries.length + " MAJOR ENTRIES.");
    }
}

// To run: Open console and call seedMajorIntel();
seedMajorIntel();