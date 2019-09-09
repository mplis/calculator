import React from 'react';

const OPERATORS = {
    DIV: 'div',
    MULT: 'mult',
    ADD: 'add',
    SUB: 'sub'
};

function Item(props) {
    return <button {...props} />;
}

function computeValue(leftOperand, rightOperand, operator) {
    switch (operator) {
        case OPERATORS.ADD: {
            return leftOperand + rightOperand;
        }
        case OPERATORS.SUB: {
            return leftOperand - rightOperand;
        }
        case OPERATORS.MULT: {
            return leftOperand * rightOperand;
        }
        case OPERATORS.DIV: {
            return leftOperand / rightOperand;
        }
        default:
            break;
    }
}

// const initialState = {
//     operator: null,
//     currentOperand: 0,
//     previousOperand: null,
//     waitingForOperand: true
// };
//
// function calculatorReducer(state, action) {
//     switch (action.type) {
//         case 'SELECT_DIGIT': {
//             const { currentOperand } = state;
//             const operandAsString = currentOperand ? currentOperand.toString() : '';
//             return {
//                 ...state,
//                 currentOperand: Number(operandAsString + action.digit)
//             };
//         }
//         case 'SET_OPERAND': {
//             return {
//                 ...state,
//                 currentOperand: action.value
//             };
//         }
//         case 'SELECT_OPERATOR': {
//             const { currentOperand, previousOperand, operator } = state;
//             return {
//                 ...state,
//                 operator: action.operator,
//                 currentOperand: previousOperand
//                     ? computeValue(previousOperand, currentOperand, operator)
//                     : null,
//                 previousOperand: currentOperand
//             };
//         }
//         case 'COMPUTE_VALUE': {
//             const { currentOperand, previousOperand, operator } = state;
//             return {
//                 ...state,
//                 currentOperand: computeValue(previousOperand, currentOperand, operator),
//                 previousOperand: null
//             };
//         }
//         case 'CLEAR_DIGIT': {
//             const operandAsString = state.currentOperand ? state.currentOperand.toString() : '';
//             return {
//                 ...state,
//                 currentOperand: Number(operandAsString.slice(0, operandAsString.length - 1))
//             };
//         }
//         case 'CLEAR_ALL': {
//             return initialState;
//         }
//         default:
//             break;
//     }
// }

const initialState = {
    operator: null,
    value: null,
    displayValue: '0',
    waitingForOperand: true
};

function calculatorReducer(state, action) {
    switch (action.type) {
        case 'SELECT_DIGIT': {
            const { displayValue, waitingForOperand } = state;
            if (waitingForOperand) {
                return {
                    ...state,
                    displayValue: Number(action.digit).toString(),
                    waitingForOperand: false
                };
            }
            return {
                ...state,
                displayValue: Number(displayValue + action.digit).toString()
            };
        }
        case 'SET_OPERAND': {
            return {
                ...state,
                displayValue: action.value
            };
        }
        case 'SELECT_OPERATOR': {
            const { value, displayValue, operator, waitingForOperand } = state;
            if (waitingForOperand) {
                return {
                    ...state,
                    operator: action.operator
                };
            }
            if (value === null) {
                return {
                    ...state,
                    operator: action.operator,
                    value: Number(displayValue),
                    waitingForOperand: true
                };
            }
            const newValue = computeValue(value, Number(displayValue), operator);
            return {
                ...state,
                operator: action.operator,
                value: newValue,
                displayValue: newValue.toString(),
                waitingForOperand: true
            };
        }
        case 'COMPUTE_VALUE': {
            const { value, displayValue, operator } = state;
            const newValue = computeValue(value, Number(displayValue), operator);
            return {
                ...state,
                value: newValue,
                displayValue: newValue.toString(),
                waitingForOperand: true
            };
        }
        case 'CLEAR_DIGIT': {
            const { displayValue } = state;
            return {
                ...state,
                displayValue: displayValue.slice(0, displayValue.length - 1)
            };
        }
        case 'CLEAR_ALL': {
            return initialState;
        }
        default:
            break;
    }
}

function App() {
    const [state, dispatch] = React.useReducer(calculatorReducer, initialState);

    const { displayValue } = state;

    return (
        <div>
            <input
                value={displayValue}
                onChange={e => {
                    const value = Number(e.target.value);
                    if (value) {
                        dispatch({ type: 'SET_OPERAND', value });
                    }
                }}
            />
            <div style={{ display: 'flex' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
                    <Item onClick={() => dispatch({ type: 'SELECT_DIGIT', digit: '7' })}>7</Item>
                    <Item onClick={() => dispatch({ type: 'SELECT_DIGIT', digit: '8' })}>8</Item>
                    <Item onClick={() => dispatch({ type: 'SELECT_DIGIT', digit: '9' })}>9</Item>
                    <Item onClick={() => dispatch({ type: 'SELECT_DIGIT', digit: '4' })}>4</Item>
                    <Item onClick={() => dispatch({ type: 'SELECT_DIGIT', digit: '5' })}>5</Item>
                    <Item onClick={() => dispatch({ type: 'SELECT_DIGIT', digit: '6' })}>6</Item>
                    <Item onClick={() => dispatch({ type: 'SELECT_DIGIT', digit: '1' })}>1</Item>
                    <Item onClick={() => dispatch({ type: 'SELECT_DIGIT', digit: '2' })}>2</Item>
                    <Item onClick={() => dispatch({ type: 'SELECT_DIGIT', digit: '3' })}>3</Item>
                    <Item onClick={() => dispatch({ type: 'SELECT_DIGIT', digit: '0' })}>0</Item>
                    <Item>.</Item>
                    <Item onClick={() => dispatch({ type: 'COMPUTE_VALUE' })}>=</Item>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Item onClick={() => dispatch({ type: 'CLEAR_DIGIT' })}>C</Item>
                    <Item onClick={() => dispatch({ type: 'CLEAR_ALL' })}>AC</Item>
                    <Item
                        onClick={() =>
                            dispatch({ type: 'SELECT_OPERATOR', operator: OPERATORS.DIV })
                        }
                    >
                        /
                    </Item>
                    <Item
                        onClick={() =>
                            dispatch({ type: 'SELECT_OPERATOR', operator: OPERATORS.MULT })
                        }
                    >
                        x
                    </Item>
                    <Item
                        onClick={() =>
                            dispatch({ type: 'SELECT_OPERATOR', operator: OPERATORS.SUB })
                        }
                    >
                        -
                    </Item>
                    <Item
                        onClick={() =>
                            dispatch({ type: 'SELECT_OPERATOR', operator: OPERATORS.ADD })
                        }
                    >
                        +
                    </Item>
                </div>
            </div>
        </div>
    );
}

export default App;
