import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { useInterval } from '../actions/useInterval';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { ButtonGroup } from '@mui/material';

import getDailyQuiz from './quizes/Quiz';

import { useWeb3React } from '@web3-react/core'; // use web3 to check user is connected
import ropstenData from '../assets/ropsten-testnet-data.json';


function Question(questions, questionIndex, timeRemaining, setAnswer) {

    let question = questions[questionIndex];
    let options = new Object();

    const [selectedAnswer, setSelectedAnswer] = useState(-1);

    for (let i = 0 ; i < question["options"].length ; i++)
    {
        options[question["options"][i].text.toLowerCase()] = i;
    }

    const onClick = (e) => {
        setSelectedAnswer(options[e.target.innerText.toLowerCase()]);
    }

    useEffect( () => {
        setAnswer(question["options"][selectedAnswer]?.text);
    }, [selectedAnswer]);

    const getButtons = () => {
        let buttons = [];
        for (let i = 0 ; i < question["options"].length ; i++)
        {
            buttons.push(<Button variant={i == selectedAnswer ? "contained" : "outlined"} onClick={(e) => onClick(e)}>{question["options"][i].text}</Button>);
        }
        return buttons;            
    }

    return (
        <Container>
            <Typography variant="h2" align="center">
                {question.text}
            </Typography>
            <div align="center">
                <img
                src={question.image}
                width="400"
                />
            </div>
            <div align="center">
                <ButtonGroup aria-label="outlined primary button group">
                    { getButtons() }
                </ButtonGroup>
            </div>
            <Typography align="center">
            {timeRemaining} seconds remaining. <br/>
            Question {questionIndex + 1} / {questions.length}
            </Typography>
        </Container>   
    );
}


export default function Survey() {
    
    const { active, chainId } = useWeb3React();
    
    // This would be replaced by a request to the backend
    const questions = getDailyQuiz()["questions"];

    let answers = [];

    // Component states
    const [running, setRunning ] = useState(false);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState(questions[questionIndex].lifetimeSeconds); 
    const [answerAmount, setAnswerAmount] = useState(0);
    
    const setCurrentAnswer = (answer) => {
        console.log(`setAnswer(${answer}), ${questionIndex}`);
        console.log(answers);
        if (answers[questionIndex] === undefined)
        {
            setAnswerAmount(answerAmount + 1);
        }
        answers[questionIndex] = answer;
        console.log(answers);
    };

    // Timing logic
    const onTimeout = () => {
        if (running)
        {
            if (timeRemaining > 1)
            {
                setTimeRemaining(timeRemaining - 1);
            }
            else
            {
                if (questionIndex < questions.length - 1)
                {
                    console.log('Next question');
                    setQuestionIndex(questionIndex + 1);
                }
                else
                {
                    console.log('Finished quiz!');
                    // setRunning(false);
                    start();
                    console.log('Starting again...');
                }
            }    
        }
    };

    const start = () => {
        if (active && (chainId == ropstenData.chainId))
        {
            setRunning(true);
            setQuestionIndex(0);
        }
    }

    // Initialization
    useEffect(start , []);

    // Automatically update time remaining when changing question index
    useEffect( () => {
        console.log('questionIndex useEffect()');
        if (running)
        {
            let lifetime = questions[questionIndex].lifetimeSeconds;
            setTimeRemaining(lifetime);    
        }
    }, [questionIndex]);

    useInterval(onTimeout, 1000);

    return (
        <Container>
            { active && (chainId == ropstenData.chainId) ?
            Question(questions, questionIndex, timeRemaining, setCurrentAnswer)
            :
            <Link to="/"><Typography>Connect to Metamask and ropsten first</Typography></Link>
            }
            <Typography>Answer amount is {answerAmount}</Typography>
        </Container>

    )
}