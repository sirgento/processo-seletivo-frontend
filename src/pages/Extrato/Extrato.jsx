import React, { useState, useEffect } from 'react';
import Tabela from '../../components/Tabela/Tabela';
import TituloTabela from '../../components/Tabela/TituloTabela';

import "./Extrato.css"

const colunas = ['Data', 'Valência', 'Tipo', 'Nome do operador transacionado'];
// ];
const registrosPorPagina = 4;

const API_URL = process.env.REACT_APP_API_URL;
const NUMERO_CONTA = process.env.REACT_APP_NUM_CONTA;

const Extrato = () => {
    const [dados, setDados] = useState([]);
    const [carregando, setCarregando] = useState(false);

    const [saldoTotal, setSaldoTotal] = useState();

    const [dataInicio, setDataInicio] = useState();
    const [dataFim, setDataFim] = useState();
    const [nomeOperador, setNomeOperador] = useState("");

    const buscarDadosAPI = async () => {
        console.log(dataInicio, dataFim, nomeOperador)
        const formatDate = (date) => {
            if (date == null || date == "") {
                return undefined;
            }
            let dateObject = new Date(date);
            return `${dateObject.getDate().toString().padStart(2, "0")}-${(dateObject.getMonth() + 1).toString().padStart(2, "0")}-${dateObject.getFullYear()}`
        }
        const getParamString = () => {
            let returnString = "";
            const parametros = { "dataInicio": formatDate(dataInicio), "dataFim": formatDate(dataFim), "nomeOperador": nomeOperador };
            for (let key in parametros) {
                if (parametros[key] !== undefined && parametros[key] !== "") {
                    returnString += (returnString === "" ? "?" : "&");
                    returnString += `${key}=${parametros[key]}`
                }
            }
            return returnString;
        }
        let [extratoRequest, saldoRequest] = await Promise.allSettled(
            [
                fetch(`${API_URL}/transferencia/${getParamString()}`, {
                    headers: {
                        "conta": NUMERO_CONTA,
                    }
                }),
                fetch(`${API_URL}/conta/saldo/`, {
                    headers: {
                        "conta": NUMERO_CONTA,
                    }
                })
            ]
        );
        let [extrato, saldo] = await Promise.allSettled(
            [
                (extratoRequest.status === "fulfilled" ? extratoRequest.value.json() : Promise.reject(extratoRequest.reason)),
                (saldoRequest.status === "fulfilled" ? saldoRequest.value.json() : Promise.reject(saldoRequest.reason))
            ]
        );
        setCarregando(true);
        try {
            let dados = extrato.value.map((element) => {
                return {
                    data: new Date(element.dataTransferencia).toLocaleDateString(),
                    valencia: element.valor,
                    tipo: element.tipo,
                    nomeOperador: element.nomeOperadorTransacao
                }
            });
            setDados(dados);
            setSaldoTotal(saldo.value.saldo);
            setCarregando(false);
        } catch (error) {
            console.error('Erro na consulta da API Extrato:', error);
            setCarregando(false);
        }
    };

    useEffect(() => {
        buscarDadosAPI();
    }, []);

    return (
        <>
            <div id="div-busca" className='w3-border'>
                <div className='w3-row'>
                    <div className='w3-third w3-center'>
                        <span>
                            Data início
                        </span>
                        <input type="date" className='w3-input'
                            title='Data início'
                            onChange={(e) => setDataInicio(e.target.value)} />
                    </div>
                    <div className='w3-third w3-center'>
                        <span>
                            Data fim
                        </span>
                        <input type="date" className='w3-input'
                            title='Data fim'
                            onChange={(e) => setDataFim(e.target.value)} />
                    </div>
                    <div className='w3-third w3-center'>
                        <span>
                            Nome do Operador
                        </span>
                        <input type="text" className='w3-input'
                            title='Nome do operador transacionado'
                            onChange={(e) => setNomeOperador(e.target.value)} />
                    </div>
                </div>
                <div>
                    <div className='w3-center'>
                        <button className='w3-button' onClick={buscarDadosAPI}>
                            Pesquisar
                        </button>
                    </div>
                </div>
            </div>
            <div>
                {carregando ? (
                    <div>Buscando dados...</div>
                ) : (
                    <>
                        <TituloTabela dados={dados} saldoTotal={saldoTotal} />
                        <Tabela
                            colunas={colunas}
                            dados={dados}
                            registrosPorPagina={registrosPorPagina}
                        />
                    </>
                )}
            </div>
        </>
    );
};

export default Extrato;
