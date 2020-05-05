import React from 'react';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import { shortenTxHash } from 'lib/web3';
import { NETWORKS } from '../constants';

const ETHERSCAN_NETWORKS = ['mainnet', 'ropsten', 'kovan', 'rinkeby', 'goerli'];

function etherscanNetwork(network) {
  return ETHERSCAN_NETWORKS.indexOf(network) > -1;
}

function etherscanApiHost(network) {
  if (!etherscanNetwork(network)) { throw new Error(`Unsupported network ${network}`); }
  return network === 'mainnet' ? 'api' : `api-${network}`;
}


export const fetchAbi = async (address, network) => {
    let result = await fetch(
      `https://${ etherscanApiHost(network) }.etherscan.io/api?module=contract&action=getabi&address=${address}`
    )
    let json = await result.json()
    if (json.status === '1') {
      return json.result;
    } else {
      throw new Error('Failed to fetch ABI from etherscan');
    }
};

function etherscanUrl(chainId) {
  const baseUrl = 'etherscan.io';
  const network = NETWORKS.find(n => n.chainId === chainId);
  if (network.id === 'mainnet') { return baseUrl; }
  return `${network.id}.${baseUrl}`;
}

export const EtherscanTxLink = ({hash, chainId, prefix='' }) => {
  return <span>
    { prefix }
    { prefix.length > 0 ? ' ' : undefined }
    <a href={`https://${ etherscanUrl(chainId)}/tx/${hash}`} target="_blank" rel="noopener noreferrer">
      { shortenTxHash(hash) }
      <OpenInNewIcon fontSize="small" />
    </a>
  </span>
};
