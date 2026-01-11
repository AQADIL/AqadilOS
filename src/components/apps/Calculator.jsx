import React, { useState } from 'react';
import { Calculator as CalcIcon, Delete, Menu, RotateCcw } from 'lucide-react';

export default function Calculator() {
  const [current, setCurrent] = useState('0');
  const [previous, setPrevious] = useState('');
  const [operation, setOperation] = useState(null);
  const [overwrite, setOverwrite] = useState(false);


  const formatOperand = (operand) => {
    if (operand === 'Error') return 'Error';
    if (!operand) return '0';
    const [integer, decimal] = operand.split('.');
    if (decimal == null) {
      return new Intl.NumberFormat('en-US').format(integer);
    }
    return `${new Intl.NumberFormat('en-US').format(integer)}.${decimal}`;
  };


  const clear = () => {
    setCurrent('0');
    setPrevious('');
    setOperation(null);
    setOverwrite(false);
  };

  const deleteNumber = () => {
    if (overwrite) {
      setCurrent('0');
      setOverwrite(false);
      return;
    }
    if (current.length === 1) {
      setCurrent('0');
    } else {
      setCurrent(current.slice(0, -1));
    }
  };


  const appendNumber = (number) => {
    if (current.length > 15 && !overwrite) return;
    if (number === '.' && current.includes('.')) return;

    if (overwrite) {
      setCurrent(number);
      setOverwrite(false);
    } else {
      setCurrent(current === '0' && number !== '.' ? number : current + number);
    }
  };


  const chooseOperation = (op) => {
    if (current === '') return;
    if (previous !== '') {
      const result = calculate(previous, current, operation);
      setPrevious(String(result));
      setCurrent(String(result));
    } else {
      setPrevious(current);
    }
    setOperation(op);
    setOverwrite(true);
  };


  const singleOperation = (op) => {
    const num = parseFloat(current);
    let result;
    if (isNaN(num)) return;

    switch (op) {
      case 'x²': result = num * num; break;
      case '√x': result = Math.sqrt(num); break;
      case '1/x': result = 1 / num; break;
      case '%': result = num / 100; break;
      case '+/-': result = num * -1; break;
      default: return;
    }
    setCurrent(String(result));
    setOverwrite(true);
  };


  const calculate = (a, b, op) => {
    const prev = parseFloat(a);
    const curr = parseFloat(b);
    if (isNaN(prev) || isNaN(curr)) return '';
    
    let computation = 0;
    switch (op) {
      case '+': computation = prev + curr; break;
      case '-': computation = prev - curr; break;
      case '×': computation = prev * curr; break;
      case '÷': computation = prev / curr; break;
      default: return curr;
    }
    return computation;
  };

  const equals = () => {
    if (!operation || !previous) return;
    const result = calculate(previous, current, operation);
    setCurrent(String(result));
    setPrevious('');
    setOperation(null);
    setOverwrite(true);
  };


  const buttons = [
    { label: '%', action: () => singleOperation('%'), type: 'sec' },
    { label: 'CE', action: () => setCurrent('0'), type: 'sec' },
    { label: 'C', action: clear, type: 'sec' },
    { label: <Delete size={18}/>, action: deleteNumber, type: 'sec' },
    
    { label: '1/x', action: () => singleOperation('1/x'), type: 'sec' },
    { label: 'x²', action: () => singleOperation('x²'), type: 'sec' },
    { label: '√x', action: () => singleOperation('√x'), type: 'sec' },
    { label: '÷', action: () => chooseOperation('÷'), type: 'sec' },

    { label: '7', action: () => appendNumber('7'), type: 'num' },
    { label: '8', action: () => appendNumber('8'), type: 'num' },
    { label: '9', action: () => appendNumber('9'), type: 'num' },
    { label: '×', action: () => chooseOperation('×'), type: 'sec' },

    { label: '4', action: () => appendNumber('4'), type: 'num' },
    { label: '5', action: () => appendNumber('5'), type: 'num' },
    { label: '6', action: () => appendNumber('6'), type: 'num' },
    { label: '-', action: () => chooseOperation('-'), type: 'sec' },

    { label: '1', action: () => appendNumber('1'), type: 'num' },
    { label: '2', action: () => appendNumber('2'), type: 'num' },
    { label: '3', action: () => appendNumber('3'), type: 'num' },
    { label: '+', action: () => chooseOperation('+'), type: 'sec' },

    { label: '+/-', action: () => singleOperation('+/-'), type: 'num' },
    { label: '0', action: () => appendNumber('0'), type: 'num' },
    { label: '.', action: () => appendNumber('.'), type: 'num' },
    { label: '=', action: equals, type: 'accent' },
  ];


  const getFontSize = () => {
    if (current.length > 12) return 'text-3xl';
    if (current.length > 9) return 'text-4xl';
    return 'text-5xl';
  };

  return (
    <div className="flex flex-col h-full bg-[#202020] text-white select-none">
      
      {}
      <div className="flex items-center gap-4 px-4 pt-2 pb-0">
        <button className="hover:bg-white/10 p-2 rounded">
          <Menu size={18} />
        </button>
        <span className="text-xl font-semibold">Standard</span>
        <button className="ml-auto hover:bg-white/10 p-2 rounded">
          <RotateCcw size={16} className="text-gray-400" />
        </button>
      </div>

      {}
      <div className="flex-1 flex flex-col items-end justify-end px-4 pb-2">
        <div className="text-gray-400 text-sm h-6 font-medium tracking-wide">
          {previous} {operation}
        </div>
        <div className={`${getFontSize()} font-semibold break-all transition-all`}>
          {formatOperand(current)}
        </div>
      </div>

      {}
      <div className="grid grid-cols-4 grid-rows-6 gap-[2px] bg-[#202020] p-[2px]">
        {buttons.map((btn, index) => (
          <button
            key={index}
            onClick={btn.action}
            className={`
              h-[55px] flex items-center justify-center text-sm transition-all duration-100
              ${btn.type === 'num' 
                ? 'bg-[#3b3b3b] hover:bg-[#323232] font-bold text-white' 
                : ''}
              ${btn.type === 'sec' 
                ? 'bg-[#323232] hover:bg-[#3b3b3b] text-gray-100' 
                : ''}
              ${btn.type === 'accent' 
                ? 'bg-[#76b9ed] hover:bg-[#68a3d1] text-black font-semibold'
                : ''}
              active:scale-95 active:opacity-80 rounded-sm
            `}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
}   