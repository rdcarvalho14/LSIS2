import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { evaluate } from 'mathjs';
import './Calculator.css';

// Calculadora científica com detecção de código de 4 dígitos (disfarce)
const Calculator = () => {
  const [display, setDisplay] = useState('0'); // o que é mostrado na tela
  const [expr, setExpr] = useState('0'); // expressão real para avaliar
  const [buffer, setBuffer] = useState(''); // somente dígitos para senha
  const [angleMode, setAngleMode] = useState('DEG'); // DEG | RAD
  const [memory, setMemory] = useState(null); // memória da calculadora
  const [justEvaluated, setJustEvaluated] = useState(false);
  const [userCode, setUserCode] = useState(null); // código do usuário logado

  const navigate = useNavigate();
  const { login, currentUser } = useAuth();

  // Buscar o calculator_code do usuário logado
  useEffect(() => {
    console.log('Calculator - currentUser:', currentUser);
    if (currentUser && currentUser.calculator_code) {
      console.log('Calculator - Definindo userCode:', currentUser.calculator_code);
      setUserCode(currentUser.calculator_code);
    }
  }, [currentUser]);

  const scope = useMemo(() => ({
    sin: (x) => angleMode === 'DEG' ? Math.sin(x * Math.PI / 180) : Math.sin(x),
    cos: (x) => angleMode === 'DEG' ? Math.cos(x * Math.PI / 180) : Math.cos(x),
    tan: (x) => angleMode === 'DEG' ? Math.tan(x * Math.PI / 180) : Math.tan(x),
    asin: (x) => angleMode === 'DEG' ? (Math.asin(x) * 180 / Math.PI) : Math.asin(x),
    acos: (x) => angleMode === 'DEG' ? (Math.acos(x) * 180 / Math.PI) : Math.acos(x),
    atan: (x) => angleMode === 'DEG' ? (Math.atan(x) * 180 / Math.PI) : Math.atan(x),
    ln: (x) => Math.log(x),
    log10: (x) => Math.log10(x),
    sqrt: (x) => Math.sqrt(x),
    pow: (x, y) => Math.pow(x, y)
  }), [angleMode]);

  const verifyPassword = async (code) => {
    // Verifica se o código digitado corresponde ao calculator_code do usuário
    if (userCode && code === userCode) {
      login();
      navigate('/home', { replace: true });
    } else {
      // Código incorreto - limpa o buffer após breve pausa
      setTimeout(() => {
        setBuffer('');
      }, 300);
    }
  };

  const resetIfEvaluated = () => {
    if (justEvaluated) {
      setDisplay('0');
      setExpr('0');
      setJustEvaluated(false);
    }
  };

  const append = (toDisplay, toExpr) => {
    // Permite múltiplos zeros e outros dígitos
    setDisplay((d) => {
      if (justEvaluated) return toDisplay;
      // Se o display é apenas "0" inicial (buffer vazio), substitui pelo primeiro dígito
      if (d === '0' && buffer === '') return toDisplay;
      // Se não, adiciona ao display
      return d + toDisplay;
    });
    setExpr((e) => {
      if (justEvaluated) return toExpr;
      if (e === '0' && buffer === '') return toExpr;
      return e + toExpr;
    });
    if (justEvaluated) setJustEvaluated(false);
  };

  const handleDigit = (d) => {
    setBuffer((b) => {
      const base = justEvaluated ? '' : b;
      const nextBuffer = (base + d).slice(-4);
      if (nextBuffer.length === 4) verifyPassword(nextBuffer);
      return nextBuffer;
    });
    append(d, d);
  };

  const handleDecimal = () => {
    resetIfEvaluated();
    // Evita mais de um ponto no número atual
    const currentNumber = display.split(/[^0-9.πe]/).pop() || '';
    if (!currentNumber.includes('.')) {
      append('.', '.');
    }
  };

  const handleOperator = (op) => {
    const opMap = { '÷': '/', '×': '*', '+': '+', '-': '-', '^': '^' };
    const exprOp = opMap[op] || op;
    setJustEvaluated(false);
    setDisplay((d) => {
      return /[+\-×÷^]$/.test(d) ? d.slice(0, -1) + op : d + op;
    });
    setExpr((e) => (/[+\-*/^]$/.test(e) ? e.slice(0, -1) + exprOp : e + exprOp));
  };

  const handleFn = (fn) => {
    resetIfEvaluated();
    const map = {
      'sin': 'sin(', 'cos': 'cos(', 'tan': 'tan(',
      'ln': 'ln(', 'log': 'log10(', '√': 'sqrt(',
    };
    const token = map[fn];
    if (token) append(`${fn}(`, token);
  };

  const handleConst = (c) => {
    resetIfEvaluated();
    if (c === 'π') append('π', 'pi');
    if (c === 'e') append('e', 'e');
  };

  const handleParens = (p) => {
    resetIfEvaluated();
    append(p, p);
  };

  const handleSquare = () => {
    setDisplay((d) => d + '²');
    setExpr((e) => e + '^2');
    setJustEvaluated(false);
  };

  const handlePower = () => {
    handleOperator('^');
  };

  const handleReciprocal = () => {
    // 1/(último número)
    const re = /(\d+(?:\.\d+)?)$/;
    if (re.test(expr)) {
      setDisplay((d) => d.replace(re, (m) => `1/(${m})`));
      setExpr((e) => e.replace(re, (m) => `1/(${m})`));
    }
  };

  const handlePercent = () => {
    // Converte o último número para número/100
    const re = /(\d+(?:\.\d+)?)$/;
    if (re.test(expr)) {
      setDisplay((d) => d.replace(re, (m) => `(${m}%)`));
      setExpr((e) => e.replace(re, (m) => `(${m}/100)`));
    }
  };

  const handleFactorial = () => {
    setDisplay((d) => d + '!');
    setExpr((e) => e + '!');
  };

  const handleSign = () => {
    // alterna sinal do último número
    const re = /(\(?-?\d+(?:\.\d+)?\)?)$/;
    const last = expr.match(re)?.[0];
    if (!last) return;
    if (/^\(-/.test(last)) {
      setDisplay((d) => d.replace(re, last.slice(2, -1)));
      setExpr((e) => e.replace(re, last.slice(2, -1)));
    } else if (/^-/.test(last)) {
      setDisplay((d) => d.replace(re, last.slice(1)));
      setExpr((e) => e.replace(re, last.slice(1)));
    } else {
      setDisplay((d) => d.replace(re, (m) => `(-${m})`));
      setExpr((e) => e.replace(re, (m) => `(-${m})`));
    }
  };

  const handleBackspace = () => {
    // também interfere no buffer de senha quando apaga dígitos
    if (/\d$/.test(display)) setBuffer((b) => b.slice(0, -1));

    const multiTokens = [
      { d: 'sin(', e: 'sin(' },
      { d: 'cos(', e: 'cos(' },
      { d: 'tan(', e: 'tan(' },
      { d: 'ln(', e: 'ln(' },
      { d: 'log(', e: 'log10(' },
    ];
    for (const t of multiTokens) {
      if (display.endsWith(t.d)) {
        setDisplay((d) => d.slice(0, -t.d.length));
        setExpr((e) => e.slice(0, -t.e.length));
        return;
      }
    }

    if (display.endsWith('π')) {
      setDisplay((d) => d.slice(0, -1));
      setExpr((e) => e.slice(0, -2)); // "pi"
      return;
    }

    if (display.length <= 1) {
      setDisplay('0');
      setExpr('0');
      return;
    }
    setDisplay((d) => d.slice(0, -1));
    setExpr((e) => e.slice(0, -1));
  };

  const handleClear = () => {
    setDisplay('0');
    setExpr('0');
    setBuffer('');
    setJustEvaluated(false);
  };

  const handleEquals = () => {
    try {
      const sanitized = expr.replace(/×/g, '*').replace(/÷/g, '/');
      const result = evaluate(sanitized, scope);
      const value = Array.isArray(result) ? result[0] : result;
      setDisplay(String(value));
      setExpr(String(value));
      setJustEvaluated(true);
    } catch (e) {
      setDisplay('Erro');
      setExpr('0');
      setJustEvaluated(true);
    }
  };

  const memAdd = async () => {
    try {
      const v = Number(evaluate(expr, scope));
      setMemory((m) => (m ?? 0) + (isFinite(v) ? v : 0));
    } catch {}
  };
  const memSub = async () => {
    try {
      const v = Number(evaluate(expr, scope));
      setMemory((m) => (m ?? 0) - (isFinite(v) ? v : 0));
    } catch {}
  };
  const memRecall = () => {
    if (memory == null) return;
    const v = String(memory);
    append(v, v);
  };
  const memClear = () => setMemory(null);

  const toggleAngle = () => setAngleMode((m) => (m === 'DEG' ? 'RAD' : 'DEG'));

  return (
    <div className="calculator">
      <div className="calculator-header">
        <div className="mode-toggle" onClick={toggleAngle} aria-label="Alternar graus/radianos">
          {angleMode}
        </div>
        <div className={`memory-indicator ${memory != null ? 'on' : ''}`}>M</div>
      </div>

      <div className="calculator-display" role="textbox" aria-readonly>
        {display || '0'}
      </div>

      <div className="calculator-buttons scientific-grid">
        {/* Linha Funções de Memória */}
        <button className="btn-function" onClick={memClear}>MC</button>
        <button className="btn-function" onClick={memRecall}>MR</button>
        <button className="btn-function" onClick={memAdd}>M+</button>
        <button className="btn-function" onClick={memSub}>M-</button>
        <button className="btn-function" onClick={toggleAngle}>{angleMode}</button>

        {/* Linha Funções Trig/Log */}
        <button className="btn-function" onClick={() => handleFn('sin')}>sin</button>
        <button className="btn-function" onClick={() => handleFn('cos')}>cos</button>
        <button className="btn-function" onClick={() => handleFn('tan')}>tan</button>
        <button className="btn-function" onClick={() => handleFn('ln')}>ln</button>
        <button className="btn-function" onClick={() => handleFn('log')}>log</button>

        {/* Linha Parênteses e Potências */}
        <button className="btn-function" onClick={() => handleParens('(')}>(</button>
        <button className="btn-function" onClick={() => handleParens(')')}>)</button>
        <button className="btn-function" onClick={handlePower}>x^y</button>
        <button className="btn-function" onClick={() => handleFn('√')}>√</button>
        <button className="btn-function" onClick={handleSquare}>x²</button>

        {/* Linha 7 8 9 ÷ DEL */}
        <button className="btn-number" onClick={() => handleDigit('7')}>7</button>
        <button className="btn-number" onClick={() => handleDigit('8')}>8</button>
        <button className="btn-number" onClick={() => handleDigit('9')}>9</button>
        <button className="btn-operator" onClick={() => handleOperator('÷')}>÷</button>
        <button className="btn-function" onClick={handleBackspace}>DEL</button>

        {/* Linha 4 5 6 × % */}
        <button className="btn-number" onClick={() => handleDigit('4')}>4</button>
        <button className="btn-number" onClick={() => handleDigit('5')}>5</button>
        <button className="btn-number" onClick={() => handleDigit('6')}>6</button>
        <button className="btn-operator" onClick={() => handleOperator('×')}>×</button>
        <button className="btn-function" onClick={handlePercent}>%</button>

        {/* Linha 1 2 3 - 1/x */}
        <button className="btn-number" onClick={() => handleDigit('1')}>1</button>
        <button className="btn-number" onClick={() => handleDigit('2')}>2</button>
        <button className="btn-number" onClick={() => handleDigit('3')}>3</button>
        <button className="btn-operator" onClick={() => handleOperator('-')}>-</button>
        <button className="btn-function" onClick={handleReciprocal}>1/x</button>

        {/* Linha π 0 . + = */}
        <button className="btn-function" onClick={() => handleConst('π')}>π</button>
        <button className="btn-number" onClick={() => handleDigit('0')}>0</button>
        <button className="btn-number" onClick={handleDecimal}>.</button>
        <button className="btn-operator" onClick={() => handleOperator('+')}>+</button>
        <button className="btn-equals" onClick={handleEquals}>=</button>

        {/* Linha extra: C, ±, e, ! */}
        <button className="btn-function" onClick={handleClear}>C</button>
        <button className="btn-function" onClick={handleSign}>±</button>
        <button className="btn-function" onClick={() => handleConst('e')}>e</button>
        <button className="btn-function" onClick={handleFactorial}>!</button>
        <div className="btn-spacer" aria-hidden></div>
      </div>

      <div className="calculator-hint">
        <small>Digite seu código (4 números)</small>
        <br />
        <small 
          onClick={() => navigate('/')} 
          style={{ cursor: 'pointer', opacity: 0.5, fontSize: '0.7rem' }}
        >
          Voltar ao início
        </small>
      </div>
    </div>
  );
};

export default Calculator;
