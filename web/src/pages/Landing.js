import React from 'react';
import { Link } from 'react-router-dom';
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
import { getQuizContract } from '../store/contractStore';

const tokenName = "QUIZ";

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
        <Typography align="center">
          Connected to wallet: <b>{account}</b>
        </Typography>
        :
        <div align="center">
          <Button
            onClick={connectToWallet}
            variant="outlined"
            align="center"
          >
            Connect to Metamask wallet
          </Button>
        </div>
      }
      { (chainId == ropstenData.chainId) ?
        <Typography align="center">
          Connected to ropsten network
        </Typography>
        :
        ( active ?
          <div align="center">
            <Button onClick={connectToRopsten}>
              Connect to ropsten network
            </Button>
          </div>
          :
          <Typography></Typography>
        )
      }
    </Container>
  );
}

function ShowQuizBalance() {
  
  const [ balance ] = useBalance(TokenListRopsten[tokenName].address, TokenListRopsten[tokenName].decimals);

  return (
    <Container>
      <Typography align="center" gutterBottom>
        Your balance: <b>{balance} {TokenListRopsten[tokenName].symbol}</b>
      </Typography>
    </Container>
  );
}

function ShowSurveyIntro() {

  // const { account, library } = useWeb3React();

  const { active, chainId } = useWeb3React();

  // This would be replaced by a request to the backend
  const quiz = getDailyQuiz();

  const startSurvey = async () => {
    console.log('Start survey!');

    // const contract = getQuizContract(TokenListRopsten[tokenName].address, library, account);
    // var result = await contract.methods.claimQuiz(1).call();
    // console.log(result);
  };

  const isReady = () => {
    return (active && (chainId == ropstenData.chainId));
  }

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
        { isReady() ?
          (<Link to="/survey" style={{ "textDecoration": "none"}}>    
            <Button 
              onClick={startSurvey} 
              variant="contained" 
              color="primary" 
              align="center" 
              type="submit">           
                Start survey! 
            </Button> 
          </Link>)         
          :
          <div></div>
        }
      </Box>

    </Container>
  );
}
 
export default function Landing() {

  return (
    <Container>
      <Typography variant="h2" align="center">
        Welcome to your Daily Survey!
      </Typography>

      { MetamaskConnect() }  
      { ShowQuizBalance() }
      { ShowSurveyIntro() }

    </Container>
  )
}
