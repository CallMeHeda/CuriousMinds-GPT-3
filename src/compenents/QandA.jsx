import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { red } from "@mui/material/colors";

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
        <label htmlFor="question-input"></label>
        <Box sx={{ display: "flex", alignItems: "flex-end" }}>
          <AccountCircle sx={{ color: red[400], mr: 1, my: 0.5 }} />
          <TextField
            id="outlined-basic question-input"
            label="Ask your question"
            variant="standard"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            sx={{
              borderRadius: "2px",
              borderBottom: "2px solid red",
            }}
            InputLabelProps={{
              sx: {
                color: "red",
                textTransform: "capitalize",
              },
            }}
            inputProps={{
              sx: {
                color: "white",
              },
            }}
          />
        </Box>
        <button type="submit" onClick={handleClick}>
          Submit
        </button>
      </form>
      {loading && (
        <>
          <p>Waiting for the answer..</p>
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
