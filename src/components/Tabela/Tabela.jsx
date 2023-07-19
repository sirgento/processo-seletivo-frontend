import React, { useState } from 'react';

const Tabela = ({ colunas, dados, registrosPorPagina }) => {
    const [paginaAtual, setPaginaAtual] = useState(1);

    const paginas = Math.ceil(dados.length / registrosPorPagina);
    const indexUltimoItem = paginaAtual * registrosPorPagina;
    const indexPrimeiroItem = indexUltimoItem - registrosPorPagina;
    const itensAtual = dados.slice(indexPrimeiroItem, indexUltimoItem);

    const handleMudarPagina = (pagina) => {
        if (pagina >= 1 && pagina <= paginas) {
            setPaginaAtual(pagina);
        }
    };

    const renderCabecalho = () => {
        return colunas.map((coluna) => (
            <th key={coluna}>{coluna}</th>
        ));
    };

    const renderCorpo = () => {
        return itensAtual.map((item, index) => (
            <tr key={index}>
                {Object.values(item).map((value, index) => (
                    <td key={index}>{value}</td>
                ))}
            </tr>
        ));
    };

    const renderPaginacao = () => {
        const numerosPaginas = [];

        for (let i = 1; i <= paginas; i++) {
            numerosPaginas.push(
                <li
                    key={i}
                    className={`w3-button w3-round-xlarge ${i === paginaAtual ?
                        'w3-green' : ''
                        }`}
                    onClick={() => handleMudarPagina(i)}
                >
                    {i}
                </li>
            );
        }

        return (
            <ul className="w3-bar w3-center">
                <li
                    className={`w3-button w3-round-xlarge ${paginaAtual === 1 ?
                        'w3-disabled' : ''}`}
                    onClick={() => handleMudarPagina(1)}
                >
                    &laquo;
                </li>
                <li
                    className={`w3-button w3-round-xlarge ${paginaAtual === 1 ?
                        'w3-disabled' : ''}`}
                    onClick={() => handleMudarPagina(paginaAtual - 1)}
                >
                    &lsaquo;
                </li>
                {numerosPaginas}
                <li
                    className={`w3-button w3-round-xlarge ${paginaAtual === paginas ?
                        'w3-disabled' : ''}`}
                    onClick={() => handleMudarPagina(paginaAtual + 1)}
                >
                    &rsaquo;
                </li>
                <li
                    className={`w3-button w3-round-xlarge ${paginaAtual === paginas ?
                        'w3-disabled' : ''}`}
                    onClick={() => handleMudarPagina(paginas)}
                >
                    &raquo;
                </li>
            </ul>
        );
    };

    return (
        <div>
            <table className="w3-table-all w3-responsive" id='tabela-extrato'>
                <thead>
                    <tr>{renderCabecalho()}</tr>
                </thead>
                <tbody>{renderCorpo()}</tbody>
            </table>
            {renderPaginacao()}
        </div>
    );
};

export default Tabela;
