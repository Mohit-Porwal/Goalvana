import axios from 'axios';

const fetchAIResponse = async (prompt) => {
  try {
    const response = await axios.post('http://127.0.0.1:5000/api/openai', { prompt });  // Call your backend endpoint
    const data = response.data;

    // Extract response content (adjust based on the backend response structure)
    const fullResponse = data.choices[0].message.content.trim();
    const quoteMatch = fullResponse.match(/"([^"]+)"/);
    const quote = quoteMatch ? quoteMatch[1] : fullResponse.split(/1\.\s*|2\.\s*/)[1].trim(); 

    return quote;
  } catch (error) {
    console.error('Error fetching response from backend:', error);
    return 'Something went wrong, please try again.';
  }
};

export default fetchAIResponse;







// import axios from 'axios';

// const fetchAIResponse = async (prompt) => {
//   try {
//     const response = await axios.post('http://127.0.0.1:5000/api/openai', {
//       model: "gpt-4o-mini",
//       messages: [{ role: "user", content: prompt }],
//       max_tokens: 200, 
//     }, {
//       headers: {
//         // 'Authorization': `Bearer ${key}`,
//         'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
//         'Content-Type': 'application/json'
//       }
//     });

//     // Trim the content and split based on expected separators like newlines, numbers, etc.
//     const fullResponse = response.data.choices[0].message.content.trim();

//     // Use regex to extract the first quoted sentence (adjust if needed based on the format)
//     const quoteMatch = fullResponse.match(/"([^"]+)"/);
//     const quote = quoteMatch ? quoteMatch[1] : fullResponse.split(/1\.\s*|2\.\s*/)[1].trim(); // Handle numbered or non-quoted cases

//     return quote;
//   } catch (error) {
//     console.error('Error fetching OpenAI response:', error);
//     return 'Something went wrong, please try again.';
//   }
// };


// export default fetchAIResponse;




// import axios from 'axios';
// import OpenAI from 'openai';

// const key = ''
// const client = new OpenAI({apiKey: `${key}`, dangerouslyAllowBrowser: true});

// const fetchAIResponse = async (prompt) => {
//   try {
//     // const response = await axios.post('https://api.openai.com/v1/chat/completions', {
//     //   model: "gpt-4o-mini",
//     //   messages: [{ role: "user", content: prompt }],
//     //   max_tokens: 500, 
//     // }, {
//     const response = await client.chat.completions.create({
//         messages: [{ role: 'user', content: prompt }],
//         model: 'gpt-4o-mini'
//     },{
//       headers: {
//         // 'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
//         // 'Authorization': `Bearer ${key}`,
//         'Content-Type': 'application/json'
//       }
//     });
//     return response.choices[0].message.content.trim();
//   } catch (error) {
//     console.error('Error fetching OpenAI response:', error);
//     return 'Something went wrong, please try again.';
//   }
// };

// export default fetchAIResponse;
