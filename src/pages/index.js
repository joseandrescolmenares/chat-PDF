
import style from "../styles/Home.module.css";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import { getMessage } from "../service/message";


const Chat = () => {
  const router = useRouter();
  const container = useRef(null);
  const [question, setQuestion] = useState("");
  const [isLoading, setIsloading] = useState(false);
  const [validateRoute, setValidateRouter] = useState(true);
  const [message, setMessage] = useState({
    message: [
      {
        text: "Welcome! I'm an artificial intelligence assistant designed to help you find answers to your questions in documents.",
        user: false,
      },
    ],
    history: [],
  });
  

  useEffect(() => {
    container?.current?.scrollTo(0, container?.current.scrollHeight);
  }, [message]);

  useEffect(() => {
    if (!router.query) return;
    if (router.query) {
      setValidateRouter(false);
    }
  }, [router, ]);

  const handleEnter = (e) => {
    if (e.key === "Enter" && question) {
      handleSubmit(e);
    } else if (e.key == "Enter") {
      e.preventDefault();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question) {
      alert("Please input a question");
      return;
    }
    const Userquestion = question.trim();
    setMessage((prevMessage) => ({
      ...prevMessage,
      message: [...prevMessage.message, { text: Userquestion, user: true }],
    }));
    setQuestion("");
    setIsloading(true);
    const messagePdf = false;

    const result = await getMessage(Userquestion, message.history, messagePdf);
    const data = await result.json();
    setIsloading(false);
    setMessage((prevMessage) => ({
      ...prevMessage,
      message: [...prevMessage.message, { text: data.text, user: false }],
      history: [...prevMessage.history, [question, data.text]],
    }));
  };

  if (validateRoute) return <p>404</p>;

  return (
    <div>
      <div className={style.containerChatMessage}>
        <div
          ref={container}
          className={style.containerMessage}
        >
          {message?.message.map((msg, i) => (
            <div
              key={i}
              className={msg.user ? style.userContent : style.apiContent}
            >
              <p className={msg.user ? style.userMessage : style.apiMessage}>
                {msg.text}
              </p>
            </div>
          ))}
        </div>
        <div className={style.containerInput}>
          <form onSubmit={handleSubmit}>
            {isLoading ? (
              <span className={style.loaderMessage}></span>
            ) : (
              <div>
                <input
                  onKeyDown={handleEnter}
                  type="text"
                  className={style.inputMessage}
                  placeholder="Send Question...."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
