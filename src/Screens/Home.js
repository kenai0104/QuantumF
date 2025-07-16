import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Player } from '@lottiefiles/react-lottie-player';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import quantumImage from '../assets/Quant.png';
import '../css/Home.css';
import kenaiLogo from '../assets/kenaiLogo.png';
import stringSimilarity from 'string-similarity';
import animationData from '../assets/animation.json';



ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Home = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const recognitionRef = useRef(null);
  const chatContainerRef = useRef(null);


  const getGraphTypeFromInput = (input) => {
    const text = input.toLowerCase();
    if (text.includes('graph') || text.includes('bar')) return 'bar';
    if (text.includes('pie') || text.includes('chart')) return 'pie';
    if (text.includes('production')) return 'line';
    return null;
  };

  const generateRandomColors = (count) => {
  return Array.from({ length: count }, () =>
    `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`
  );
};

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';
    document.head.appendChild(link);
  }, []);

  const startVoiceRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported in your browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        finalTranscript += event.results[i][0].transcript;
      }
      setTranscribedText(finalTranscript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
    };

    recognition.start();
    setShowModal(true);
  };

  const stopVoiceRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const closeModal = () => {
    stopVoiceRecognition();
    setShowModal(false);
    setTranscribedText('');
  };

  const handleMessage = async (text) => {
    const originalText = text.trim();
    const fullUserInput = originalText.toLowerCase();

    // Remove visualization terms from the query before sending to API
    let query = fullUserInput
      .replace(/\b(graph|chart|pie chart|plot|visualize|visualisation|visualization)\b/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (query === '') return;

    setMessages(prev => [...prev, { text: originalText, sender: 'user' }]);

    const greetings = ["hi","hello", "how are you", "what's up", "how are you doing", "what's going on", "how's it going", "how's everything", "how's life", "how's your day", "how's your week", "how's your month", "how's your year", "how's your weekend", "how's your morning"];
    if (greetings.includes(query)) {
      const greetingResponse = "Hi, Welcome to QuantM. How can I assist you today?";
      let index = 0;
      let animatedText = '';
      const interval = setInterval(() => {
        if (index < greetingResponse.length) {
          animatedText += greetingResponse[index];
          setMessages(prev => {
            const last = prev[prev.length - 1];
            if (last && last.sender === 'bot' && last.typing) {
              return [...prev.slice(0, -1), { ...last, text: animatedText }];
            } else {
              return [...prev, { text: animatedText, sender: 'bot', typing: true }];
            }
          });
          index++;
        } else {
          clearInterval(interval);
          setMessages(prev => [
            ...prev.slice(0, -1),
            { text: greetingResponse, sender: 'bot' }
          ]);
        }
      }, 30);
      return;
    }

    // Assistance intent
const helpKeywords = ["help", "assistance", "guidance", "support"];
if (helpKeywords.some(word => query.includes(word))) {
  const helpResponse = "Yes, how can I assist?";
  let index = 0;
  let animatedText = '';
  const interval = setInterval(() => {
    if (index < helpResponse.length) {
      animatedText += helpResponse[index];
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last && last.sender === 'bot' && last.typing) {
          return [...prev.slice(0, -1), { ...last, text: animatedText }];
        } else {
          return [...prev, { text: animatedText, sender: 'bot', typing: true }];
        }
      });
      index++;
    } else {
      clearInterval(interval);
      setMessages(prev => [
        ...prev.slice(0, -1),
        { text: helpResponse, sender: 'bot' }
      ]);
    }
  }, 30);
  return;
}

// Identity intent
const identityQuestions = ["what is your name", "who are you", "what's your name"];
if (identityQuestions.includes(query)) {
  const identityResponse = "Hey, this is QBot!";
  let index = 0;
  let animatedText = '';
  const interval = setInterval(() => {
    if (index < identityResponse.length) {
      animatedText += identityResponse[index];
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last && last.sender === 'bot' && last.typing) {
          return [...prev.slice(0, -1), { ...last, text: animatedText }];
        } else {
          return [...prev, { text: animatedText, sender: 'bot', typing: true }];
        }
      });
      index++;
    } else {
      clearInterval(interval);
      setMessages(prev => [
        ...prev.slice(0, -1),
        { text: identityResponse, sender: 'bot' }
      ]);
    }
  }, 30);
  return;
}


    const needsListHint = /^(all|show|list|which).*name|product|stock|price/.test(query);
    if (needsListHint && !query.includes("list") && !query.includes("show")) {
      query = "list " + query;
    }
    const revenueTerms = /\b(revenue|price|income|amount|money|total sales|total income|total revenue)\b/i;
    const userRole = sessionStorage.getItem('userRole') || 'guest';

    if (userRole === 'qtg' && revenueTerms.test(query)) {
      setMessages(prev => [...prev, { text: "⚠️ Access is Restricted", sender: 'bot' }])  ;
  
  return;
}
    try {

      const response = await fetch('https://quantumb.onrender.com/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: query,role:userRole }),
      });
      console.log("Body sent to API:", JSON.stringify({ question: query, role: userRole }));
      const data = await response.json();
      const result = data?.result || null;

      if (userRole === 'qtg' && Array.isArray(result)) {
  result.forEach(item => {
    delete item.total_revenue;
    delete item.revenue;
    delete item.price;
  });
}
      if (typeof result === 'string') {
        let cleanResult = result;

        const replacements = [
          { pattern: /^The SQL result shows that\s*/i, replacement: '' },
          { pattern: /^According to the SQL query\s*/i, replacement: '' },
          { pattern: /^Based on the SQL data\s*/i, replacement: '' },
        ];

        for (const { pattern, replacement } of replacements) {
          cleanResult = cleanResult.replace(pattern, replacement);
        }

        cleanResult = cleanResult.charAt(0).toUpperCase() + cleanResult.slice(1);

        let index = 0;
        let animatedText = '';
        const interval = setInterval(() => {
          if (index < cleanResult.length) {
            animatedText += cleanResult[index];
            setMessages(prev => {
              const last = prev[prev.length - 1];
              if (last && last.sender === 'bot' && last.typing) {
                return [...prev.slice(0, -1), { ...last, text: animatedText }];
              } else {
                return [...prev, { text: animatedText, sender: 'bot', typing: true }];
              }
            });
            index++;
          } else {
            clearInterval(interval);
            setMessages(prev => [
              ...prev.slice(0, -1),
              { text: cleanResult, sender: 'bot' }
            ]);
          }
        }, 30);
        return;
      }

      if (!result || !Array.isArray(result) || result.length === 0) {
        setMessages(prev => [
          ...prev,
          { text: "Sorry, I didn't understand that. Could you please rephrase?", sender: 'bot' }
        ]);
        return;
      }

      const wantsGraph = fullUserInput.includes("graph") || fullUserInput.includes("chart") || fullUserInput.includes("plot");
      const wantsStock = fullUserInput.includes("quantity") || fullUserInput.includes("chocolate_sales");
      const wantsPrice = fullUserInput.includes("revenue");
      const wantsNames = fullUserInput.includes("product") || fullUserInput.includes("product");

      const labels = result.map(item => item.product || item.id);
      const stockValues = result.map(item => Number(item.quantity) || Number(item.total_quantity));
      const priceValues = result.map(item => parseFloat(item.revenue) || Number(item.total_revenue)|| 0);

      let graphType = wantsGraph ? getGraphTypeFromInput(fullUserInput) || 'bar' : null;

      let graphData = null;

      if (wantsGraph) {
        const datasets = [];

        if (wantsStock) {
          datasets.push({
            label: 'Quantity',
            data: stockValues,
            backgroundColor: 'rgba(75,192,192,0.6)',
            borderColor: 'rgba(75,192,192,1)',
            fill: graphType === 'line',
            tension: 0.1,
          });
        }

        if (wantsPrice) {
          datasets.push({
            label: 'Revenue ($)',
            data: priceValues,
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
            borderColor: 'rgba(255, 99, 132, 1)',
            fill: graphType === 'line',
            tension: 0.1,
          });
        }

        if (!wantsStock && wantsPrice && datasets.length === 0) {
          datasets.push({
            label: 'Unit Price ($)',
            data: priceValues,
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
            borderColor: 'rgba(255, 99, 132, 1)',
            fill: graphType === 'line',
            tension: 0.1,
          });
        }

        if (datasets.length > 0) {
  if (graphType === 'pie') {
  const dataValues = wantsStock ? stockValues : priceValues;

  graphData = {
    labels, // These are product names
    datasets: [
      {
        data: dataValues,
        backgroundColor: generateRandomColors(labels.length),
        borderWidth: 1,
      },
    ],
  };

  chartOptions.plugins.tooltip = {
    callbacks: {
      label: function (context) {
        const label = context.product || '';
        const value = context.raw;
        const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
        const percentage = ((value / total) * 100).toFixed(2);

        return `${label}: ${value} (${percentage}%)`;
      },
    },
  };
}
else {
    graphData = {
      labels,
      datasets,
    };
  }
}

      }

      let botText = "Here is the data you requested:";
      if (wantsGraph && !wantsPrice && !wantsNames) {
        botText = "Here is the stock quantity graph:";
      } else if (wantsGraph && wantsPrice && !wantsStock) {
        botText = "Here is the product price graph:";
      } else if (wantsNames && !wantsGraph && !wantsPrice) {
        botText = "Here are the product names:";
      }

      let index = 0;
      let animatedText = '';
      const interval = setInterval(() => {
        if (index < botText.length) {
          animatedText += botText[index];
          setMessages(prev => {
            const last = prev[prev.length - 1];
            if (last && last.sender === 'bot' && last.typing) {
              return [...prev.slice(0, -1), { ...last, text: animatedText }];
            } else {
              return [...prev, { text: animatedText, sender: 'bot', typing: true }];
            }
          });
          index++;
        } else {
          clearInterval(interval);
          setMessages(prev => [
            ...prev.slice(0, -1),
            {
              text: botText,
              sender: 'bot',
              result: wantsGraph ? null : result,
              graphType: wantsGraph ? graphType : null,
              graphData: wantsGraph ? graphData : null,
            }
          ]);
        }
      }, 30);

    } catch (error) {
      console.error('Error calling chatbot API:', error);
      setMessages(prev => [
        ...prev,
        { text: "Error contacting server. Please try again later.", sender: 'bot' }
      ]);
    }
  };


  const handleSendTranscription = () => {
    handleMessage(transcribedText);
    setTranscribedText('');
    closeModal();
  };

  const handleSendInput = () => {
    handleMessage(inputText);
    setInputText('');
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Graph',
      },
    },
  };

  return (
    <>
      <div className={`home-container ${showModal ? 'modal-active' : ''}`}>
       <div className="kenai-logo">
  <img src={kenaiLogo} alt="Kenai Logo" />
</div>

        <div className="logo-container">
          <Player 
            autoplay 
            loop 
            speed={1} 
            src={animationData} 
            style={{ height: '70px', width: '70px', filter: 'hue-rotate(310deg)' }} 
          />
        </div>
        <div className="laptop-body">
          <div className="laptop-screen">
            <div className="chat-messages" ref={chatContainerRef}>
              {messages && messages.map((message, index) => (
                <div key={index}>
                  <div className={`chat-message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}>
                    <div className="chat-bubble-content">
                      <span className="chat-icon-inside">
                        <i className={`fas ${message.sender === 'user' ? 'fa-user' : 'fa-robot'}`}></i>
                      </span>
                      <span className="chat-text">{message.text}</span>
                    </div>
                  </div>

                  {message.sender === 'bot' && message.result && !message.graphType && (
                    <>
                      {/* Check if result is a single object with a COUNT(*) key */}
                      {message.result.length === 1 && message.result[0]['COUNT(*)'] !== undefined ? (
                        <div className="count-display">
                          <h3>Total Products Count  <p>{message.result[0]['COUNT(*)']}</p></h3>

                        </div>
                      ) : (
                        // Existing render logic for product list or names
                        Object.keys(message.result[0]).length === 1 ? (() => {
                          const key = Object.keys(message.result[0])[0];
                          const validKeys = [
                            'product',
                            'customer_name',
                            'quantity',
                            'revenue',
                            'country',
                            'sale_date',
                          ];
                          if (validKeys.includes(key)) {
                            const uniqueItems = [...new Set(message.result.map(item => item[key]).filter(Boolean))];
                            return (
                              <div className="only-names-list">
                                <ul>
                                  {uniqueItems.map((item, idx) => (
                                    <li key={idx}>{item}</li>
                                  ))}
                                </ul>
                              </div>
                            );
                          }
                          return <span>Sorry, no valid data found to display.</span>;
                        })() : (
                          <div className="product-table-container">
                            <table className="product-table">
                              <thead>
                                <tr>
                                  {Object.keys(message.result[0]).map((key, idx) => (
                                    <th key={idx}>{key.replace(/_/g, ' ')}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {message.result.map((item, rowIndex) => (
                                  <tr key={rowIndex}>
                                    {Object.values(item).map((value, colIndex) => (
                                      <td key={colIndex}>{String(value)}</td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                        )
                      )}
                    </>
                  )}



                  {message.graphType && message.graphData && (
                    <div className="graph-container">
                      {message.graphType === 'bar' && <Bar data={message.graphData} options={chartOptions} />}
                      {message.graphType === 'line' && <Line data={message.graphData} options={chartOptions} />}
                      {message.graphType === 'pie' && <Pie data={message.graphData} options={chartOptions} />}
                    </div>
                  )}




                </div>
              ))}

            </div>

            <button className="talk-button-inside" onClick={startVoiceRecognition}>
              <i className="fas fa-microphone"></i>
            </button>

            <div className="input-container">
              <input
                type="text"
                placeholder="Ask something..."
                className="input-field"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSendInput();
                  }
                }}
              />
              <button className="input-send-button" onClick={handleSendInput}>
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>

          <div className="laptop-base" />
        </div>
        <button className="logout-button" onClick={() => {
        sessionStorage.clear();
        navigate('/login');
      }}>
        <i className="fas fa-sign-out-alt"></i> Logout
      </button>



      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              <i className="fas fa-times"></i>
            </button>
            <h2>Transcribed Speech</h2>
            <p>{transcribedText || 'Start speaking and your words will appear here...'}</p>
            <button className="send-button" onClick={handleSendTranscription}>
              <i className="fas fa-paper-plane"></i> Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;