// React imports
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Custom react hooks
import { useInterval } from '../actions/useInterval';

// Material UI
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

// Web3 imports
import { useWeb3React } from '@web3-react/core'; // use web3 to check user is connected
import ropstenData from '../assets/ropsten-testnet-data.json';
import TokenListRopsten from '../assets/token_list_ropsten.json';

// Custom contract
import { getQuizContract } from '../store/contractStore';

// Custom code
import getDailyQuiz from './quizes/Quiz';

import Question from './Question';
import Overview from './Overview';

const tokenName = "QUIZ";

export default function Survey() {

    const { active, chainId, library, account } = useWeb3React();

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

    useEffect( () => {
        if (finished)
        {
            console.log('Finished quiz!');
        }
    }, [finished]);

    const handleSelectedAnswer = (questionIndex, answerText) => {
        const answerIndex = questions[questionIndex]["options"].findIndex((option) => {
            return (option.text.toLowerCase() == answerText.toLowerCase());
        });
        setSelectedAnswer(answerIndex);
    };

    const submitAnswers = async () => {
        const contract = getQuizContract(TokenListRopsten[tokenName].address, library, account);
        const amountAnswered = answers.reduce( (prev, curr) => {
            return prev + (curr >= 0 ? 1 : 0); 
        }, 0);
        var result = await contract.methods.claimQuiz(amountAnswered).send();
    };

    return (
        <Container>
            {(active && (chainId == ropstenData.chainId)) ?
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