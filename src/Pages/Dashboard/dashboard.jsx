import React, { useState } from 'react'
import { URL } from '../../constants.js'
import Swal from 'sweetalert2'
import Aianswer from '../../component/AIanswer/Aianswer.jsx'
import HandelHistory from '../../component/HandelHistory/HandelHistory.jsx';
import ShowHistory from '../../component/ShowHistory/ShowHistory.jsx';
import UploadIcon from '@mui/icons-material/Upload';

const dashboard = () => {

  const [userInput, setUserInput] = useState("")
  const [aiResult, setAIResult] = useState([])

  const [showPreview, setShowPreview] = useState(null);
  const [showCode, setShowCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [refreshHistory, setRefreshHistory] = useState(0);


  const payload = {
    "contents": [{
      "parts": [{
        "text": `
      I have an idea: "${userInput}".
      Generate a startup pitch in *pure JSON* format only.
      DO NOT include markdown, backticks, or explanations.
      The JSON must look exactly like this:
      {
        "name": "",
        "tagline": "",
        "pitch": "",
        "audience": "",
        "landingPage": ""
      }
       
      Rules:
      - Respond ONLY with valid JSON (no markdown, code fences, or explanations).
      - The "landingPage" value must be a valid **escaped HTML string**.
      - Escape all double quotes inside HTML using backslashes (e.g., class=\"hero\").
      - Use \\n for new lines, NOT actual line breaks.
      - Inside "landingPage", provide a full, self-contained HTML document that starts with <!DOCTYPE html>.
      - Use HTML + CSS only (no JS), include an internal <style> block.
      - DO NOT include any external URLs, images, scripts, or CDNs.
      - The landing page must **NOT include any <a> tags or hyperlinks**.
      - The landing page must be modern, responsive, and have:
      - You MAY include external image URLs — choose images that match the idea or theme.
      - Every <img> tag must have:
           • A relevant external image URL (not a placeholder)
           • A descriptive alt attribute
      IMAGE RULES (CRITICAL):
        - You MUST include images using ONLY these reliable sources:
          • Hero section: https://picsum.photos/1200/600
          • Feature cards: https://picsum.photos/400/300
          • Team/About: https://picsum.photos/300/300
          • Footer/Logo: https://picsum.photos/150/150
        - DO NOT use Unsplash, Pexels, or any URLs with query parameters like ?ixlib, &w=, &q=, etc.
        - IMPORTANT: Add a unique seed/id to each image URL to get consistent, theme-related images:
          • Analyze the startup idea theme (e.g., fitness, food, tech, education, travel)
          • Add ?random=[theme-keyword] to each URL
          • Example for fitness app: https://picsum.photos/1200/600?random=fitness
          • Example for food delivery: https://picsum.photos/400/300?random=food
          • Use different numbers for variety: ?random=tech1, ?random=tech2, ?random=tech3
        - Every <img> tag must have:
          • Appropriate width/height from the list above
          • Theme-related random parameter
          • A descriptive alt attribute
          • CSS styling: style=\\"width: 100%; height: auto; object-fit: cover; border-radius: 8px;\\"
          • Example: <img src=\\"https://picsum.photos/400/300?random=startup1\\" alt=\\"Product feature\\" style=\\"width: 100%; height: auto; object-fit: cover; border-radius: 8px;\\">
       - The design must include:
      • A stunning hero section with a headline and call-to-action button
      • At least one <img> in each major section (hero, features, footer)
        • Gradient or soft color background
        • Rounded buttons with hover effects
        • Clean typography
        • Proper padding and spacing
        • Footer with © text
      - Keep the design fresh and startup-style (like a modern SaaS landing page).
      `
      }]
    }]
  }



  const checkIdea = async (input) => {
    const res = await fetch(URL, {
      method: "POST",
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `Check if this text is a valid startup idea: "${input}". Reply only 'yes' or 'no'.` }]
        }]
      })
    });
    const result = await res.json();
    const text = result.candidates[0].content.parts[0].text.toLowerCase();
    return text.includes("yes");
  };




  const getResponse = async () => {

    if (!userInput) {
      return Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill in all fields!',
      })
    }

    setLoading(true);


    const isValid = await checkIdea(userInput);
    if (!isValid) {
      await Swal.fire({
        icon: 'warning',
        title: 'Invalid Input',
        text: 'Please describe a proper startup idea!',
      });
      setLoading(false);
      setUserInput("")
      return;
    }

    try {

      let aiResponce = await fetch(URL, {
        method: "POST",
        body: JSON.stringify(payload)
      })

      aiResponce = await aiResponce.json()

      let dataString = aiResponce.candidates[0].content.parts[0].text

      dataString = dataString.replace(/```json|```/g, '').trim()

      let parsedData
      try {
        parsedData = JSON.parse(dataString)
      } catch {
        console.error("Invalid JSON:", dataString)
        Swal.fire({
          icon: 'error',
          title: 'AI Response Error',
          text: 'AI did not return valid JSON.',
        })
        return
      }

      // console.log(dataString);
      setAIResult([...aiResult, { type: "Q", text: userInput }, { type: "A", text: parsedData }])

      try {
        const saved = await HandelHistory({ question: userInput, answer: parsedData });

        if (saved) {
          console.log(" Saved to history!");
          setRefreshHistory(prev => prev + 1);
        }
      } catch (error) {
        console.error("Failed to save history:", error.message);
      }

      setUserInput("")

    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  }

  // console.log(aiResult);



  const isEnter = (e) => {
    // console.log(e.key);
    if (e.key == "Enter") {
      e.preventDefault();
      getResponse()
    }
  }

  const handleHistoryClick = (historyItem) => {
    setAIResult([
      ...aiResult,
      { type: "Q", text: historyItem.question },
      { type: "A", text: historyItem.answer }
    ]);

    setSidebarOpen(false);
  };


  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-5 h-screen bg-zinc-900 text-white relative">

        {/* Left Sidebar */}
        <div className={`fixed md:relative inset-y-0 left-0 z-50 w-64 md:w-auto md:col-span-1 bg-zinc-800 
          border-r border-zinc-700 p-4 overflow-y-auto transform transition-transform duration-300
         ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
          <ShowHistory onHistoryClick={handleHistoryClick} refreshTrigger={refreshHistory} />
        </div>

        {/* Overlay for mobile when sidebar open */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}


        {/* Main Area */}
        <div className="col-span-1 md:col-span-4 flex flex-col justify-between p-3 md:p-6">

          {/* Mobile Menu Button - Add this at the TOP */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden fixed top-4 left-4 z-50 bg-zinc-800 p-2 rounded-lg border border-zinc-600"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Chat Display */}
          <div className="flex-1 overflow-y-auto pr-2 mt-12 md:mt-0">
            <ul className="space-y-3">
              {aiResult.map((item, index) => (
                <div
                  key={index}
                  className={`flex ${item.type === "Q" ? "justify-end" : "justify-start"}`}
                >
                  {/* USER MESSAGE */}
                  {item.type === "Q" ? (
                    <li className="p-3 bg-gradient-to-r from-blue-700 to-blue-800 rounded-2xl shadow-md text-right max-w-[90%] md:max-w-[70%]">
                      <Aianswer ans={item.text} customKey={index} />
                    </li>
                  ) : (
                    /* AI RESPONSE */
                    <li className="p-3 md:p-4 bg-zinc-800 border border-zinc-700 rounded-2xl max-w-[95%] md:max-w-[80%]">
                      <div>
                        <p><strong>Name:</strong> {item.text.name}</p>
                        <p><strong>Tagline:</strong> {item.text.tagline}</p>
                        <p><strong>Pitch:</strong> {item.text.pitch}</p>
                        <p><strong>Audience:</strong> {item.text.audience}</p>

                        {/* Action Buttons */}
                        <div className="mt-4 flex flex-col sm:flex-row gap-2">
                          <button
                            onClick={() => {
                              setShowPreview(prev => prev === index ? null : index)
                              setShowCode(null)
                            }}
                            className="bg-blue-600 hover:bg-blue-700 transition px-3 py-2 rounded-lg text-sm"
                          >
                            {showPreview === index ? "Hide Preview" : "Show Preview"}
                          </button>

                          <button
                            onClick={() => {
                              setShowCode(prev => prev === index ? null : index)
                              setShowPreview(null)
                            }}
                            className="bg-zinc-700 hover:bg-zinc-600 transition px-3 py-2 rounded-lg text-sm"
                          >
                            {showCode === index ? "Hide Code" : "View Code"}
                          </button>
                        </div>

                        {/* Preview Section */}
                        {showPreview === index && (
                          <iframe
                            srcDoc={item.text.landingPage}
                            title="Landing Page Preview"
                            className="w-full h-80 border border-zinc-700 mt-3 rounded-xl"
                          />
                        )}

                        {/* Code Section */}
                        {showCode === index && (
                          <div className="relative mt-3 border border-zinc-700 rounded-xl overflow-hidden">
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(item.text.landingPage)
                                Swal.fire({
                                  icon: 'success',
                                  title: 'Copied!',
                                  text: 'Landing page code copied.',
                                  timer: 1500,
                                  showConfirmButton: false,
                                })
                              }}
                              className="absolute top-2 right-2 bg-zinc-700 text-xs px-2 py-1 rounded-md hover:bg-zinc-600"
                            >
                              Copy
                            </button>

                            <div className="bg-black text-green-400 p-3 h-80 overflow-auto font-mono text-sm">
                              <pre className="whitespace-pre-wrap">{item.text.landingPage}</pre>
                            </div>
                          </div>
                        )}
                      </div>
                    </li>
                  )}
                </div>
              ))}
            </ul>
          </div>

          {/* Input Section */}
          <div className="mt-4 flex items-center justify-center px-2 md:px-0">
            <div className="bg-zinc-800 w-full md:w-2/3 flex items-center border border-zinc-600 rounded-full px-2 md:px-3 py-1">
              <input
                onKeyDown={isEnter}
                onChange={(e) => setUserInput(e.target.value)}
                value={userInput}
                type="text"
                placeholder="💡 Share your startup idea..."
                className="flex-1 bg-transparent outline-none p-2 md:p-3 text-sm md:text-base text-white placeholder-zinc-400"
              />
              <button
                onClick={getResponse}
                disabled={loading}
                className={`flex items-center justify-center w-10 h-10 rounded-full transition ${loading ? "bg-zinc-700 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
              >
                {loading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                ) : (
                  <UploadIcon />
                )}
              </button>
            </div>
          </div>

        </div>
      </div>
    </>

  )
}

export default dashboard