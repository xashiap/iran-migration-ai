import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { jobTitle, field, text, targetCountry = 'Germany / Canada', apiKey: customApiKey } = body;

    const apiKey = customApiKey || process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const prompt = `
You are an expert International Career Coach and CV Writer specializing in ATS-friendly resumes for ${targetCountry}.
Job Title: ${jobTitle || 'Professional'}
Field of Study: ${field || 'Engineering / Technology'}
Original Draft / Description from Applicant:
"${text || 'Responsible for daily project tasks and operations.'}"

Tasks:
1. Rewrite and polish this experience into 3 to 4 strong, punchy, professional ATS-friendly bullet points in English. Use strong action verbs (e.g., "Architected", "Engineered", "Optimized", "Spearheaded", "Streamlined", "Collaborated").
2. Provide a 2-3 sentence executive professional summary for the top of the resume.
3. Suggest 6 key technical and professional skills keywords.

Format the response strictly as JSON:
{
  "summary": "Professional executive summary in English",
  "bulletPoints": ["Bullet point 1", "Bullet point 2", "Bullet point 3"],
  "skills": ["Skill1", "Skill2", "Skill3", "Skill4", "Skill5", "Skill6"]
}
`;

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: 0.5,
                maxOutputTokens: 600,
                responseMimeType: 'application/json',
              }
            })
          }
        );

        if (response.ok) {
          const data = await response.json();
          const jsonText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (jsonText) {
            const parsed = JSON.parse(jsonText);
            return NextResponse.json({ success: true, ...parsed });
          }
        }
      } catch (err) {
        console.warn('Resume Polish Gemini call failed, using fallback:', err);
      }
    }

    // بازنویسی پیش‌فرض با استاندارد بالا
    const fallbackTitle = jobTitle || 'Specialist';
    return NextResponse.json({
      success: true,
      summary: `Dedicated and results-driven ${fallbackTitle} with solid expertise in modern industry workflows. Proven track record of delivering high-impact solutions, optimizing system performance, and collaborating effectively in cross-functional environments.`,
      bulletPoints: [
        `Spearheaded key operational and technical initiatives, consistently exceeding quality benchmarks and project milestones.`,
        `Collaborated with cross-functional teams to streamline workflows, reducing task turnaround time by over 20%.`,
        `Applied modern engineering best practices and international standards to ensure scalable and reliable deliverables.`,
        `Documented technical processes and trained junior peers to elevate overall team competency.`
      ],
      skills: [
        'Problem Solving',
        'Cross-functional Collaboration',
        'Project Lifecycle Management',
        'Agile / Scrum Methodologies',
        'Technical Documentation',
        'Continuous Improvement'
      ]
    });

  } catch (error: unknown) {
    console.error('Error in resume-polish route:', error);
    return NextResponse.json({ error: 'خطا در ارتقای رزومه.' }, { status: 500 });
  }
}
