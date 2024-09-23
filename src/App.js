  import React, { useState } from 'react';
  import { det } from 'mathjs'; // Usamos mathjs para cálculos matriciales
  import MathJax from 'react-mathjax';
  import './App.css'; 

  const SistemaEcuaciones = () => {
    const [a1, setA1] = useState('');
    const [b1, setB1] = useState('');
    const [c1, setC1] = useState('');
    const [a2, setA2] = useState('');
    const [b2, setB2] = useState('');
    const [c2, setC2] = useState('');
    const [resultados, setResultados] = useState('');
    const [procedimiento, setProcedimiento] = useState('');
    const [tipoSolucion, setTipoSolucion] = useState('');
    const [errores, setErrores] = useState({}); // Para manejar los errores en los campos
    const [mostrarWarning, setMostrarWarning] = useState(false); // Mostrar u ocultar advertencia


    const validarEntrada = (valor) => { 
      
      const regex = /^-?\d*(\.\d*)?$/;
     
 // Permite números enteros y decimales, positivos o negativos
    return regex.test(valor) || valor === '-'; // Permite '-' como entrada temporal
  };

  const manejarCambio = (setter, campo, valor) => {
    if (validarEntrada(valor) || valor === '') {
      setter(valor);
      setErrores((prevErrores) => ({ ...prevErrores, [campo]: false }));
      setMostrarWarning(false); // Ocultar advertencia al ingresar un valor válido
    } else {
      setErrores((prevErrores) => ({ ...prevErrores, [campo]: true }));
      
      if (valor === '-') {
        setMostrarWarning(true); // Mostrar advertencia si solo hay un signo negativo
      } else {
        setMostrarWarning(true); // Mostrar advertencia si el valor es inválido
      }
    }
  };

    
    const esInvalido = Object.values(errores).some((error) => error) || 
    ![a1, b1, c1, a2, b2, c2].every((val) => val !== '' && val !== null && !isNaN(parseFloat(val)));

    const calcularSistema = () => {
      if (esInvalido) {
        setMostrarWarning(true); // Mostrar advertencia si los campos no están completos
        return;
      }

      setMostrarWarning(false); // Ocultar advertencia cuando todo esté completo

      // Definir la matriz de coeficientes (A)
      const A = [[parseFloat(a1), parseFloat(b1)], [parseFloat(a2), parseFloat(b2)]];
      //const B = [parseFloat(c1), parseFloat(c2)];
      const det_A = det(A);
    
      if (det_A !== 0) {
        // Si el determinante no es cero, calculamos las soluciones con la regla de Cramer
        const A_x = [[parseFloat(c1), parseFloat(b1)], [parseFloat(c2), parseFloat(b2)]];
        const A_y = [[parseFloat(a1), parseFloat(c1)], [parseFloat(a2), parseFloat(c2)]];
        const det_Ax = det(A_x);
        const det_Ay = det(A_y);
        const x = det_Ax / det_A;
        const y = det_Ay / det_A;
    
        // Comprobación de las ecuaciones originales
        //const comprobacionEcuacion1 = parseFloat(a1) * x + parseFloat(b1) * y;
       // const comprobacionEcuacion2 = parseFloat(a2) * x + parseFloat(b2) * y;
    
        const pasos = (
          <MathJax.Provider>
            <div className="pasos">
              <h4>Pasos</h4>
        
              {/* Explicación de las ecuaciones originales */}
              <p><strong>Paso 1: Escribir las ecuaciones originales</strong></p>
              <p>Las ecuaciones del sistema son:</p>
              <p>{`${a1}X + ${b1}Y = ${c1} (Ecuación 1)`}</p>
              <p>{`${a2}X + ${b2}Y = ${c2} (Ecuación 2)`}</p>
              <p>Aquí, X y Y son las incógnitas que deseamos resolver.</p>
        
              {/* Representación en forma matricial */}
              <p><strong>Paso 2: Escribir el sistema en forma matricial</strong></p>
              <p>Podemos expresar este sistema de ecuaciones en forma matricial:</p>
              <MathJax.Node formula={`Δ = \\begin{pmatrix} ${a1} & ${b1} \\\\ ${a2} & ${b2} \\end{pmatrix}`} />
              <p>Δ= determinante</p>
              <p>Donde la matriz de coeficientes <strong>Δ</strong> contiene los coeficientes de las variables X y Y.</p>
              
        
              {/* Cálculo del determinante */}
              <p><strong>Paso 3: Cálculo del determinante de la matriz de coeficientes (Δ)</strong></p>
              <p>El determinante de la matriz <strong>Δ</strong> se calcula como:</p>
              <MathJax.Node formula={`Δ = (${a1} \\times ${b2}) - (${b1} \\times ${a2}) = ${det_A.toFixed(3)}`} />
              <p>El determinante es: {det_A.toFixed(3)}</p>
              <p>Si Δ ≠ 0, el sistema tiene una única solución.</p>
        
              {/* Matrices auxiliares y determinantes */}
              <p><strong>Paso 4: Cálculo de los determinantes auxiliares</strong></p>
              <p><strong>4.1: Cálculo de la Δ<sub>x</sub>:</strong></p>
              <MathJax.Node formula={`Δ_x = \\begin{pmatrix} ${c1} & ${b1} \\\\ ${c2} & ${b2} \\end{pmatrix}`} />
              <MathJax.Node formula={`Δ_x = (${c1} \\times ${b2}) - (${b1} \\times ${c2}) = ${det_Ax.toFixed(3)}`} />
              <p>La matriz de la incógnita X es la misma matriz de coeficientes con una diferencia. En lugar de colocar los coeficientes de X, se ubican los valores numéricos que quedaron al otro lado de las ecuaciones.</p>
              <p><strong>4.2: Cálculo de la Δ<sub>y</sub>:</strong></p>
              <MathJax.Node formula={`Δ_y = \\begin{pmatrix} ${a1} & ${c1} \\\\ ${a2} & ${c2} \\end{pmatrix}`} />
              <MathJax.Node formula={`Δ_y = (${a1} \\times ${c2}) - (${c1} \\times ${a2}) = ${det_Ay.toFixed(3)}`} />
                            {/* Solución usando la regla de Cramer */}
              <p>La matriz de la incógnita Y es la misma matriz de coeficientes con una diferencia. En lugar de colocar los coeficientes de Y, se ubican los valores numéricos que quedaron al otro lado de las ecuaciones.</p>
              <p><strong>Paso 5: Aplicando la regla de Cramer</strong></p>
              <p>El valor de X va a ser igual al determinante de la matriz X dividido en el determinante de la matriz de coeficientes:</p>
              <MathJax.Node formula={`X = \\frac{Δ_x}{Δ} = \\frac{${det_Ax.toFixed(3)}}{${det_A.toFixed(3)}} = ${x.toFixed(3)}`} />
              <p>El valor de Y va a ser igual al determinante de la matriz Y dividido en el determinante de la matriz de coeficientes:</p>
              <MathJax.Node formula={`Y = \\frac{Δ_y}{Δ} = \\frac{${det_Ay.toFixed(3)}}{${det_A.toFixed(3)}} = ${y.toFixed(3)}`} />
              <p>Las soluciones del sistema son:</p>
              <p>X = {x.toFixed(3)}, Y = {y.toFixed(3)}</p>
              {/* Comprobación de la solución */}
      {/* Comprobación de la solución */}
<p><strong>Paso 6: Comprobación de la solución</strong></p>
<p>Reemplazando los valores de X y Y en las ecuaciones originales:</p>

{/* Ecuación 1 */}
<MathJax.Node formula={`${a1}(${x.toFixed(3)}) + ${b1}(${y.toFixed(3)}) = ${(a1 * x + b1 * y).toFixed(3)} \\approx ${c1}`} />

{/* Ecuación 2 */}
<MathJax.Node formula={`${a2}(${x.toFixed(3)}) + ${b2}(${y.toFixed(3)}) = ${(a2 * x + b2 * y).toFixed(3)} \\approx ${c2}`} />

<p>La solución es correcta si ambos lados de las ecuaciones originales son aproximadamente iguales.</p>
            </div>
          </MathJax.Provider>
        );
        
    
        setResultados(`Solución del sistema: x = ${x.toFixed(3)}, y = ${y.toFixed(3)}`);
        setProcedimiento(pasos);
        setTipoSolucion('El sistema tiene una única solución porque la determinante es desigual a 0.');
      } else {
        // Si el determinante de la matriz principal es 0
        const A_x = [[parseFloat(c1), parseFloat(b1)], [parseFloat(c2), parseFloat(b2)]];
        const A_y = [[parseFloat(a1), parseFloat(c1)], [parseFloat(a2), parseFloat(c2)]];
        const det_Ax = det(A_x);
        const det_Ay = det(A_y);
    
        if (det_Ax === 0 && det_Ay === 0) {
          const pasosInfinitas = (
            <MathJax.Provider>
              <div className="pasos">
                <h4>Pasos</h4>
          
                {/* Paso 1: Escribir las ecuaciones originales */}
                <p><strong>Paso 1: Escribir las ecuaciones originales</strong></p>
                <p>Las ecuaciones del sistema son:</p>
                <p>{`${a1}X + ${b1}Y = ${c1} (Ecuación 1)`}</p>
                <p>{`${a2}X + ${b2}Y = ${c2} (Ecuación 2)`}</p>
                <p>Aquí, X y Y son las incógnitas que deseamos resolver.</p>
          
                {/* Paso 2: Representación en forma matricial */}
                <p><strong>Paso 2: Escribir el sistema en forma matricial</strong></p>
                <p>Podemos expresar este sistema de ecuaciones en forma matricial:</p>
                <MathJax.Node formula={`Δ = \\begin{pmatrix} ${a1} & ${b1} \\\\ ${a2} & ${b2} \\end{pmatrix}`} />
                <p>Donde la matriz de coeficientes <strong>Δ</strong> contiene los coeficientes de las variables X y Y.</p>
          
                {/* Paso 3: Cálculo del determinante */}
                <p><strong>Paso 3: Cálculo del determinante de la matriz de coeficientes (Δ)</strong></p>
                <p>El determinante de la matriz <strong>Δ</strong> se calcula como:</p>
                <MathJax.Node formula={`Δ = (${a1} \\times ${b2}) - (${b1} \\times ${a2}) = ${det_A.toFixed(3)}`} />
                <p>El determinante es: {det_A.toFixed(3)}</p>
          
                {/* Paso 4: Cálculo de los determinantes auxiliares */}
                <p><strong>Paso 4: Cálculo de los determinantes auxiliares</strong></p>
          
                {/* 4.1: Cálculo de la Δx */}
                <p><strong>4.1: Cálculo de la Δ<sub>x</sub>:</strong></p>
                <MathJax.Node formula={`Δ_x = \\begin{pmatrix} ${c1} & ${b1} \\\\ ${c2} & ${b2} \\end{pmatrix}`} />
                <MathJax.Node formula={`Δ_x = (${c1} \\times ${b2}) - (${b1} \\times ${c2}) = ${det_Ax.toFixed(3)}`} />
                <p>La matriz de la incógnita X es la misma matriz de coeficientes, pero con los términos constantes en lugar de los coeficientes de X.</p>
          
                {/* 4.2: Cálculo de la Δy */}
                <p><strong>4.2: Cálculo de la Δ<sub>y</sub>:</strong></p>
                <MathJax.Node formula={`Δ_y = \\begin{pmatrix} ${a1} & ${c1} \\\\ ${a2} & ${c2} \\end{pmatrix}`} />
                <MathJax.Node formula={`Δ_y = (${a1} \\times ${c2}) - (${c1} \\times ${a2}) = ${det_Ay.toFixed(3)}`} />
                <p>La matriz de la incógnita Y sigue el mismo proceso, pero reemplazando la columna de Y con los términos constantes.</p>
          
                {/* Paso 5: Conclusión de infinitas soluciones */}
                <p><strong>Paso 5: Conclusión de infinitas soluciones</strong></p>
                <p>Como Δ, Δ<sub>x</sub> y Δ<sub>y</sub> son 0, el sistema tiene infinitas soluciones.</p>
                <p>En este caso, las tres determinantes (Δ, Δ<sub>x</sub> y Δ<sub>y</sub>) son iguales a cero, lo que indica que el sistema de ecuaciones no tiene una solución única, sino que tiene infinitas soluciones. Esto ocurre cuando las dos ecuaciones son linealmente dependientes, es decir, una ecuación es múltiplo de la otra.</p>
          
              </div>
            </MathJax.Provider>
          );
          
          
    
          setProcedimiento(pasosInfinitas);
          setTipoSolucion('El sistema tiene infinitas soluciones.');
        } else {
          const pasosInconsistente = (
            <MathJax.Provider>
              <div className="pasos">
                <h4>Pasos</h4>
          
                {/* Paso 1: Escribir las ecuaciones originales */}
                <p><strong>Paso 1: Escribir las ecuaciones originales</strong></p>
                <p>Las ecuaciones del sistema son:</p>
                <p>{`${a1}X + ${b1}Y = ${c1} (Ecuación 1)`}</p>
                <p>{`${a2}X + ${b2}Y = ${c2} (Ecuación 2)`}</p>
                <p>Aquí, X y Y son las incógnitas que deseamos resolver.</p>
          
                {/* Paso 2: Representación en forma matricial */}
                <p><strong>Paso 2: Escribir el sistema en forma matricial</strong></p>
                <MathJax.Node formula={`Δ = \\begin{pmatrix} ${a1} & ${b1} \\\\ ${a2} & ${b2} \\end{pmatrix}`} />
                <p>Donde la matriz de coeficientes <strong>Δ</strong> contiene los coeficientes de las variables X y Y.</p>
          
                {/* Cálculo del determinante */}
                <p><strong>Paso 3: Cálculo del determinante de la matriz de coeficientes (Δ)</strong></p>
                <p>El determinante de la matriz <strong>Δ</strong> se calcula como:</p>
                <MathJax.Node formula={`Δ = (${a1} \\times ${b2}) - (${b1} \\times ${a2}) = ${det_A.toFixed(3)}`} />
                <p>El determinante es: {det_A.toFixed(3)}</p>
          
                {/* Conclusión de la inconsistencia */}
                <p><strong>4. Como Δ = 0, el sistema no tiene solución.</strong></p>
                
              </div>
            </MathJax.Provider>
          );
          
    
          setProcedimiento(pasosInconsistente);
          setTipoSolucion('El sistema no tiene solución.');
        }
    
        setResultados('');
      }
    };
    

    return (
      <div className="sistema-ecuaciones">
        <h2>Sistema de Ecuaciones</h2>
        <div className="contenedor">
          <div className="entrada-coeficientes">
            <h3>Ingresa los coeficientes:</h3>
            <div className="ecuacion">
              <input
                type="text"
                className={errores.a1 ? 'input-error' : ''}
                value={a1}
                onChange={(e) => manejarCambio(setA1, 'a1', e.target.value)}
                onBlur={() => {
                  if (a1 === '-' || (a1 === '' && mostrarWarning)) {
                    setErrores((prevErrores) => ({ ...prevErrores, a1: true }));
                    setMostrarWarning(true);
                  }
                }}
                placeholder="a1"
              />
              x +
              <input
                type="text"
                className={errores.b1 ? 'input-error' : ''}
                value={b1}
                onChange={(e) => manejarCambio(setB1, 'b1', e.target.value)}
                onBlur={() => {
                  if (b1 === '-' || (b1 === '' && mostrarWarning)) {
                    setErrores((prevErrores) => ({ ...prevErrores, b1: true }));
                    setMostrarWarning(true);
                  }
                }}
                placeholder="b1"
              />
              y =
              <input
                type="text"
                className={errores.c1 ? 'input-error' : ''}
                value={c1}
                onChange={(e) => manejarCambio(setC1, 'c1', e.target.value)}
                onBlur={() => {
                  if (c1 === '-' || (c1 === '' && mostrarWarning)) {
                    setErrores((prevErrores) => ({ ...prevErrores, c1: true }));
                    setMostrarWarning(true);
                  }
                }}
                placeholder="c1"
              />
            </div>
            <div className="ecuacion">
              <input
                type="text"
                className={errores.a2 ? 'input-error' : ''}
                value={a2}
                onChange={(e) => manejarCambio(setA2, 'a2', e.target.value)}
                onBlur={() => {
                  if (a2 === '-' || (a2 === '' && mostrarWarning)) {
                    setErrores((prevErrores) => ({ ...prevErrores, a2: true }));
                    setMostrarWarning(true);
                  }
                }}
                placeholder="a2"
              />
              x +
              <input
                type="text"
                className={errores.b2 ? 'input-error' : ''}
                value={b2}
                onChange={(e) => manejarCambio(setB2, 'b2', e.target.value)}
                onBlur={() => {
                  if (b2 === '-' || (b2 === '' && mostrarWarning)) {
                    setErrores((prevErrores) => ({ ...prevErrores, b2: true }));
                    setMostrarWarning(true);
                  }
                }}
                placeholder="b2"
              />
              y =
              <input
                type="text"
                className={errores.c2 ? 'input-error' : ''}
                value={c2}
                onChange={(e) => manejarCambio(setC2, 'c2', e.target.value)}
                onBlur={() => {
                  if (c2 === '-' || (c2 === '' && mostrarWarning)) {
                    setErrores((prevErrores) => ({ ...prevErrores, c2: true }));
                    setMostrarWarning(true);
                  }
                }}
                placeholder="c2"
              />
            </div>
            <button
              onClick={calcularSistema}
              disabled={esInvalido}
              className={esInvalido ? 'boton-deshabilitado' : 'boton-habilitado'}
            >
              {esInvalido ? 'Por favor completa los campos' : 'Calcular Ecuación'}
            </button>

            {mostrarWarning && (
    <p className="warning">
      {a1 === '-' || b1 === '-' || c1 === '-' || a2 === '-' || b2 === '-' || c2 === '-' 
        ? 'Por favor, ingresa un número después del signo negativo.' 
        : 'Por favor, ingresa solo números enteros o decimales válidos.'}
    </p>
  )}
            
            <div className="resultados">
            {tipoSolucion && (
              <div className="resultado">
                <h3>Resultado:</h3>
                <p>{tipoSolucion}</p>
                {resultados && <p>{resultados}</p>}
              </div>
            )}
          </div>
          </div>

          <div className="resultados">
            {tipoSolucion && (
              <div className="resultado">
                  {procedimiento}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  export default SistemaEcuaciones;
