import { useMemo, useState, useEffect } from 'react';

import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import { ethers } from 'ethers';

import { useAddresses } from 'AppTemplateStore';

export const injected = new InjectedConnector({ supportedChainIds: [1, 3, 4, 5, 42] })

export const useContractByAddress = (address) => {
  const addresses = useAddresses();
  const { library, account } = useWeb3React();
  const { abi } = addresses[address];

  return useMemo(() => {
    const provider = new UncheckedJsonRpcSigner(library.getSigner(account));
    return new ethers.Contract(address, abi, provider);
  }, [address, abi, account, library]);
};


export const useWeb3ConnectExisting = () => {
  const { activate, active } = useWeb3React();

  const [tried, setTried] = useState(false);

  useEffect(() => {
    injected.isAuthorized().then((isAuthorized) => {
      if (isAuthorized) {
        activate(injected, undefined, true).catch(() => {
          setTried(true);
        })
      } else {
        setTried(true)
      }
    })
  }, []);

  useEffect(() => {
    if (!tried && active) {
      setTried(true)
    }
  }, [tried, active]);

    return tried;
}


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
