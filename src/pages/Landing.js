import React from 'react';
import { useState } from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import getDailyQuiz from './quizes/Quiz';
import { injected } from '../components/connectors';
import { useWeb3React } from '@web3-react/core';
import web3 from 'web3';
import TokenListRopsten from '../assets/token_list_ropsten.json';
import useBalance from '../actions/useBalance';
import ropstenData from '../assets/ropsten-testnet-data.json';

function MetamaskConnect() {

  const { active, account, chainId, connector, activate } = useWeb3React();

  const connectToWallet = async () => {
    console.log('Connect to wallet!');
    try {
      await activate(injected);
    } catch (e) {
      console.log(e);
    }
  };

  const connectToRopsten = async () => {
    console.log(`Current network: ${chainId}`);
    try {
      await web3.givenProvider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: ropstenData.chainId }]
      });
    } catch (error) {
      alert(error.message);
    }
  };


  return (
    <Container>
      { active ?
        <Typography>
          Connected to wallet: <b>{account}</b>.
        </Typography>
        :
        <Button
          onClick={connectToWallet}
          variant="outlined"
        >
          Connect to Metamask wallet
        </Button>
      }
      { (chainId == ropstenData.chainId) ?
        <Typography>
          Connected to ropsten
        </Typography>
        :
        ( active ?
        <Button onClick={connectToRopsten}>
          Connect to ropsten
        </Button>
        :
        <Typography></Typography>
        )
      }
    </Container>
  );
}

function ShowQuizBalance() {
  
  const [ balance ] = useBalance(TokenListRopsten[0].address, TokenListRopsten[0].decimals);

  return (
    <Container>
      <div style={{display:"flex"}}>
        <Typography variant="body1" gutterBottom>
          Your balance:
        </Typography>
        <Typography variant="body1" gutterBottom>
          &nbsp;{balance} QUIZ
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
          onClick={startSurvey} 
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
        Welcome to your Daily Survey
      </Typography>

      { MetamaskConnect() }  
      { ShowQuizBalance() }
      { showSurveyIntro() }

    </Container>
  )
}
