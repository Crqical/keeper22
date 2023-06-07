import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import CircularProgress from '@mui/material/CircularProgress';
import { useRouter } from 'next/router';

export default function Home() {
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Welcome to Eibil's AutoGrader, You can find the questions under the chatbox." },
  ]);

  const messageListRef = useRef(null);
  const textAreaRef = useRef(null);
  const router = useRouter();

  // Fetch JSON data from URL and set it as userInput
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('https://raw.githubusercontent.com/Crqical/testers2/main/data.json');
      const data = await response.json();

      // Filter for JSON objects with "CURRENT" in the name and concatenate their contents
      const currentData = data.filter(item => item.name.includes("CURRENT")).map(item => item.content).join("\n");

      setUserInput(currentData);
    };
    fetchData();
  }, []);

  // Auto scroll chat to bottom
  useEffect(() => {
    const messageList = messageListRef.current;
    messageList.scrollTop = messageList.scrollHeight;
  }, [messages]);

  // Focus on text field on load
  useEffect(() => {
    textAreaRef.current.focus();
  }, []);

  // Handle errors
  const handleError = () => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: 'assistant', content: 'Oops! There seems to be an error. Please try again.' },
    ]);
    setLoading(false);
    setUserInput('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userInput.trim() === '') {
      return;
    }

    setLoading(true);

    // Add predefined prompt
    const prompt =
      'I want you to ACT like a High School English Teacher. Your purpose is to look at the questions I have provided you and score it through 1-10. 1 meaning the questions were not answered, and 10 meaning the student correctly answered the question. I want you to read the paragraph/essay and come back with a score of each question. In your response I want it to be in this format. Question 1 / Score: . The questions are (Where was Martin Luther King JR Born) , (How did Martin Luther King Jr Die) , (How did Martin Luther King JR impact the US). ';

    const context = [
      ...messages,
      { role: 'user', content: prompt + userInput },
    ];
    setMessages(context);

    // Send chat history to API
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages: context }),
    });

    // Reset user input
    setUserInput('');

    const data = await response.json();

    if (!data) {
      handleError();
      return;
    }

    setMessages((prevMessages) => [
      ...prevMessages,
      { role: 'assistant', content: data.result.content },
    ]);
    setLoading(false);
  };

  // Prevent blank submissions and allow for multiline input
  const handleEnter = (e) => {
    if (e.key === 'Enter' && userInput) {
      if (!e.shiftKey && userInput) {



        handleSubmit(e);
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  const goToIndex2 = () => {
    router.push('/index2');
  };

  return (
    <>
      <Head>
        <title>GradeFlow</title>
        <meta name="description" content="GPT-4 interface" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.topnav}>
        <div className={styles.navlogo}></div>
        <div className={styles.navlinks}></div>
      </div>
      <main className={styles.main}>
        <div className={styles.cloud}>
          <div ref={messageListRef} className={styles.messagelist}>
            {messages.map((message, index) => {
              if (message.role === 'assistant') {
                return (
                  <div key={index} className={styles.apimessage}>
                    <Image
                      src="/openai.png"
                      alt="AI"
                      width="30"
                      height="30"
                      className={styles.boticon}
                      priority={true}
                    />
                    <div className={styles.markdownanswer}>
                      <ReactMarkdown linkTarget={'_blank'}>
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                );
              } else {
                return null;
              }
            })}
          </div>
        </div>
        <div className={styles.center}>
          <div className={styles.cloudform}>
            <form onSubmit={handleSubmit}>
              <textarea
                disabled={loading}
                onKeyDown={handleEnter}
                ref={textAreaRef}
                autoFocus={false}
                rows={1}
                type="text"
                id="userInput"
                name="userInput"
                placeholder={
                  loading ? 'Waiting for response...' : 'Please paste in the paragraph/essay...'
                }
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className={styles.textarea}
              />
              <button type="submit" disabled={loading} className={styles.generatebutton}>
                {loading ? (
                  <div className={styles.loadingwheel}>
                    <CircularProgress color="inherit" size={20} />{' '}
                  </div>
                ) : (
                  // Send icon SVG in input field
                  <svg
                    viewBox="0 0 20 20"
                    className={styles.svgicon}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                  </svg>
                )}
              </button>
            </form>
          </div>
          <div className={styles.footer}>
            <button onClick={goToIndex2}>Go to index2.js</button>
          </div>
        </div>
      </main>
    </>
  );
}
