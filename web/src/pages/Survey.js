// React imports
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Custom react hooks
import { useInterval } from '../actions/useInterval';

// Material UI
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

// Web3 imports
import { useWeb3React } from '@web3-react/core'; // use web3 to check user is connected
import ropstenData from '../assets/ropsten-testnet-data.json';

// Custom code
import getDailyQuiz from './quizes/Quiz';

import Question from './Question';
import Overview from './Overview';

export default function Survey() {

    const { active, chainId } = useWeb3React();

    // This would be replaced by a request to the backend
    const questions = getDailyQuiz()["questions"];

    const [questionIndex, setQuestionIndex] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState(-1);
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [answers, setAnswers] = useState([]);
    const [finished, setFinished] = useState(false);

    // Timing logic
    const onTimeout = () => {
        if (timeRemaining > 0)
        {
            setTimeRemaining(timeRemaining - 1);
        }
    };

    useInterval(onTimeout, 1000);

    useEffect(() => {
        setQuestionIndex(0);
    }, []);

    useEffect( () => {
        setTimeRemaining(questions[questionIndex].lifetimeSeconds);
        setSelectedAnswer(-1);
        if (questionIndex == 0)
        {
            setAnswers([]);
            setFinished(false);
        }
    }, [questionIndex]);

    useEffect( () => {
        if (timeRemaining == 0)
        {
            if (questionIndex <= questions.length - 1)
            {
                setAnswers([...answers, selectedAnswer]);
                if (questionIndex < questions.length - 1)
                {
                    setQuestionIndex(questionIndex + 1);
                }
                else
                {
                    setFinished(true);
                }
            }
        }    
    }, [timeRemaining]);

    // useEffect( () => {
    //     console.log(`Updated answers: ${answers}`);
    //     console.log(`Answered ${answers.length} questions so far`);
    // }, [answers]);

    useEffect( () => {
        if (finished)
        {
            console.log('Finished quiz!');
            console.log(`Answered ${answers.length} questions`);    
        }
    }, [finished]);

    const handleSelectedAnswer = (questionIndex, answerText) => {
        const answerIndex = questions[questionIndex]["options"].findIndex((option) => {
            return (option.text.toLowerCase() == answerText.toLowerCase());
        });
        setSelectedAnswer(answerIndex);
    };

    const submitAnswers = () => {
        console.log('Claim $QUIZ!');
        console.log('Back to main page');
    };

    return (
        <Container>
            {(active && (chainId == ropstenData.chainId)) || true?
                ((finished == false) ?
                    <Question 
                        questions={questions} 
                        index={questionIndex}
                        timeRemaining={timeRemaining}
                        selected={selectedAnswer}
                        handleSelected={handleSelectedAnswer.bind(undefined, questionIndex)}
                    /> 
                    :
                    <Overview 
                        answers={answers} 
                        questions={questions}
                        onSubmit={submitAnswers}
                    />
                )
                :
                <Link to="/"><Typography>Connect to Metamask and ropsten first</Typography></Link>
            }
        </Container>
    );
}