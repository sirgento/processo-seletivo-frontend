import React, { } from 'react'

const TituloTabela = ({ dados, saldoTotal }) => {

    const renderSaldoTotal = () => {
        return (
            <span className='span-saldo'>
                Saldo total: R$ {saldoTotal}
            </span>
        );
    }

    const renderSaldoPeriodo = () => {
        let saldoPeriodo = 0.00;
        for (let entrada of dados) {
            if (entrada.valencia !== undefined) {
                saldoPeriodo += entrada.valencia;
            }
        }
        return (
            <span className='span-saldo'>
                Saldo no período: R$ {saldoPeriodo}
            </span>
        );
    }


    return (<>
        <div id='tabela-saldos' className='w3-border'>
            {renderSaldoTotal()}
            {renderSaldoPeriodo()}
        </div>
    </>);
}

export default TituloTabela;