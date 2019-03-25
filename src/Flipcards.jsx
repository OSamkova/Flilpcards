import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSpring, animated as a } from 'react-spring';

const LIGHT_TEAL = '#b6dbd0';
const YELLOW = '#FFFF65';

const StyledCardsContainer = styled.div`
    opacity : ${props => props.completed ? '.3' : '1'}
    display : grid;
    grid-template-columns: repeat(4, minmax(40px, 160px));
    grid-gap: 10px;
    margin : 40px;
    height: calc( 100vh - 2 * 40px );
`;

const StyledCardContainer = styled.div`
    position : relative;
    display: flex;
    align-items: center;
    justify-content: center;

    &::before {
        content: "";
        display: inline-block;
        width: 1px;
        height: 0;
        padding-bottom : calc(100% / 3);
    }
`;

const StyledAlertContainer = styled(StyledCardsContainer)`
    opacity : 1;
    position: absolute;
    top : 0;
    grid-template-rows: repeat(4,minmax(40px, auto));
    color : rgb(77, 77, 77);
	font-family : 'Work Sans', sans-serif;
	font-weight : 300;
    font-size : 18px;
`;

const StyledCard = styled(Card)(props => {
    return ({
        backgroundColor: props.color,
        borderRadius : '4px',
        padding : '4px',
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
        width : '60%',
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
    width: 200px;
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

    :hover {
        background-color : rgb(174, 206, 208);
    }

    :active {
        background-color: rgb(95, 158, 160);
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

function Button({className, callback}) {
    return (
        <a className={className} onClick={() => callback()}>
            <div>
                Restart
            </div>
        </a>
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

function Alert({callback}) {
    return (
        <StyledAlertContainer>
            <StyledAlert>
                <StyledWrap>
                    <div>You won!</div>
                    <StyledButton callback={callback}/>
                </StyledWrap>
            </StyledAlert>
        </StyledAlertContainer>
    )
}

const Flipcards = () => {
    const [cards, setCards] = useState([]);
    const [canFlip, setFlip] = useState(true);
    const [completed, setCompleted] = useState(false);

    const refresh = () => {
        let result = [];
        const goldenRatio = 0.618033988749895;
        let h = Math.floor((Math.random() * 100) + 1);

        for(var i = 0; i < 8; i++) {
            h += goldenRatio;
            h = h % 1;
            result.push({color: HSVtoRGB(h, 0.5, 0.95), isOpen: false}, {color: HSVtoRGB(h, 0.5, 0.95), isOpen: false});
        } 
        result.sort(() => 0.5 - Math.random());

        setCards(result);
    }

    useEffect(() => {
        refresh();
    },[]);

    const closeUnmatchedCards = (updatedCards) => {
        const result = updatedCards.map((card, i) => {
            if(card.isOpen) {
                const pair = updatedCards.filter(c => card.color === c.color && c.isOpen);
                if( pair.length % 2 !== 0 ) {
                    return {...card, isOpen: !card.isOpen}
                }
            }
    
            return card;
        });
        setFlip(true);
        setCards(result);
    };

    const updateCards = (index) => {
        if(canFlip) {
            const updatedCards = cards.map( (card, i) => {
                return i === index ? { ...card, isOpen: !card.isOpen } : card;
            } )
            const openCards = updatedCards.filter(card => card.isOpen);
            setCards(updatedCards);
    
            if(openCards.length % 2 === 0 && openCards.length < cards.length) {
                setFlip(false);
                setTimeout(() => closeUnmatchedCards(updatedCards), 700);
            } else if(openCards.length === cards.length) {
                setTimeout( () => setCompleted(true), 800 );
            }
        }
    };

    const restart = () => {
        setCompleted(false);
        refresh();
    }

    return (
        <div>
            <StyledCardsContainer completed={completed}>
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
            {completed ? <Alert callback={restart}/> : null}
        </div>
    )
}

export default Flipcards;