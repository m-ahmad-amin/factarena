const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export async function evaluateDebate(topic, players, transcript) {
  // If the transcript is completely empty, throw an error
  if (!transcript || transcript.length === 0) {
    throw new Error('The debate has no arguments to evaluate! Please submit arguments before evaluating.');
  }

  const response = await fetch(`${API_BASE}/api/evaluate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      topic,
      players,
      transcript
    })
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    const errMsg = errData.error || `HTTP ${response.status}`;
    throw new Error(errMsg);
  }

  return await response.json();
}

export async function generateNicheTopic(customTopic) {
  if (!customTopic || !customTopic.trim()) return '';

  try {
    const response = await fetch(`${API_BASE}/api/niche-topic`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ customTopic: customTopic.trim() })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    return data.topic || customTopic.trim();
  } catch (err) {
    console.error('Failed to generate niche topic, using raw custom input:', err);
    return customTopic.trim();
  }
}
