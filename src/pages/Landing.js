import React from 'react';
import { useState } from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';

export default function Landing() {

  const [credentials, setCredentials] = useState('');

  return (
    <Container>
      <Typography variant="h2" align="center">
        Welcome to your Daily Crypto Survey
      </Typography>

      <Typography variant="body1" gutterBottom>
        Connect your Metamask wallet:
      </Typography>
      <TextField 
        onChange={(e) => setCredentials(e.target.value)}
        label="Credentials"
        variant="outlined"
      />      

      <div style={{display:"flex"}}>
        <Typography variant="body1" gutterBottom>
          Your $QUIZ balance:
        </Typography>
        <Typography variant="body1" color="secondary" gutterBottom>
          $0
        </Typography>
      </div>

      <Typography variant="h3" align="center">
        Today's survey
      </Typography>
      <Typography variant="h3" align="center">
          Music
      </Typography>

      <Box textAlign="center">

        <Button 
          onClick={() => console.log('Start quiz!')} 
          variant="contained" 
          color="primary" 
          align="center" 
          type="submit">
          Start quiz!
        </Button>
      </Box>
    </Container>
  )
}
