import React from 'react';
import { useState } from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import getDailyQuiz from './quizes/Quiz';

const connectToWallet = () => {
  console.log('Connect to wallet!')
};


function MetamaskConnect() {

  const [credentials, setCredentials] = useState('');

  return (
    <Container>
      <Typography variant="body1" gutterBottom>
        Metamask wallet:
      </Typography>
      <TextField 
        onChange={(e) => setCredentials(e.target.value)}
        label="Wallet"
        variant="outlined"
      />
      <Button
        onClick={() => connectToWallet()}
        variant="outlined"
      >
        Connect to wallet
      </Button>       
    </Container>
  );
}

function showQuizBalance() {
  
  return (
    <Container>
      <div style={{display:"flex"}}>
        <Typography variant="body1" gutterBottom>
          Your $QUIZ balance:
        </Typography>
        <Typography variant="body1" color="secondary" gutterBottom>
          $0
        </Typography>
      </div>
    </Container>
  );
}

function showSurveyIntro() {

  // This would be replaced by a request to the backend
  const quiz = getDailyQuiz();

  const startSurvey = () => {
    console.log('Start survey!');
  };

  return (
    <Container>
      <Typography variant="h3" align="center">
        Today's survey
      </Typography>
      <Typography variant="h3" align="center">
          {quiz.title}
      </Typography>
      <div align="center">
        <img
          src={quiz.image}
          width="400"
        />
      </div>
      
      <Box textAlign="center">
        <Button 
          onClick={() => startSurvey()} 
          variant="contained" 
          color="primary" 
          align="center" 
          type="submit">
          Start survey!
        </Button>
      </Box>

    </Container>
  );
}
 
export default function Landing() {

  return (
    <Container>
      <Typography variant="h2" align="center">
        Welcome to your Daily Crypto Survey
      </Typography>

      { MetamaskConnect() }  
      { showQuizBalance() }
      { showSurveyIntro() }

    </Container>
  )
}
