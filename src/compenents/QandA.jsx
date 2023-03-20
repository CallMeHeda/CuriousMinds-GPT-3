import React, { useState } from "react";

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const QandA = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setQuestion("");
  };

  const handleClick = () => {
    setLoading(true);
    openai
      .createCompletion({
        model: "text-davinci-003",
        prompt: `Question: ${question}\nAnswer:`,
        max_tokens: 2048,
        n: 1,
        stop: ["\n"],
      })
      .then((response) => {
        setAnswer(response.data.choices[0].text.trim());
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  return (
    <div className="question-and-answer">
      <form onSubmit={handleSubmit}>
        <label htmlFor="question-input">Ask your question : </label>
        <input
          id="question-input"
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <button type="submit" onClick={handleClick}>
          Submit
        </button>
      </form>
      {loading && (
        <>
          <p>Waiting for the answer...</p>
        </>
      )}
      {answer ? (
        <>
          <p>Answer :</p>
          <p>{answer}</p>
        </>
      ) : (
        <p>Oups 🙊</p>
      )}
    </div>
  );
};

export default QandA;
