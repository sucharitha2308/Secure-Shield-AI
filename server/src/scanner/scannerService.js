const axios = require('axios');
const tls = require('tls');
const url = require('url');

const SECURITY_HEADERS = {
  'content-security-policy': 'Prevents Cross-Site Scripting (XSS) and data injection attacks.',
  'strict-transport-security': 'Enforces secure (HTTP over SSL/TLS) connections to the server.',
  'x-frame-options': 'Provides clickjacking protection.',
  'x-content-type-options': 'Prevents MIME-sniffing.',
  'referrer-policy': 'Controls how much referrer information should be included with requests.',
  'permissions-policy': 'Allows fine-grained control over browser features to improve security/privacy.',
};

exports.scanUrl = async (targetUrl) => {
  const startTime = Date.now();
  let response;
  try {
    response = await axios.get(targetUrl, { timeout: 10000, maxRedirects: 5 });
  } catch (error) {
    if (error.response) {
      response = error.response;
    } else {
      throw new Error(`Failed to reach ${targetUrl}: ${error.message}`);
    }
  }
  const responseTime = Date.now() - startTime;

  const headers = response.headers;
  const headerResults = analyzeHeaders(headers);
  const cookieResults = analyzeCookies(headers['set-cookie'] || []);
  
  let sslResults = { score: 0, details: [] };
  if (targetUrl.startsWith('https')) {
    sslResults = await analyzeSSL(targetUrl);
  }

  const technologies = detectTechnologies(headers, response.data);

  // Calculate total score out of 100
  let totalScore = 0;
  totalScore += (headerResults.score * 0.4);
  totalScore += (cookieResults.score * 0.2);
  if (targetUrl.startsWith('https')) {
    totalScore += (sslResults.score * 0.4);
  } else {
    // Huge penalty for no HTTPS
    totalScore -= 50; 
  }

  totalScore = Math.max(0, Math.min(100, Math.round(totalScore)));

  return {
    score: totalScore,
    results: {
      headers: headerResults,
      cookies: cookieResults,
      ssl: sslResults,
      technologies: technologies,
      performance: {
        responseTime,
        statusCode: response.status
      }
    }
  };
};

function analyzeHeaders(headers) {
  let score = 100;
  const details = [];

  for (const [header, desc] of Object.entries(SECURITY_HEADERS)) {
    if (headers[header] || headers[header.toLowerCase()]) {
      details.push({ header, status: 'Present', severity: 'Low', recommendation: 'Good job.' });
    } else {
      details.push({ 
        header, 
        status: 'Missing', 
        severity: header === 'strict-transport-security' || header === 'content-security-policy' ? 'High' : 'Medium',
        recommendation: `Add ${header} to ${desc.toLowerCase()}` 
      });
      score -= (header === 'strict-transport-security' || header === 'content-security-policy') ? 20 : 10;
    }
  }
  return { score: Math.max(0, score), details };
}

function analyzeCookies(setCookieHeaders) {
  if (!setCookieHeaders || setCookieHeaders.length === 0) {
    return { score: 100, details: [{ message: 'No cookies set', severity: 'Info' }] };
  }

  let score = 100;
  const details = [];

  setCookieHeaders.forEach(cookieStr => {
    const isHttpOnly = cookieStr.toLowerCase().includes('httponly');
    const isSecure = cookieStr.toLowerCase().includes('secure');
    const hasSameSite = cookieStr.toLowerCase().includes('samesite');

    const name = cookieStr.split('=')[0];

    if (!isHttpOnly) {
      details.push({ cookie: name, issue: 'Missing HttpOnly', severity: 'High', recommendation: 'Set HttpOnly flag to prevent XSS cookie theft.' });
      score -= 20;
    }
    if (!isSecure) {
      details.push({ cookie: name, issue: 'Missing Secure', severity: 'High', recommendation: 'Set Secure flag to ensure cookies are sent over HTTPS.' });
      score -= 20;
    }
    if (!hasSameSite) {
      details.push({ cookie: name, issue: 'Missing SameSite', severity: 'Medium', recommendation: 'Set SameSite flag to mitigate CSRF.' });
      score -= 10;
    }
  });

  if (details.length === 0) {
    details.push({ message: 'All cookies are securely configured.', severity: 'Low' });
  }

  return { score: Math.max(0, score), details };
}

function analyzeSSL(targetUrl) {
  return new Promise((resolve) => {
    const parsedUrl = new URL(targetUrl);
    const options = {
      host: parsedUrl.hostname,
      port: parsedUrl.port || 443,
      servername: parsedUrl.hostname,
      rejectUnauthorized: false
    };

    const socket = tls.connect(options, () => {
      const cert = socket.getPeerCertificate();
      const protocol = socket.getProtocol();
      
      let score = 100;
      const details = [];

      if (!cert || Object.keys(cert).length === 0) {
         resolve({ score: 0, details: [{ issue: 'No valid certificate found', severity: 'Critical' }] });
         socket.end();
         return;
      }

      const validTo = new Date(cert.valid_to);
      const daysRemaining = Math.floor((validTo - new Date()) / (1000 * 60 * 60 * 24));

      if (daysRemaining < 30) {
        score -= 50;
        details.push({ issue: 'Certificate expires soon or is expired', severity: 'High', daysRemaining });
      }

      if (protocol !== 'TLSv1.2' && protocol !== 'TLSv1.3') {
        score -= 40;
        details.push({ issue: 'Outdated TLS Protocol', severity: 'High', protocol, recommendation: 'Upgrade to TLS 1.2 or 1.3' });
      }

      resolve({
        score: Math.max(0, score),
        issuer: cert.issuer ? cert.issuer.O : 'Unknown',
        validFrom: cert.valid_from,
        validTo: cert.valid_to,
        protocol: protocol,
        details
      });
      socket.end();
    });

    socket.on('error', (err) => {
      resolve({ score: 0, details: [{ issue: `SSL Connection Error: ${err.message}`, severity: 'Critical' }] });
    });
  });
}

function detectTechnologies(headers, body) {
  const detected = [];
  const bodyStr = typeof body === 'string' ? body : '';
  const headerKeys = Object.keys(headers).map(k => k.toLowerCase());
  const headerVals = Object.values(headers).map(v => typeof v === 'string' ? v.toLowerCase() : '');

  // Basic regex detection
  if (headers['x-powered-by'] && headers['x-powered-by'].toLowerCase().includes('express')) detected.push({ name: 'Express', type: 'Web Framework' });
  if (headers['server'] && headers['server'].toLowerCase().includes('nginx')) detected.push({ name: 'Nginx', type: 'Web Server' });
  if (headers['server'] && headers['server'].toLowerCase().includes('apache')) detected.push({ name: 'Apache', type: 'Web Server' });
  
  if (bodyStr.includes('wp-content')) detected.push({ name: 'WordPress', type: 'CMS' });
  if (bodyStr.includes('React') || bodyStr.includes('data-reactroot')) detected.push({ name: 'React', type: 'Frontend Framework' });
  if (bodyStr.includes('Angular') || bodyStr.includes('ng-version')) detected.push({ name: 'Angular', type: 'Frontend Framework' });
  if (bodyStr.includes('Vue') || bodyStr.includes('data-v-')) detected.push({ name: 'Vue.js', type: 'Frontend Framework' });
  
  return { detected };
}
