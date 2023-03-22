import React, { useState } from "react";
import {
  InputAdornment,
  FormControl,
  InputLabel,
  Input,
  IconButton,
  AppBar,
  Toolbar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import QuestionAnswerTwoToneIcon from "@mui/icons-material/QuestionAnswerTwoTone";
import CopyrightIcon from "@mui/icons-material/Copyright";
import logo from "../assets/images/logo.png";

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const FormControls = styled(FormControl, {
  shouldForwardProp: (prop) => prop !== "focusColor",
})(({ color = "#ec4f4b", focusColor = "#cb437c" }) => ({
  // Base color label
  "& label": {
    color: "#d27272",
    fontSize: "15px",
  },
  // base color border bottom
  "& .MuiInput-underline:before": {
    borderBottomColor: color,
  },
  // base color border bottom on hover
  "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
    borderBottomColor: focusColor,
  },
  // base color label on focus
  "& label.Mui-focused": {
    color: focusColor,
    fontSize: "1rem",
  },
  // base color border bottom on focus
  "& .MuiInput-underline:after": {
    borderBottomColor: focusColor,
  },
  // color input
  "& Input": {
    color: "white",
  },
}));

const QandA = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [clickedIcon, setClickedIcon] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleSubmit = (e) => {
    e.preventDefault();
    setQuestion("");
  };

  const handleClick = () => {
    setClickedIcon(true);
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
      <AppBar
        position="static"
        sx={{ backgroundColor: "#0a1929", boxShadow: "0" }}
      >
        <Toolbar>
          {isMobile ? (
            <img src={logo} alt="Curious Minds" height="80" />
          ) : (
            <img src={logo} alt="Curious Minds" height="150" />
          )}
        </Toolbar>
      </AppBar>

      <div className="formDiv">
        <form className="form" onSubmit={handleSubmit}>
          <FormControls sx={{ m: 1, width: "25ch" }} variant="standard">
            <InputLabel htmlFor="standard-adornment-question">
              Ask your question
            </InputLabel>
            <Input
              id="question"
              type="text"
              name="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle"
                    onClick={handleClick}
                    className={clickedIcon ? "clickedIcon" : ""}
                  >
                    <QuestionAnswerTwoToneIcon
                      sx={{ color: "#7b6363", mr: 1, mt: -1 }}
                    ></QuestionAnswerTwoToneIcon>
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControls>
        </form>
      </div>
      <div className="answer">
        {loading && (
          <>
            <p>Waiting for the answer..</p>
          </>
        )}
        {answer ? (
          <>
            <p>{answer}</p>
          </>
        ) : (
          <p>Oups, no question ? 🙊</p>
        )}
      </div>

      <div className="footerDiv">
        <footer>
          {isMobile ? (
            <p>
              <CopyrightIcon
                className="copyrightIcon"
                sx={{ color: "white", fontSize: "15px" }}
              ></CopyrightIcon>
              &nbsp; 2023 &nbsp; <a href="https://fatimaelamri.tk">Fatima.</a>{" "}
              &nbsp; All rights reserved.
            </p>
          ) : (
            <p>
              <CopyrightIcon
                className="copyrightIcon"
                sx={{ color: "white", fontSize: "20px" }}
              ></CopyrightIcon>
              &nbsp;2023 &nbsp; <a href="https://fatimaelamri.tk">Fatima.</a>
              &nbsp; All rights reserved.
            </p>
          )}
        </footer>
      </div>
    </div>
  );
};

export default QandA;
