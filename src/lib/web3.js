import { useMemo, useState, useEffect } from 'react';

import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import { ethers } from 'ethers';

import { NETWORKS } from '../constants';
import { useAddress } from '../contexts/AppTemplateContext';

export const injected = new InjectedConnector({ supportedChainIds: NETWORKS.map(n => n.chainId) })

export const shortenTxHash = (hash) =>
  `${hash.substr(0,6)}...${hash.substr(62,4)}`;

export const useContractByAddress = (address, network) => {
  const addressRecord = useAddress(address, network);
  const { library, account, active } = useWeb3React();

  const { abi } = addressRecord || {};

  return useMemo(() => {
    if (!abi) { return; }
    const provider = active ?  new UncheckedJsonRpcSigner(library.getSigner(account)) : ethers.getDefaultProvider();
    return new ethers.Contract(address, abi, provider);
  }, [address, network, account, library, active]);
};

export const useHasSigner = () => {
  const { library, account, active } = useWeb3React();

  try {
    const provider = new UncheckedJsonRpcSigner(library.getSigner(account));
    return provider !== undefined;
  } catch (err) {
    return false;
  }
};

export const useWeb3ConnectExisting = () => {
  const { activate, active, chainId,library } = useWeb3React();
  const [tried, setTried] = useState(false);

  useEffect(() => {
    injected.isAuthorized().then((isAuthorized) => {
      if (isAuthorized) {
        activate(injected, undefined, true).catch((err) => {
          // TODO: Push this error to UI?  Can be "unsupported chain Id"..
          console.warn(err);
          setTried(true);
        })
      } else {
        setTried(true);
      }
    })
  }, []);

  useEffect(() => {
    if (!tried && active) {
      setTried(true);
    }
  }, [tried, active]);

    return tried;
};


class UncheckedJsonRpcSigner extends ethers.Signer {
  //  /*readonly*/ signer: ethers.providers.JsonRpcSigner;

  constructor(signer/*: ethers.providers.JsonRpcSigner*/) {
    super();
    ethers.utils.defineReadOnly(this, 'signer', signer);
    ethers.utils.defineReadOnly(this, 'provider', signer.provider);
  }

  getAddress()/*: Promise<string> */ {
    return this.signer.getAddress();
  }

  sendTransaction(transaction/*:TransactionRequest*/) /*: Promise<TransactionResponse> */ {
    return this.signer.sendUncheckedTransaction(transaction).then((hash) => {
      return {
        hash: hash,
        nonce: null,
        gasLimit: null,
        gasPrice: null,
        data: null,
        value: null,
        chainId: null,
        confirmations: 0,
        from: null,
        wait: (confirmations/*?: number*/) => { return this.provider.waitForTransaction(hash, confirmations); }
      };
    });
  }

  signMessage(message/*: string | ethers.utils.Arrayish*/)/*: Promise<string> */ {
    return this.signer.signMessage(message);
  }
}
