const { OpenAI } = require('openai');

function generateMockReport(scanResults) {
  const risks = [];
  
  if (scanResults.results.headers.score < 100) {
    risks.push({
      title: "Missing Security Headers",
      severity: "Medium",
      description: "The application is missing several recommended HTTP security headers which can expose users to XSS, clickjacking, and MIME-sniffing attacks.",
      owaspMapping: "A05:2021-Security Misconfiguration",
      remediation: "Implement strict-transport-security, content-security-policy, and other missing headers on the web server."
    });
  }

  if (scanResults.results.cookies.score < 100) {
    risks.push({
      title: "Insecure Cookie Configuration",
      severity: "High",
      description: "Cookies are missing Secure or HttpOnly flags, leaving session tokens vulnerable to interception or cross-site scripting (XSS) theft.",
      owaspMapping: "A05:2021-Security Misconfiguration",
      remediation: "Ensure all sensitive cookies are set with Secure, HttpOnly, and SameSite attributes."
    });
  }

  if (scanResults.results.ssl && scanResults.results.ssl.score < 100) {
    risks.push({
      title: "Suboptimal SSL/TLS Configuration",
      severity: "High",
      description: "The SSL certificate or TLS protocol is outdated, potentially allowing man-in-the-middle attacks.",
      owaspMapping: "A02:2021-Cryptographic Failures",
      remediation: "Upgrade to TLS 1.2/1.3 and ensure certificates are valid and renewed automatically."
    });
  }

  if (risks.length === 0) {
    risks.push({
      title: "No Critical Vulnerabilities",
      severity: "Low",
      description: "The baseline automated scan did not identify any critical configuration risks.",
      owaspMapping: "N/A",
      remediation: "Continue periodic scanning and perform manual penetration testing."
    });
  }

  return {
    executiveSummary: `This is a locally generated summary (OpenAI API key not provided). The automated scan assessed the target for security misconfigurations. Based on the findings, the target achieved a score of ${scanResults.score}/100. Please review the detailed risk analysis below to improve the security posture.`,
    detectedRisks: risks
  };
}

exports.generateReport = async (scanResults) => {
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key') {
    return generateMockReport(scanResults);
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const prompt = `
    You are an expert Application Security Engineer. Review the following automated scan results for a web application and generate a structured JSON report.
    
    Scan Results:
    ${JSON.stringify(scanResults)}

    Output your response strictly in the following JSON format:
    {
      "executiveSummary": "A concise paragraph summarizing the overall security posture and critical risks.",
      "detectedRisks": [
        {
          "title": "Short title of the risk",
          "severity": "Critical|High|Medium|Low",
          "description": "Detailed explanation of the risk",
          "owaspMapping": "OWASP Top 10 category (e.g., A01:2021-Broken Access Control)",
          "remediation": "Actionable steps to fix the issue"
        }
      ]
    }
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
      response_format: { type: "json_object" }
    });

    const parsedData = JSON.parse(response.choices[0].message.content);
    return parsedData;
  } catch (error) {
    console.error("OpenAI error:", error.message);
    // Fallback to mock report on OpenAI failure
    return generateMockReport(scanResults);
  }
};
