import { useState, useEffect } from 'react';
import { ZERO_ADDRESS, web3BNToFloatString } from '../utils';
import { getERC20Contract } from '../store/contractStore';
import BigNumber from 'bignumber.js';
import BN from 'bn.js';
import { useWeb3React } from '@web3-react/core';

export default function useBalance(
  tokenAddress,
  decimals,
) {
  const [balance, setBalance] = useState('0');
  const [newHeader, setNewHeader] = useState(false);

  const { account, library } = useWeb3React();

  useEffect(() => {
    let isCancelled = false;

    if (newHeader == true)
    {
      setNewHeader(false);
    }

    function getBalance() {
      return new Promise((resolve) => {
        if (!library || !tokenAddress) {
          resolve(new BN('0'));
          return
        }

        try {
          if (tokenAddress === ZERO_ADDRESS) {
            library.eth
              .getBalance(account)
              .then((value) => {
                resolve(new BN(value))
              })
              .catch((error) => {
                console.log(error)
                resolve(new BN('0'))
              })
          } else {
            const contract = getERC20Contract(tokenAddress, library)
            contract?.methods
              .balanceOf(account)
              .call()
              .then((value) => {
                resolve(new BN(value))
              })
              .catch((error) => {
                console.log(error)
                resolve(new BN('0'))
              })
          }
        } catch (error) {
          resolve(new BN('0'))
        }
      })
    }

    async function run() {
      const bn = await getBalance();
      if (!isCancelled) {
        const pow = new BigNumber('10').pow(new BigNumber(decimals));
        setBalance(web3BNToFloatString(bn, pow, 4, BigNumber.ROUND_DOWN));
      }
    }

    run();

    return () => {
      isCancelled = true;
    }
  }, [tokenAddress, library, decimals, account, newHeader])

  useEffect(() => {
    console.log('useEffectBlock');
    console.log(library?.eth);
    // Subscribe to blocks
    let subscription = library?.eth?.subscribe('newBlockHeaders', function(error, result){
      if (!error) {
        // "Emit event" so that the balance is refreshed
        setNewHeader(true);
        return;
      }
  
      console.error(error);
  })
  .on("connected", function(subscriptionId){
    console.log(subscriptionId);
  })
  .on("error", console.error);

  }, [account, library]);

  return [balance];
}