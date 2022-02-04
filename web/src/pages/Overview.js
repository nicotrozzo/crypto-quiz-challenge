// React imports
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


// Material UI
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';


function Title() {
    return (
        <Typography align="center" variant="h2">Your answers</Typography>
    );
}

function Answer(props) {
    return (
        <Container align="center">
            <Typography display="inline"><b>{props.questionText}</b></Typography>
            <Typography display="inline">&nbsp;{props.answerText}</Typography>
        </Container>
    );
}

function SubmitSurvey(props) {
    return (
        <Container align="center">
            <Link to="/" style={{ "textDecoration": "none"}}>
                <Button 
                    variant="contained"
                    onClick={props.onSubmit}
                >
                    Submit
                </Button>
            </Link>
        </Container>
    );
}

export default function Overview(props) {

    const answers = [];

    props.answers.forEach( (answer, index) => {
        let answerText = answer >= 0 ? props.questions[index]["options"][answer].text : 'Not answered';
        answers.push(
            <Answer 
                key={index}
                questionText={props.questions[index].text} 
                answerText={answerText}
            />
        );
    });

    return (
        <Container>
            <Title/>
            {answers}
            <SubmitSurvey onSubmit={props.onSubmit}/>
        </Container>
    );
}
