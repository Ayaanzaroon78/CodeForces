const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function checkHealth() {
  try {
    const res = await fetch(`${API_BASE}/api/health`);
    if (!res.ok) throw new Error('Backend unhealthy');
    return await res.json();
  } catch (err) {
    console.warn('API health check error:', err);
    return null;
  }
}

export async function analyzeRepository({ repoUrl, skills, experience, learningGoal }) {
  const payload = {
    repo_url: repoUrl.trim(),
    skills: skills,
    experience: experience,
    learning_goal: learningGoal?.trim() || null,
  };

  const response = await fetch(`${API_BASE}/api/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    const errorDetails = data?.error || {};
    const error = new Error(errorDetails.message || 'Failed to analyze repository');
    error.code = errorDetails.code || 'UNKNOWN_ERROR';
    error.status = response.status;
    throw error;
  }

  return data;
}

export async function sendMentorChat({ question, repositoryContext, recommendation }) {
  const payload = {
    question: question.trim(),
    repository_context: repositoryContext,
    recommendation: recommendation,
  };

  const response = await fetch(`${API_BASE}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    const errorDetails = data?.error || {};
    throw new Error(errorDetails.message || 'Mentor chat failed');
  }

  return data.answer;
}
