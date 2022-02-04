// React imports
import React, { useState, useEffect } from 'react';

// Material UI
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { ButtonGroup } from '@mui/material';

function QuestionText(props) {
    return (
        <Typography variant="h2" align="center">
            {props.text}
        </Typography>
    );
}

function QuestionPicture(props) {
    return (
    <div align="center">
        <img
        src={props.image}
        width="400"
        />
    </div>
    );
}

function Timer(props) {
    return (
        <Typography align="center">
            {props.timeRemaining}'' remaining
        </Typography>
    );
}

function QuestionCounter(props) {
    return (
        <Typography align="center">
            Question {props.current} out of {props.total}<br/>
        </Typography>
    );
}

function Option(props) {

    const handleClick = (e) => {
        props.onClick(e.target.innerText);
    }

    return (
        <Button 
            variant={props.variant}
            onClick={(e) => handleClick(e)}
        >
            {props.text}
        </Button>
    );
}

function OptionGroup(props) {

    const options = [];

    props.options.forEach( (option, index) => {
        options.push(
            <Option 
                variant={props.selected == index ? "contained" : "outlined"}
                text={option.text} 
                onClick={props.handleSelected} 
                key={option.text}
            />
        );
    });

    return(
        <div align="center">
            <ButtonGroup aria-label="primary button group">
                {options}
            </ButtonGroup>
        </div>
    );
}

export default function Question(props) {

    let question = props.questions[props.index];

    return (
        <Container>
            <QuestionText text={question.text}/>
            <QuestionPicture image={question.image}/>
            <OptionGroup 
                options={question["options"]} 
                handleSelected={props.handleSelected}
                selected={props.selected}
            />
            <QuestionCounter current={props.index + 1} total={props.questions.length}/>
            <Timer timeRemaining={props.timeRemaining}/>
        </Container>
    );
}