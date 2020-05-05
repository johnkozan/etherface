import React, { createContext, useReducer, useContext, useMemo, useEffect, useCallback } from 'react';
import { useWeb3React } from '@web3-react/core'


// Track transactions

const Web3Context = createContext();

const initialState = {
  transactions: [],
  blockNumber: {},
};

const ADD_TX = 'ADD_TX';
const SET_TX_BLOCK_NUM = 'SET_TX_BLOCK_NUM';
const SET_TX_RECEIPT = 'SET_TX_RECEIPT';
const SET_BLOCK_NUMBER = 'SET_BLOCK_NUMBER';

function reducer(state, action) {
  switch(action.type) {

    case ADD_TX:
      return {
        ...state,
        transactions: {
          ...state.transactions,
          [action.payload.hash]: action.payload,
        },
      };

    case SET_BLOCK_NUMBER:
      return {
        ...state,
        blockNumber: {
          ...state.blockNumber,
          [action.payload.chainId]: action.payload.blockNumber,
        },
      };

    case SET_TX_BLOCK_NUM: {
      const { hash, chainId, blockNumber } = action.payload;
      // TODO: Actually deal with chainId
      return {
        ...state,
        transactions: {
          ...state.transactions,
          [hash]: {
            ...state.transactions[hash],
            _checkedBlock: blockNumber,
          },
        },
      };
    }

    case SET_TX_RECEIPT: {
      const { hash, chainId, receipt } = action.payload;
      // TODO: Actually deal with chainId
      return {
        ...state,
        transactions: {
          ...state.transactions,
          [hash]: {
            ...state.transactions[hash],
            receipt,
          },
        },
      };
    }

    default:
      return state;
  }
}

export const Web3ContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const addTx = (tx) => {
    dispatch({type: ADD_TX, payload: tx});
  };

  const setTxBlockNumber = (hash, chainId, blockNumber) => {
    dispatch({type: SET_TX_BLOCK_NUM, payload: {hash, chainId, blockNumber}});
  };

  const setTxReceipt = useCallback((hash, chainId, receipt) => {
    dispatch({type: SET_TX_RECEIPT, payload: {hash, chainId, receipt}});
  }, []);

  const setBlockNumber = useCallback((chainId, blockNumber) => {
    dispatch({type: SET_BLOCK_NUMBER, payload: {chainId, blockNumber}});
  }, []);


  return (
    <Web3Context.Provider value={useMemo(() => [state, { addTx, setTxBlockNumber, setTxReceipt, setBlockNumber }], [state, addTx, setTxBlockNumber, setTxReceipt, setBlockNumber])}>
      { children }
    </Web3Context.Provider>
  );
}

export const useWeb3Context = () => {
  return useContext(Web3Context);
}

export const useTransactions = () => {
  const [state] = useWeb3Context();
  const { transactions } = state;
  return transactions;
};

export const useBlockNumber = (chainId) => {
  const [state] = useWeb3Context();
  const { blockNumber } = state;
  return blockNumber[chainId] || 0;
};

export function BlockNumberWatcher() {
  const { library, chainId } = useWeb3React()
  const [, { setBlockNumber }] = useWeb3Context();

  // update block number
  useEffect(() => {
    if (library) {
      let stale = false;

      function updateBlockNumber() {
        library
          .getBlockNumber()
          .then(blockNumber => {
            if (!stale) {
              setBlockNumber(chainId, blockNumber);
            }
          })
          .catch(() => {
            if (!stale) {
              setBlockNumber(chainId, null);
            }
          });
      }

      updateBlockNumber();
      library.on('block', updateBlockNumber);

      return () => {
        stale = true;
        library.removeListener('block', updateBlockNumber);
      }
    }
  }, [chainId, library, setBlockNumber])

  return null;
}


export function TransactionStatusWatcher() {
  const { chainId, library } = useWeb3React();
  const [state, { setTxBlockNumber, setTxReceipt }] = useWeb3Context();

  const blockNumber = useBlockNumber(chainId);
  const transactions = useTransactions();

  useEffect(() => {
    if ((chainId || chainId === 0) && library) {
      let stale = false;

      Object.keys(transactions).forEach(hash => {
        const tx = transactions[hash];
        if (tx.chainId !== chainId) {
          // TODO: Support multiple connections to multiple chains
          return;
        }
        if (!!tx.receipt) { return; }
        if (tx._checkedBlock === blockNumber) { return; }

        library
          .getTransactionReceipt(hash)
          .then(receipt => {
            if (!stale) {
              if (!receipt) {
                setTxBlockNumber(hash, chainId, blockNumber);
              } else {
                setTxReceipt(hash, chainId, receipt);
              }
            }
          })
          .catch(() => {
            setTxBlockNumber(hash, chainId, blockNumber);
          });
      });

      return () => {
        stale = true;
      }
    }
  }, [chainId, library, transactions, blockNumber, setTxBlockNumber, setTxReceipt]);

  return null;
};
