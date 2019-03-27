import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSpring, animated as a } from 'react-spring';

const LIGHT_TEAL = '#b6dbd0';
const YELLOW = '#FFFF65';

const StyledContainer = styled.div`
    display : grid;
    grid-gap: 10px;
    margin : 20px;
    font-family : 'Work Sans', sans-serif;
	font-weight : 300;
    font-size : 18px;
    color : rgb(77, 77, 77);
`;

const StyledHeaderContainer = styled(StyledContainer)`
    grid-template-columns: repeat(4, minmax(20px, 120px));

    > div {
        display: flex;
        justify-content: center;
        padding: 0 8%;

        > * {
            flex : 1 auto;
        }
    }

    div:last-child {
        grid-column : 4 / 5;
    }
`;

const StyledCardsContainer = styled(StyledContainer)`
    opacity : ${props => props.running ? '1' : '.3'}
    grid-template-columns: repeat(4, minmax(20px, 120px));
    height: calc( 100vh - 2 * 40px );
`;

const StyledCardContainer = styled.div`
    position : relative;
    display: flex;
    align-items: center;
    justify-content: center;
    max-height: 150px;
`;

const StyledAlertContainer = styled(StyledCardsContainer)`
    opacity : 1;
    position: absolute;
    top : 50px;
    grid-template-rows: repeat(4, minmax(40px, auto));
`;

const StyledCard = styled(Card)(props => {
    return ({
        backgroundColor: props.color,
        borderRadius : '4px',
        backgroundImage: props.isFront ? 'unset' :
            `repeating-linear-gradient(120deg, rgba(255,255,255,.1), rgba(255,255,255,.1) 1px, transparent 1px, transparent 60px),
            repeating-linear-gradient(60deg, rgba(255,255,255,.1), rgba(255,255,255,.1) 1px, transparent 1px, transparent 60px),
            linear-gradient(60deg, rgba(0,0,0,.1) 25%, transparent 25%, transparent 75%, rgba(0,0,0,.1) 75%, rgba(0,0,0,.1)),
            linear-gradient(120deg, rgba(0,0,0,.1) 25%, transparent 25%, transparent 75%, rgba(0,0,0,.1) 75%, rgba(0,0,0,.1))`,
        backgroundSize: '70px 120px',
        position: 'absolute',
        cursor: 'pointer',
        willChange: 'transform, opacity',
        // maxWidth : '100px',
        // maxHeight : '100px',
        // flex: '1 90%',
        // minWidth : '60px',
        width : '84%',
        height: '90%'
})});

const StyledAlert = styled.div`
    grid-column : 2 / 4;
    grid-row : 2 / 4;
    display: flex;
    justify-content: center;
`;

const StyledWrap = styled.div`
    background-color : ${YELLOW};
    box-shadow : 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
    border-radius: 4px;
    width: 300px;
    height: 80px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    user-select : none;
`;

const StyledButton = styled(Button)`
    display : flex;
    border: 1px solid rgb(77, 77, 77);
    padding: 4px 12px;
    border-radius: 4px;
    background-color : rgb(127, 177, 179);
    cursor : pointer;
    cursor : hand;
    font-family : 'Work Sans', sans-serif;
	font-weight : 300;
    font-size : 18px;
    color : rgb(77, 77, 77);

    :hover {
        background-color : rgb(174, 206, 208);
    }

    :focus {
        outline : none;
    }

    :active {
        background-color: rgb(95, 158, 160);
        outline: none;
    }

    > div {
        text-align: center;
        width: 100%;
    }
`;

const HSVtoRGB = ( h, s, v ) => {
   
    var r, g, b, i, f, p, q, t;
    
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v; g = t; b = p; break;
        case 1: r = q; g = v; b = p; break;
        case 2: r = p; g = v; b = t; break;
        case 3: r = p; g = q; b = v; break;
        case 4: r = t; g = p; b = v; break;
        case 5: r = v; g = p; b = q; break;
        default: r = 0; g = 0; b = 0; break;
    }
    const result = `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
    return result;
}

function Button({className, callback, title}) {
    return (
        <button className={className} onClick={() => callback()}>
            <div>
                {title}
            </div>
        </button>
    )
}

function Card({opacity, transform, className, isFront}) {
    return <a.div 
        className={className} 
        style = {
            isFront ? { opacity, transform: transform.interpolate(t => `${t} rotateX(180deg)`)}
                    : { opacity: opacity.interpolate(o => 1 - o), transform }
        }
    />
}

function AnimatedCard({isOpen, color, callback}) {
    const { transform, opacity } = useSpring({
        opacity: isOpen ? 1 : 0,
        transform: `perspective(600px) rotateX(${isOpen ? 180 : 0}deg)`,
        config: { mass: 5, tension: 500, friction: 80 }
    })
    return (
        <StyledCardContainer onClick={() => callback()}>
            <StyledCard isFront={false} color={LIGHT_TEAL} opacity={opacity} transform={transform}/>
            <StyledCard isFront={true} color={color} opacity={opacity} transform={transform}/>
        </StyledCardContainer>
    )
}

function Alert({callback, alertTitle, round}) {
    return (
        <StyledAlertContainer>
            <StyledAlert>
                <StyledWrap>
                    { alertTitle ? <div>{alertTitle}</div> : null }
                    <StyledButton callback={callback} title={round ? 'Play Again' : 'Start'}/>
                </StyledWrap>
            </StyledAlert>
        </StyledAlertContainer>
    )
}

const PENALTY = 5;
const BONUS = 20;
const MIN = 2;
const SEC = 0;
const TOTAL_TIME = MIN * 60 + SEC;
const FRESH_TIME = `${MIN < 10 ? `0${MIN}` : MIN}:${SEC < 10 ? `0${SEC}` : SEC}`;

const Flipcards = () => {
    const [cards, setCards] = useState([]);
    const [canFlip, setFlip] = useState(true);
    const [running, setRunning] = useState(false);
    const [alertTitle, setAlertTitle ] = useState('Match cards by color.');
    const [round, setRound] = useState(0);
    const [score, setScore] = useState(0);
    const [isMatchKnown, setMatchKnown] = useState(false);

    // stopwatch
    const [timer, setTimer] = useState(TOTAL_TIME);
    const [timeStr, setTimeStr] = useState(FRESH_TIME);

    // only runs at initial render
    useEffect(() => {
        refresh();
    },[]);

    useEffect(() => {
        let interval;

        if (running) {
            interval = setInterval(
                () => {
                    setTimer(timer - 1);
                    calcShowTime(timer - 1);
                },
                1000,
            );
        }
      
        return () => clearInterval(interval);
    }, [running, timer]);

    useEffect(() => {        
        const totalOpenCards = cards.filter(card => card.isOpen);  
        const pendingCards = cards.filter(card => card.isOpen && card.isExposed);
        if(totalOpenCards.length === cards.length && cards.length !== 0) {
            setScore(score + BONUS + timer);
            setRound(round + 1);
            setAlertTitle(`Final score: ${score + BONUS + timer} (bonus ${timer})`);
            setTimeout( () => setRunning(false), 500 );
            return;
        }

        if(pendingCards.length === 2) {
            setFlip(false);
        } else if(pendingCards.length === 1) {
            findKnownMatches(pendingCards[0]);
        }

        
    }, [cards]);

    useEffect(() => {
        if(!canFlip) {
            // close unmatched cards
            const currentPair = cards.filter(card => card.isOpen && card.isExposed);
            
            if(currentPair.length === 2 && currentPair[0].color === currentPair[1].color) {
                // if two cards are open and have matching color
                // we can allow for the next pair to be opened
                // and set their isExposed property to false
                const updatedCards = cards.map(card => {
                    if(card.isOpen && card.isExposed) {
                        return { ...card, isExposed: false }
                    }

                    return card;
                });
                setScore(score + BONUS);

                setCards(updatedCards);
            } else {
                // close unmatching cards
                const updatedCards = cards.map(card => {
                    if(card.isOpen && card.isExposed) {
                        return { ...card, isOpen: false }
                    }

                    return card;
                });

                if(isMatchKnown) setScore(score - PENALTY);
                setTimeout(() => setCards(updatedCards), 500);
            }

            setFlip(true);
        }
        
    }, [canFlip, isMatchKnown]);

    const findKnownMatches = (pendingCard) => {
        // check if there was a card with the same color 
        // that's been exposed but is currently closed
        if(pendingCard) {
            const matchingCard = cards.find(card => {
                return !card.isOpen && card.isExposed && card.color === pendingCard.color;
            });

            setMatchKnown(matchingCard ? true : false);
        }
    };

    const calcShowTime = (updatedTimer) => {
        let minutes = Math.floor(updatedTimer / 60);
        let seconds = Math.floor(updatedTimer % 60);
        minutes = (minutes < 10) ? `0${minutes}` : minutes;
        seconds = (seconds < 10) ? `0${seconds}` : seconds;
        setTimeStr(`${minutes}:${seconds}`);
    };

    const startTimer = () => {
        setTimer(TOTAL_TIME);
        setTimeStr(FRESH_TIME);
        setRunning(true); 
    };

    const refresh = () => {
        let result = [];
        const goldenRatio = 0.618033988749895;
        let h = Math.floor((Math.random() * 100) + 1);

        for(var i = 0; i < 8; i++) {
            h += goldenRatio;
            h = h % 1;
            result.push({color: HSVtoRGB(h, 0.5, 0.95), isOpen: false, isExposed: false}, {color: HSVtoRGB(h, 0.5, 0.95), isOpen: false, isExposed: false});
        } 
        result.sort(() => 0.5 - Math.random());

        setCards(result);
        setScore(0);
    };

    const updateCards = (index) => {
        // don't allow closing card if it's been opened
        if(canFlip && cards[index] && !cards[index].isOpen) {
            const updatedCards = cards.map( (card, i) => {
                return i === index ? { ...card, isOpen: !card.isOpen, isExposed: true } : card;
            } );
            
            setCards(updatedCards);
        }
    }

    const restart = () => {
        setCards(cards.map(card => ({...card, isOpen: false})));
        setTimeout(() => {
            refresh();
            startTimer();
        }, 500);
    };

    return (
        <div>
            <StyledHeaderContainer>
                <div>
                    <div>{timeStr}</div>
                </div>
                <div>
                    <div>Score: {score}</div>
                </div>
                <div>    
                    <StyledButton callback={restart} title={'Restart'}/>
                </div>
            </StyledHeaderContainer>
            <StyledCardsContainer running={running}>
                {cards.map((card, index) => {
                    return (
                        <AnimatedCard
                            key = {index}
                            callback = {() => updateCards(index)}
                            color   = {card.color}
                            isOpen  = {card.isOpen}
                        />
                    )
                })}
            </StyledCardsContainer>
            {!running ? <Alert callback={restart} alertTitle={alertTitle} round={round}/> : null}
        </div>
    )
}

export default Flipcards;