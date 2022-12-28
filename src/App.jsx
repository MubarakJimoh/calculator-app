import React from 'react';
import { useReducer } from 'react';
import DigitButton from './Digitbutton';
import OperationButton from './OperationButton';
import './App.css';

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_MATH_OPERATION: 'choose-math-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EQUAL: 'equal'
}

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentResult: payload.digit,
          overwrite: false,
        }
      }
      if (payload.digit === "0" && state.currentResult === "0") {
        return state;
      }

      if (payload.digit === "." && state.currentResult.includes(".")) {
        return state;
      }

      return {
        ...state,
        currentResult: `${state.currentResult || ""}${payload.digit}`,
      }

    case ACTIONS.CHOOSE_MATH_OPERATION:
      if (state.currentResult == null && state.prevResult == null) {
        return state
      }

      if (state.currentResult == null) {
        return {
          ...state,
          operation: payload.operation
        }
      }

      if (state.prevResult == null) {
        return {
          ...state,
          operation: payload.operation,
          prevResult: state.currentResult,
          currentResult: null
        }
      }

      return {
        ...state,
        prevResult: equal(state),
        operation: payload.operation,
        currentResult: null
      }

    case ACTIONS.CLEAR:
      return {}

    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentResult: null,
        }
      }

      if (state.currentResult == null) return state
      if (state.currentResult.length === 1) {
        return {
          ...state,
          currentResult: null
        }
      }

      return {
        ...state,
        currentResult: state.currentResult.slice(0, -1)
      }

    case ACTIONS.EQUAL:
      if (state.operation == null || state.currentResult == null || state.prevResult == null) {
        return state
      }
      return {
        ...state,
        prevResult: null,
        operation: null,
        currentResult: equal(state),
        overwrite: true,
      }
  }
}

const equal = ({ prevResult, currentResult, operation }) => {
  const prev = parseFloat(prevResult);
  const current = parseFloat(currentResult);

  if (isNaN(prev) || isNaN(current)) return ""
  let computation = ""
  switch (operation) {
    case "+":
      computation = prev + current
      break
    case "-":
      computation = prev - current
      break
    case "*":
      computation = prev * current
      break
    case "÷":
      computation = prev / current
      break
  }

  return computation.toString()
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maxximumFractionDigits: 0,
})

function formatResult(result) {
  if (result == null) return
  const [interger, decimal] = result.split('.')
  if (decimal == null) return INTEGER_FORMATTER.format(interger)
  return `${INTEGER_FORMATTER.format(interger)}.${decimal}`
}


export default function App() {
  const [{ prevResult, currentResult, operation }, dispatch] = useReducer(reducer, {});

  return (
    <div className='container'>
      <div className='result'>
        <div className="prev-result">{formatResult(prevResult)} {operation}</div>
        <div className="current-result">{formatResult(currentResult)}</div>
      </div>

      <button className="row-2" onClick={() => dispatch({ type: ACTIONS.CLEAR })}>AC</button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>
      <OperationButton operation="÷" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button className="row-2" onClick={() => dispatch({ type: ACTIONS.EQUAL })}>=</button>
    </div>
  )
}
