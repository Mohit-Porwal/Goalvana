import axios from 'axios';

const fetchAIResponse = async (prompt) => {
  try {
    const response = await axios.post('http://127.0.0.1:5000/api/openai', { prompt });  // Call your backend endpoint
    const data = response.data;

    // Extract response content
    const fullResponse = data.choices[0].message.content.trim();

    // Extract all quotes into an array using a regular expression
    const quoteMatches = fullResponse.match(/"([^"]+)"/g).map(q => q.replace(/"/g, ''));

    // Randomly select a quote
    const randomQuote = quoteMatches[Math.floor(Math.random() * quoteMatches.length)];

    return randomQuote;
  } catch (error) {
    console.error('Error fetching response from backend:', error);
    return 'Something went wrong, please try again.';
  }
};

export default fetchAIResponse;