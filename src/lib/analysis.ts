export interface SkillCategory {
  name: string;
  skills: string[];
}

export type CompanySize = "Startup" | "Mid-size" | "Enterprise";

export interface CompanyIntel {
  companyName: string;
  industry: string;
  size: CompanySize;
  hiringFocus: string;
  rounds: RoundMapping[];
}

export interface RoundMapping {
  round: string;
  title: string;
  why: string;
}

export interface AnalysisEntry {
  id: string;
  createdAt: string;
  updatedAt: string;
  company: string;
  role: string;
  jdText: string;
  extractedSkills: SkillCategory[];
  plan: DayPlan[];
  checklist: RoundChecklist[];
  questions: string[];
  baseScore: number;
  finalScore: number;
  /** @deprecated use baseScore/finalScore instead */
  readinessScore?: number;
  skillConfidenceMap: Record<string, "know" | "practice">;
  companyIntel?: CompanyIntel;
}

export interface DayPlan {
  day: string;
  focus: string;
  tasks: string[];
}

export interface RoundChecklist {
  round: string;
  title: string;
  items: string[];
}

const SKILL_MAP: Record<string, string[]> = {
  "Core CS": ["dsa", "data structures", "algorithms", "oop", "object oriented", "dbms", "database management", "os", "operating system", "networks", "networking", "computer networks"],
  "Languages": ["java", "python", "javascript", "typescript", "c++", "c#", "golang", "go lang"],
  "Web": ["react", "next.js", "nextjs", "node.js", "nodejs", "express", "rest", "restful", "graphql", "angular", "vue", "html", "css"],
  "Data": ["sql", "mongodb", "postgresql", "mysql", "redis", "nosql", "database"],
  "Cloud/DevOps": ["aws", "azure", "gcp", "docker", "kubernetes", "k8s", "ci/cd", "cicd", "linux", "terraform", "jenkins"],
  "Testing": ["selenium", "cypress", "playwright", "junit", "pytest", "testing", "unit test", "integration test"],
};

const DISPLAY_MAP: Record<string, string> = {
  "dsa": "DSA", "data structures": "DSA", "algorithms": "DSA",
  "oop": "OOP", "object oriented": "OOP",
  "dbms": "DBMS", "database management": "DBMS",
  "os": "OS", "operating system": "OS",
  "networks": "Networks", "networking": "Networks", "computer networks": "Networks",
  "java": "Java", "python": "Python", "javascript": "JavaScript", "typescript": "TypeScript",
  "c++": "C++", "c#": "C#", "golang": "Go", "go lang": "Go",
  "react": "React", "next.js": "Next.js", "nextjs": "Next.js",
  "node.js": "Node.js", "nodejs": "Node.js", "express": "Express",
  "rest": "REST", "restful": "REST", "graphql": "GraphQL",
  "angular": "Angular", "vue": "Vue", "html": "HTML", "css": "CSS",
  "sql": "SQL", "mongodb": "MongoDB", "postgresql": "PostgreSQL",
  "mysql": "MySQL", "redis": "Redis", "nosql": "NoSQL", "database": "Database",
  "aws": "AWS", "azure": "Azure", "gcp": "GCP", "docker": "Docker",
  "kubernetes": "Kubernetes", "k8s": "Kubernetes", "ci/cd": "CI/CD", "cicd": "CI/CD",
  "linux": "Linux", "terraform": "Terraform", "jenkins": "Jenkins",
  "selenium": "Selenium", "cypress": "Cypress", "playwright": "Playwright",
  "junit": "JUnit", "pytest": "PyTest",
  "testing": "Testing", "unit test": "Unit Testing", "integration test": "Integration Testing",
};

export function extractSkills(jdText: string): SkillCategory[] {
  const lower = jdText.toLowerCase();
  const result: SkillCategory[] = [];

  for (const [category, keywords] of Object.entries(SKILL_MAP)) {
    const found = new Set<string>();
    for (const kw of keywords) {
      if (lower.includes(kw)) {
        found.add(DISPLAY_MAP[kw] || kw);
      }
    }
    if (found.size > 0) {
      result.push({ name: category, skills: Array.from(found) });
    }
  }

  if (result.length === 0) {
    result.push({ name: "Other", skills: ["Communication", "Problem solving", "Basic coding", "Projects"] });
  }

  return result;
}

export function calcReadinessScore(company: string, role: string, jdText: string, skills: SkillCategory[]): number {
  let score = 35;
  const categoryCount = skills.filter(s => s.name !== "General").length;
  score += Math.min(categoryCount * 5, 30);
  if (company.trim().length > 0) score += 10;
  if (role.trim().length > 0) score += 10;
  if (jdText.length > 800) score += 10;
  return Math.min(score, 100);
}

const hasCategory = (skills: SkillCategory[], name: string) =>
  skills.some(s => s.name === name);

const hasSkill = (skills: SkillCategory[], skill: string) =>
  skills.some(s => s.skills.some(sk => sk.toLowerCase().includes(skill.toLowerCase())));

export function generateChecklist(skills: SkillCategory[]): RoundChecklist[] {
  const web = hasCategory(skills, "Web");
  const data = hasCategory(skills, "Data");
  const cloud = hasCategory(skills, "Cloud/DevOps");
  const coreCS = hasCategory(skills, "Core CS");
  const testing = hasCategory(skills, "Testing");

  return [
    {
      round: "Round 1",
      title: "Aptitude & Basics",
      items: [
        "Practice quantitative aptitude (percentages, time & work, probability)",
        "Brush up logical reasoning and pattern recognition",
        "Review verbal ability and reading comprehension",
        "Practice basic programming MCQs",
        coreCS ? "Revise OS concepts: processes, threads, scheduling" : "Review basic computer fundamentals",
        "Solve 2–3 previous years' aptitude papers",
        "Time yourself on mock aptitude tests",
      ],
    },
    {
      round: "Round 2",
      title: "DSA & Core CS",
      items: [
        "Master arrays, strings, and hashing patterns",
        "Practice linked lists, stacks, queues",
        "Solve tree and graph problems (BFS, DFS, shortest path)",
        "Study dynamic programming: top-down & bottom-up",
        coreCS ? "Revise DBMS: normalization, ACID, joins, indexing" : "Review basic database concepts",
        coreCS ? "Review OS: deadlocks, memory management, paging" : "Understand process vs thread basics",
        "Practice 3 medium-level problems daily on any coding platform",
        "Review time & space complexity analysis",
      ],
    },
    {
      round: "Round 3",
      title: "Technical Interview (Projects + Stack)",
      items: [
        "Prepare a 2-minute walkthrough of your top project",
        web ? "Be ready to explain React lifecycle / hooks in depth" : "Review your primary framework's core concepts",
        data ? "Practice writing complex SQL queries from scratch" : "Know basic CRUD query patterns",
        cloud ? "Explain your CI/CD pipeline or deployment setup" : "Understand basic deployment concepts",
        testing ? "Describe your testing strategy and tools used" : "Know the difference between unit and integration tests",
        "Prepare to discuss trade-offs in your architectural decisions",
        "Have 2–3 examples of bugs you debugged and how",
        "Know your resume inside-out — every bullet point",
      ],
    },
    {
      round: "Round 4",
      title: "Managerial / HR",
      items: [
        "Prepare 'Tell me about yourself' (90-second version)",
        "Have 3 STAR-format stories ready (leadership, conflict, failure)",
        "Research the company's mission, recent news, and culture",
        "Prepare thoughtful questions for the interviewer",
        "Practice salary negotiation talking points",
        "Review common behavioral questions (teamwork, deadlines)",
        "Be ready to discuss your 5-year career goals",
      ],
    },
  ];
}

export function generatePlan(skills: SkillCategory[]): DayPlan[] {
  const web = hasCategory(skills, "Web");
  const data = hasCategory(skills, "Data");
  const cloud = hasCategory(skills, "Cloud/DevOps");
  const hasReact = hasSkill(skills, "react");
  const hasNode = hasSkill(skills, "node");
  const hasPython = hasSkill(skills, "python");
  const hasSQL = hasSkill(skills, "sql");

  return [
    {
      day: "Day 1",
      focus: "Fundamentals & Core CS",
      tasks: [
        "Review OOP principles: encapsulation, inheritance, polymorphism, abstraction",
        "Revise OS basics: process scheduling, deadlocks, virtual memory",
        "Study DBMS: normalization (1NF–BCNF), ACID properties",
        hasPython ? "Practice Python basics: list comprehensions, generators, decorators" : "Review your primary language's core features",
        "Solve 5 easy coding problems (arrays, strings)",
      ],
    },
    {
      day: "Day 2",
      focus: "Core CS Deep Dive",
      tasks: [
        "Study networking: TCP/IP, HTTP/HTTPS, DNS resolution",
        data || hasSQL ? "Practice SQL: JOINs, GROUP BY, subqueries, window functions" : "Review basic query patterns",
        "Revise complexity analysis: Big O for common algorithms",
        "Study sorting algorithms: quicksort, mergesort, heapsort",
        "Solve 5 easy-medium problems (hashing, two pointers)",
      ],
    },
    {
      day: "Day 3",
      focus: "DSA — Trees, Graphs, Recursion",
      tasks: [
        "Study binary trees: traversals, BST operations, height-balanced trees",
        "Practice graph algorithms: BFS, DFS, topological sort",
        "Solve 3 medium tree/graph problems",
        "Review recursion and backtracking patterns",
        "Study linked list operations and cycle detection",
      ],
    },
    {
      day: "Day 4",
      focus: "DSA — DP & Advanced Patterns",
      tasks: [
        "Study DP fundamentals: memoization vs tabulation",
        "Practice classic DP: knapsack, LCS, LIS, coin change",
        "Solve 3 medium DP problems",
        "Review sliding window and prefix sum techniques",
        "Practice greedy algorithm problems",
      ],
    },
    {
      day: "Day 5",
      focus: "Projects, Resume & Stack",
      tasks: [
        "Prepare 2-minute explanation of your top 2 projects",
        hasReact ? "Review React hooks, state management, component lifecycle" : web ? "Revise your frontend framework's core patterns" : "Review your project's tech stack deeply",
        hasNode ? "Revise Node.js event loop, middleware, async patterns" : cloud ? "Review your backend/infra tools and deployment flow" : "Review backend concepts you've used",
        "Align resume bullets with the JD's required skills",
        "Prepare to discuss technical trade-offs you made in projects",
      ],
    },
    {
      day: "Day 6",
      focus: "Mock Interview Practice",
      tasks: [
        "Do a timed mock coding round (2 problems in 45 min)",
        "Practice behavioral questions using STAR format",
        "Do a mock system design discussion (e.g., URL shortener)",
        "Record yourself answering 'Tell me about yourself'",
        "Review common HR questions: strengths, weaknesses, conflict",
      ],
    },
    {
      day: "Day 7",
      focus: "Revision & Weak Areas",
      tasks: [
        "Revisit problems you got wrong during the week",
        "Re-read key CS concepts you're weakest in",
        "Do a final timed aptitude test",
        "Review all your notes and flashcards",
        "Get good sleep — confidence matters on the day",
      ],
    },
  ];
}

export function generateQuestions(skills: SkillCategory[]): string[] {
  const questions: string[] = [];
  const pool: string[] = [];

  if (hasSkill(skills, "dsa")) {
    pool.push(
      "How would you find the kth largest element in an unsorted array? Discuss time complexity.",
      "Explain how you'd detect a cycle in a linked list and find its starting node.",
      "How would you optimize search in a sorted, rotated array?",
    );
  }
  if (hasSkill(skills, "oop")) {
    pool.push(
      "Explain the difference between composition and inheritance with a real-world example.",
      "What are SOLID principles? Which one do you find hardest to follow and why?",
    );
  }
  if (hasSkill(skills, "dbms")) {
    pool.push(
      "Explain the different levels of database normalization and when you'd denormalize.",
    );
  }
  if (hasSkill(skills, "sql") || hasSkill(skills, "postgresql") || hasSkill(skills, "mysql")) {
    pool.push(
      "Explain indexing in databases — when does it help and when can it hurt performance?",
      "Write a query to find the second highest salary in a table without using LIMIT.",
    );
  }
  if (hasSkill(skills, "react")) {
    pool.push(
      "Explain the difference between useState, useReducer, and external state management like Redux or Zustand.",
      "How does React's reconciliation algorithm work? What are keys and why do they matter?",
    );
  }
  if (hasSkill(skills, "node")) {
    pool.push(
      "Explain the Node.js event loop. How does it handle I/O-bound vs CPU-bound tasks?",
    );
  }
  if (hasSkill(skills, "python")) {
    pool.push(
      "What are Python decorators? Write a simple caching decorator from scratch.",
    );
  }
  if (hasSkill(skills, "java")) {
    pool.push(
      "Explain the difference between HashMap and ConcurrentHashMap. When would you use each?",
    );
  }
  if (hasSkill(skills, "docker") || hasSkill(skills, "kubernetes")) {
    pool.push(
      "Explain the difference between a Docker image and a container. How do layers work?",
    );
  }
  if (hasSkill(skills, "aws") || hasSkill(skills, "gcp") || hasSkill(skills, "azure")) {
    pool.push(
      "Compare serverless (Lambda/Cloud Functions) vs containerized deployments. When would you pick each?",
    );
  }
  if (hasSkill(skills, "rest") || hasSkill(skills, "graphql")) {
    pool.push(
      "Compare REST and GraphQL. What are the trade-offs and when would you choose one over the other?",
    );
  }
  if (hasSkill(skills, "mongodb") || hasSkill(skills, "nosql")) {
    pool.push(
      "When would you choose a NoSQL database over a relational one? Discuss consistency trade-offs.",
    );
  }
  if (hasSkill(skills, "ci/cd")) {
    pool.push(
      "Describe a CI/CD pipeline you've set up. What stages did it include and why?",
    );
  }
  if (hasSkill(skills, "testing") || hasSkill(skills, "selenium") || hasSkill(skills, "cypress")) {
    pool.push(
      "Explain the testing pyramid. How do you decide what to unit test vs integration test vs e2e test?",
    );
  }
  if (hasSkill(skills, "os")) {
    pool.push(
      "Explain deadlock conditions and how an operating system can prevent or recover from them.",
    );
  }
  if (hasSkill(skills, "system design")) {
    pool.push(
      "Design a URL shortener service. Discuss storage, hashing strategy, and read/write patterns.",
    );
  }

  // Always add generic strong questions
  pool.push(
    "Walk me through a challenging bug you debugged recently. What was your approach?",
    "How do you decide between optimizing for time complexity vs space complexity?",
    "Tell me about a project where you had to learn a new technology quickly. How did you approach it?",
    "Explain the difference between processes and threads. When would you use multithreading?",
  );

  // Pick first 10 unique
  for (const q of pool) {
    if (questions.length >= 10) break;
    if (!questions.includes(q)) questions.push(q);
  }

  return questions;
}

const ENTERPRISE_COMPANIES = [
  "amazon", "google", "microsoft", "meta", "apple", "infosys", "tcs",
  "wipro", "cognizant", "accenture", "deloitte", "ibm", "oracle", "sap",
  "salesforce", "adobe", "uber", "flipkart", "paytm", "walmart", "jpmorgan",
  "goldman sachs", "morgan stanley", "cisco", "intel", "samsung", "hcl",
  "capgemini", "ey", "kpmg", "pwc", "tech mahindra", "mindtree", "mphasis",
  "netflix", "spotify", "stripe", "airbnb", "twitter", "linkedin",
];

const MIDSIZE_COMPANIES = [
  "razorpay", "cred", "meesho", "zerodha", "phonepe", "swiggy", "zomato",
  "freshworks", "zoho", "postman", "browserstack", "hasura", "unacademy",
  "byjus", "groww", "slice", "jupiter", "smallcase", "lenskart",
];

function inferCompanySize(company: string): CompanySize {
  const lower = company.toLowerCase().trim();
  if (ENTERPRISE_COMPANIES.some((c) => lower.includes(c))) return "Enterprise";
  if (MIDSIZE_COMPANIES.some((c) => lower.includes(c))) return "Mid-size";
  return "Startup";
}

function inferIndustry(company: string, jdText: string): string {
  const text = `${company} ${jdText}`.toLowerCase();
  if (/fintech|banking|payment|trading|finance/.test(text)) return "Financial Services";
  if (/health|medical|pharma|biotech/.test(text)) return "Healthcare & Life Sciences";
  if (/ecommerce|e-commerce|retail|shopping/.test(text)) return "E-Commerce & Retail";
  if (/edtech|education|learning|academy/.test(text)) return "Education Technology";
  if (/gaming|game|entertainment/.test(text)) return "Gaming & Entertainment";
  if (/logistics|supply chain|delivery|shipping/.test(text)) return "Logistics & Supply Chain";
  return "Technology Services";
}

export function generateCompanyIntel(
  company: string,
  jdText: string,
  skills: SkillCategory[]
): CompanyIntel | undefined {
  if (!company.trim()) return undefined;

  const size = inferCompanySize(company);
  const industry = inferIndustry(company, jdText);
  const hasDSA = hasCategory(skills, "Core CS") || hasSkill(skills, "dsa");
  const hasWeb = hasCategory(skills, "Web");
  const hasCloud = hasCategory(skills, "Cloud/DevOps");

  let hiringFocus: string;
  if (size === "Enterprise") {
    hiringFocus =
      "Enterprise companies typically emphasize structured DSA rounds, core CS fundamentals, and behavioral interviews. Expect multiple rounds with a focus on problem-solving speed and clarity.";
  } else if (size === "Mid-size") {
    hiringFocus =
      "Mid-size companies balance DSA proficiency with practical skills. Expect hands-on coding rounds alongside system design discussions and cultural fit assessments.";
  } else {
    hiringFocus =
      "Startups prioritize practical problem-solving, stack depth, and ownership mindset. Expect take-home assignments or live coding with a focus on building real features fast.";
  }

  let rounds: RoundMapping[];

  if (size === "Enterprise") {
    rounds = [
      {
        round: "Round 1",
        title: "Online Test (DSA + Aptitude)",
        why: "Enterprise firms use this to screen thousands of candidates efficiently. Strong DSA and aptitude scores are table stakes.",
      },
      {
        round: "Round 2",
        title: hasDSA ? "Technical — DSA & Core CS" : "Technical — Problem Solving",
        why: "This is the make-or-break round. They test algorithmic thinking, data structures, and core CS depth under time pressure.",
      },
      {
        round: "Round 3",
        title: hasWeb ? "Tech + Projects (Stack Deep-Dive)" : "Tech + Projects",
        why: "Here they validate your real-world skills. Expect questions about your projects, architecture decisions, and debugging experiences.",
      },
      {
        round: "Round 4",
        title: "HR / Managerial",
        why: "Cultural fit and communication matter. They assess your growth mindset, teamwork, and alignment with company values.",
      },
    ];
  } else if (size === "Mid-size") {
    rounds = [
      {
        round: "Round 1",
        title: hasDSA ? "Coding Round (DSA + Logic)" : "Practical Coding Challenge",
        why: "Mid-size firms test a mix of algorithmic skills and practical problem-solving to find well-rounded engineers.",
      },
      {
        round: "Round 2",
        title: hasCloud ? "System Design & Infrastructure" : "System Discussion",
        why: "They want to see how you think about scale, trade-offs, and real-world system architecture.",
      },
      {
        round: "Round 3",
        title: hasWeb ? "Full-Stack Technical Discussion" : "Technical Deep-Dive",
        why: "This round goes deep into your stack expertise, past projects, and ability to learn and adapt quickly.",
      },
      {
        round: "Round 4",
        title: "Culture Fit & HR",
        why: "Team culture is critical at mid-size companies. They assess if you'll thrive in their environment.",
      },
    ];
  } else {
    rounds = [
      {
        round: "Round 1",
        title: hasWeb ? "Practical Coding (Build a Feature)" : "Take-Home / Live Coding",
        why: "Startups care about shipping. They test your ability to write clean, working code for a real-world problem.",
      },
      {
        round: "Round 2",
        title: "System Discussion & Architecture",
        why: "At a startup you'll make architecture decisions early. They want to know you can design scalable systems.",
      },
      {
        round: "Round 3",
        title: "Culture Fit & Founder Chat",
        why: "Startups are small teams — personality, ownership, and hustle matter as much as technical skill.",
      },
    ];
  }

  return { companyName: company, industry, size, hiringFocus, rounds };
}

export function runAnalysis(company: string, role: string, jdText: string): AnalysisEntry {
  const extractedSkills = extractSkills(jdText);
  const baseScore = calcReadinessScore(company, role, jdText, extractedSkills);
  const checklist = generateChecklist(extractedSkills);
  const plan = generatePlan(extractedSkills);
  const questions = generateQuestions(extractedSkills);
  const companyIntel = generateCompanyIntel(company, jdText, extractedSkills);
  const now = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
    company: company || "",
    role: role || "",
    jdText,
    extractedSkills,
    plan,
    checklist,
    questions,
    baseScore,
    finalScore: baseScore,
    skillConfidenceMap: {},
    companyIntel,
  };
}

/** Migrate legacy entries to the current schema */
export function migrateEntry(raw: Record<string, unknown>): AnalysisEntry | null {
  try {
    if (!raw.id || !raw.jdText || !raw.createdAt) return null;
    const entry = raw as unknown as AnalysisEntry & { readinessScore?: number };
    // Migrate readinessScore → baseScore/finalScore
    if (entry.baseScore === undefined && entry.readinessScore !== undefined) {
      entry.baseScore = entry.readinessScore;
      entry.finalScore = entry.readinessScore;
    }
    if (!entry.updatedAt) entry.updatedAt = entry.createdAt;
    if (!entry.skillConfidenceMap) entry.skillConfidenceMap = {};
    if (!entry.company) entry.company = "";
    if (!entry.role) entry.role = "";
    if (!Array.isArray(entry.extractedSkills)) return null;
    if (!Array.isArray(entry.plan)) return null;
    if (!Array.isArray(entry.checklist)) return null;
    if (!Array.isArray(entry.questions)) return null;
    return entry;
  } catch {
    return null;
  }
}
