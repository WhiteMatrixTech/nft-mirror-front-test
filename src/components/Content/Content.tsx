/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { BigNumber, ethers } from 'ethers';
import {
  MirrorClient,
  MirrorProvider,
  DeploymentInfo,
  Mirror__factory
} from '@white-matrix/nft-mirror-sdk';

import styles from './Content.module.less';
import {
  MirrorImpl,
  MirrorImpl__factory
} from '@white-matrix/nft-mirror-sdk/dist/contracts/typechain';
interface ContentProps {
  className?: string;
}

export const CONTRACT_ADDRESS = DeploymentInfo.rinkeby.mirror.proxyAddress;

export function Content(props: ContentProps) {
  const { className } = props;
  const ethProvider = useRef<ethers.providers.Web3Provider>();
  const client = useRef<MirrorClient>();
  const mirrorImpl = useRef<MirrorImpl>();

  const [stockSupplyRes, setStockSupplyRes] = useState<string>();
  const [tokenPriceRes, setTokenPriceRes] = useState<string>();
  const [tokenInfoRes, setTokenInfoRes] = useState<string>();
  const [tokenId, setTokenId] = useState<string>();

  const [usedPreOrderQuota, setUsedPreOrderQuota] = useState<string>();
  const [accountQuotaAndSignature, setAccountQuotaAndSignature] =
    useState<string>();
  const [account, setAccount] = useState<string>();

  const [preOrderRes, setPreOrderRes] = useState<string>();
  const [orderInfo, setOrderInfo] = useState<{
    quantity: string;
    account: string;
    quota: string;
    signature: string;
  }>({
    quantity: '',
    account: '',
    quota: '',
    signature: ''
  });

  const [quality, setQuality] = useState<string>();
  const [buyInfo, setBuyInfo] = useState<string>();

  const [receivers, setReceivers] = useState<string[]>();
  const [quantities, setQuantities] = useState<BigNumber[]>();
  const [batchAirdropRes, setBatchAirdropRes] = useState<string>();

  const [levelUpInfo, setLevelUpInfo] = useState<{
    tokenId: string;
    level: string;
    signature: string;
  }>({
    tokenId: '',
    level: '',
    signature: ''
  });
  const [levelUpRes, setLevelUpRes] = useState<string>();

  const [queryTokenMintedEventRes, setQueryTokenMintedEventRes] =
    useState<string>();

  const [fromBlock, setFromBlock] = useState<string>();
  const [toBlock, setToBlock] = useState<string>();

  const [getBlockNumberRes, setGetBlockNumberRes] = useState<number>();

  const [signPreOrderMessageQuery, setSignPreOrderMessageQuery] = useState({
    privateKey: '',
    account: '',
    quota: ''
  });
  const [signPreOrderMessageRes, setSignPreOrderMessageRes] =
    useState<string>();

  const [signLevelUpMessageQuery, setSignLevelUpMessageQuery] = useState({
    privateKey: '',
    tokenId: '',
    level: ''
  });
  const [signLevelUpMessageRes, setSignLevelUpMessageRes] = useState<string>();
  const [adminConnected, setAdminConnected] = useState<boolean>();

  const [paused, setPaused] = useState<boolean>();
  const [stageLock, setStageLock] = useState<boolean>();
  const [stageLockInput, setStageLockInput] = useState<string>();
  const [airDropList, setAirDropList] = useState<string>('[]');
  const [roleAddress, setRoleAddress] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState<boolean>();
  const [withdrawAmount, setWithdrawAmount] = useState<string>('0');

  useEffect(() => {
    void initProvider();
  }, []);

  const [contractAddress, setContractAddress] =
    useState<string>(CONTRACT_ADDRESS);

  const refreshAdminView = async () => {
    console.log(isAdmin);
    if (mirrorImpl.current) {
      setPaused(await mirrorImpl.current.paused());
      setStageLock(await mirrorImpl.current.stageLock());
      const currentAddress = await ethProvider.current
        ?.getSigner()
        .getAddress();
      if (currentAddress) {
        setIsAdmin(
          await mirrorImpl.current.hasRole(
            ethers.constants.HashZero,
            currentAddress
          )
        );
      }
    }
  };

  const connectAdminProvider = () => {
    if (ethProvider.current) {
      mirrorImpl.current = MirrorImpl__factory.connect(
        contractAddress,
        ethProvider.current.getSigner()
      );
      setAdminConnected(true);
      void refreshAdminView();
    }
  };

  const unpause = async () => {
    await mirrorImpl.current?.unpause();
  };

  const pause = async () => {
    await mirrorImpl.current?.pause();
  };

  const setContractStageLock = async (lock: boolean) => {
    await mirrorImpl.current?.setStageLock(lock);
  };

  const grantAdmin = async (account: string) => {
    await mirrorImpl.current?.grantRole(ethers.constants.HashZero, account);
  };

  const withdraw = async (amount: string) => {
    await mirrorImpl.current?.withdraw(ethers.utils.parseUnits(amount, 'wei'));
  };

  const airDrop = async (jsonList: string) => {
    if (mirrorImpl.current) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const addressRecords = JSON.parse(jsonList);
      const addresses = [];
      const quantities = [];
      for (const idx in addressRecords) {
        addresses.push(addressRecords[idx].Wallet);
        quantities.push(parseInt(addressRecords[idx].Quantity));
      }
      const totalNumberOfToken = quantities.reduce((prev, next) => prev + next);
      window.alert(
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        `addressLength: ${addressRecords.length}, totalNumberOfToken: ${totalNumberOfToken}`
      );
      const gasLimit = await mirrorImpl.current.estimateGas.batchAirdrop(
        addresses,
        quantities
      );
      console.log(gasLimit.toString());
      const ret = await (
        await mirrorImpl.current?.batchAirdrop(addresses, quantities, {
          gasLimit: gasLimit.mul(13).div(10)
        })
      ).wait();
      const addressTokenIdMap: { [key: string]: number[] } = {};
      if (ret.events) {
        ret.events.forEach((event: any) => {
          const address = event.args.payer ? event.args.payer : event.args[0];
          if (event.args && event.event === 'TokenMinted') {
            if (!addressTokenIdMap[address]) {
              addressTokenIdMap[address] = [];
            }
            addressTokenIdMap[address].push(
              event.args.tokenId
                ? event.args.tokenId.toNumber()
                : event.args[1].toNumber()
            );
          }
        });
      }

      console.log(addressTokenIdMap);
      window.alert(JSON.stringify(addressTokenIdMap));
    }
  };

  return (
    <div className={cn(styles.Content, className)}>
      <h2>Admin Actions</h2>
      <div className={styles.item}>
        <button onClick={connectAdminProvider}>Connect Admin Provider</button>
        <input
          onChange={(e) => setContractAddress(e.target.value)}
          placeholder="contract address"
        />
      </div>
      <div className={styles.item}>
        <button onClick={() => refreshAdminView()}>Refresh status</button>
        <div>Current contract address: {contractAddress} </div>
        <div>Current account isAdmin: {isAdmin ? 'true' : 'false'}</div>
        <div>AdminProvider connected: {adminConnected ? 'true' : 'false'} </div>
        <div>StageLock: {stageLock ? 'true' : 'false'}</div>
        <div>Paused: {paused ? 'true' : 'false'}</div>
      </div>
      <div className={styles.item}>
        {' '}
        <button onClick={() => setContractStageLock(stageLockInput === 'true')}>
          SetContractStageLock
        </button>
        <input
          onChange={(e) => setStageLockInput(e.target.value)}
          placeholder="true or false"
        />
      </div>
      <div className={styles.item}>
        {' '}
        <button onClick={() => airDrop(airDropList)}>airDrop</button>
        <input
          onChange={(e) => setAirDropList(e.target.value)}
          placeholder="json string"
        />
      </div>
      <div className={styles.item}>
        <button onClick={() => pause()}>PauseContract</button>
      </div>
      <div className={styles.item}>
        <button onClick={() => unpause()}>UnpauseContract</button>
      </div>
      <div className={styles.item}>
        {' '}
        <button onClick={() => grantAdmin(roleAddress)}>grantAdmin</button>
        <input
          onChange={(e) => setRoleAddress(e.target.value)}
          placeholder="account address"
        />
      </div>
      <div className={styles.item}>
        {' '}
        <button onClick={() => withdraw(withdrawAmount)}>Withdraw</button>
        <input
          onChange={(e) => setWithdrawAmount(e.target.value)}
          placeholder="amount in wei"
        />
      </div>

      <hr />
      <h2>SDK Demo</h2>
      <div className={styles.item}>
        <button onClick={getStockSupply}>get stockSupply</button>
        <div>res: {stockSupplyRes}</div>
      </div>

      <div className={styles.item}>
        <button onClick={getTokenPriceRes}>get tokenPrice</button>
        <div>res: {tokenPriceRes}</div>
      </div>

      <div className={styles.item}>
        {' '}
        <button onClick={() => getTokenInfoRes(tokenId)}>get tokenInfo</button>
        <input
          onChange={(e) => setTokenId(e.target.value)}
          placeholder="tokenId"
        />
        <div>res: {tokenInfoRes}</div>
      </div>

      <div className={styles.item}>
        <button onClick={() => getUsedPreOrderQuota(account)}>
          getUsedPreOrderQuota
        </button>
        <input
          onChange={(e) => setAccount(e.target.value)}
          placeholder="accountId"
        />
        <div>res: {usedPreOrderQuota}</div>
      </div>

      <div className={styles.item}>
        <button onClick={() => getAccountQuotaAndSignature(account)}>
          getAccountQuotaAndSignature
        </button>
        <input
          onChange={(e) => setAccount(e.target.value)}
          placeholder="accountId"
        />
        <div>res: {accountQuotaAndSignature}</div>
      </div>

      <div className={styles.item}>
        <button onClick={preOrder}>preOrder</button>
        <input
          type="text"
          onChange={(e) =>
            setOrderInfo({ ...orderInfo, quantity: e.target.value })
          }
          placeholder="quantity"
        />
        <input
          type="text"
          onChange={(e) =>
            setOrderInfo({ ...orderInfo, account: e.target.value })
          }
          placeholder="account"
        />
        <input
          type="text"
          onChange={(e) =>
            setOrderInfo({ ...orderInfo, quota: e.target.value })
          }
          placeholder="quota"
        />
        <input
          type="text"
          onChange={(e) =>
            setOrderInfo({ ...orderInfo, signature: e.target.value })
          }
          placeholder="signature"
        />
        <div>res: {preOrderRes}</div>
      </div>

      <div className={styles.item}>
        <button onClick={() => buy(quality)}>buy</button>
        <input
          onChange={(e) => setQuality(e.target.value)}
          placeholder="quality"
        />
        <div>res: {buyInfo}</div>
      </div>

      <div className={styles.item}>
        <button onClick={() => batchAirdrop(receivers, quantities)}>
          batchAirdrop
        </button>
        <input
          placeholder="receivers, 请用英文 , 分割"
          type="text"
          onChange={(e) => {
            const receivers = e.target.value.split(',');
            setReceivers(receivers);
          }}
        />
        <input
          placeholder="quantities"
          type="text"
          onChange={(e) => {
            const quantities = e.target.value
              .split(',')
              .map((item) => BigNumber.from(item));

            setQuantities(quantities);
          }}
        />
        <div>res: {batchAirdropRes}</div>
      </div>

      <div className={styles.item}>
        <button onClick={levelUp}>levelUp</button>
        <input
          onChange={(e) =>
            setLevelUpInfo({ ...levelUpInfo, tokenId: e.target.value })
          }
          placeholder="tokenId"
        />
        <input
          onChange={(e) =>
            setLevelUpInfo({ ...levelUpInfo, level: e.target.value })
          }
          placeholder="level"
        />
        <input
          onChange={(e) =>
            setLevelUpInfo({ ...levelUpInfo, signature: e.target.value })
          }
          placeholder="signature"
        />
        <div>res: {levelUpRes}</div>
      </div>

      <div className={styles.item}>
        <button onClick={() => queryTokenMintedEvent(fromBlock, toBlock)}>
          queryTokenMintedEvent
        </button>
        <button onClick={() => queryLevelUpEvent(fromBlock, toBlock)}>
          queryLevelUpEvent
        </button>
        <button onClick={() => queryTransferEvent(fromBlock, toBlock)}>
          queryTransferEvent
        </button>

        <input
          onChange={(e) => setFromBlock(e.target.value)}
          placeholder="fromBlock"
        />
        <input
          onChange={(e) => setToBlock(e.target.value)}
          placeholder="toBlock"
        />
        <div>res: {queryTokenMintedEventRes}</div>
      </div>

      <div className={styles.item}>
        <button onClick={signPreOrderMessage}>signPreOrderMessage</button>

        <input
          onChange={(e) =>
            setSignPreOrderMessageQuery({
              ...signPreOrderMessageQuery,
              privateKey: e.target.value
            })
          }
          placeholder="privateKey"
        />
        <input
          onChange={(e) =>
            setSignPreOrderMessageQuery({
              ...signPreOrderMessageQuery,
              account: e.target.value
            })
          }
          placeholder="account"
        />
        <input
          onChange={(e) =>
            setSignPreOrderMessageQuery({
              ...signPreOrderMessageQuery,
              quota: e.target.value
            })
          }
          placeholder="quota"
        />
        <div>res: {signPreOrderMessageRes}</div>
      </div>

      <div className={styles.item}>
        <button onClick={signLevelUpMessage}>signLevelUpMessage</button>
        <input
          onChange={(e) =>
            setSignLevelUpMessageQuery({
              ...signLevelUpMessageQuery,
              privateKey: e.target.value
            })
          }
          placeholder="privateKey"
        />
        <input
          onChange={(e) =>
            setSignLevelUpMessageQuery({
              ...signLevelUpMessageQuery,
              tokenId: e.target.value
            })
          }
          placeholder="tokenId"
        />
        <input
          onChange={(e) =>
            setSignLevelUpMessageQuery({
              ...signLevelUpMessageQuery,
              level: e.target.value
            })
          }
          placeholder="level"
        />

        <div>res: {signLevelUpMessageRes}</div>
      </div>

      <div className={styles.item}>
        <button onClick={getBlockNumber}>getBlockNumber</button>
        <div>res: {getBlockNumberRes}</div>
      </div>
    </div>
  );

  async function initProvider() {
    ethProvider.current = new ethers.providers.Web3Provider(window.ethereum);
    client.current = MirrorProvider(false);

    await client.current.connectProvider(CONTRACT_ADDRESS, ethProvider.current);

    const signer = ethProvider.current.getSigner();
    client.current.connectSigner(signer);

    client.current.setWaitConfirmations(1);
  }

  async function getStockSupply() {
    try {
      const res = await client.current?.stockSupply();
      setStockSupplyRes(res?.toString());
    } catch (e) {
      alert(JSON.stringify(e));
    }
  }

  async function getTokenPriceRes() {
    try {
      const res = await client.current?.tokenPrice();
      setTokenPriceRes(res?.toString());
    } catch (e) {
      alert(JSON.stringify(e));
    }
  }

  async function getTokenInfoRes(tokenId?: string) {
    try {
      const res = await client.current?.tokenInfo(BigNumber.from(tokenId));
      setTokenInfoRes(JSON.stringify(res));
    } catch (e) {
      alert(JSON.stringify(e));
    }
  }

  async function getUsedPreOrderQuota(accountId?: string) {
    if (!accountId) {
      alert('please input accountId');
      return;
    }

    try {
      const res = await client.current?.getUsedPreOrderQuota(accountId);
      setUsedPreOrderQuota(res?.toString());
    } catch (e) {
      alert(JSON.stringify(e));
    }
  }

  async function getAccountQuotaAndSignature(accountId?: string) {
    if (!accountId) {
      alert('please input accountId');
      return;
    }
    try {
      const res = await client.current?.getAccountQuotaAndSignature(accountId);
      setAccountQuotaAndSignature(JSON.stringify(res));
    } catch (e) {
      alert(JSON.stringify(e));
    }
  }

  async function preOrder() {
    try {
      const res = await client.current?.preOrder(
        BigNumber.from(orderInfo.quantity),
        orderInfo.account,
        BigNumber.from(orderInfo.quota),
        orderInfo.signature
      );
      setPreOrderRes(JSON.stringify(res));
    } catch (e) {
      alert(JSON.stringify(e));
    }
  }

  async function buy(quality?: string) {
    if (!quality) {
      alert('please input quality!');
      return;
    }
    try {
      const price = await client.current?.tokenPrice();

      if (!price) {
        alert('no price');
        return;
      }

      const res = await client.current?.buy(BigNumber.from(quality), {
        value: price.mul(quality)
      });
      setBuyInfo(JSON.stringify(res));
    } catch (e) {
      alert(JSON.stringify(e));
    }
  }

  async function batchAirdrop(receivers?: string[], quantities?: BigNumber[]) {
    if (receivers && quantities) {
      try {
        const res = await client.current?.batchAirdrop(receivers, quantities);
        setBatchAirdropRes(JSON.stringify(res));
      } catch (e) {
        alert(JSON.stringify(e));
      }
    } else {
      alert('please input receivers and quantities!');
    }
  }

  async function levelUp() {
    try {
      const res = await client.current?.levelUp(
        BigNumber.from(levelUpInfo.tokenId),
        BigNumber.from(levelUpInfo.level),
        levelUpInfo.signature
      );

      setLevelUpRes(JSON.stringify(res));
    } catch (e) {
      alert(JSON.stringify(e));
    }
  }

  async function queryTokenMintedEvent(fromBlock?: string, toBlock?: string) {
    if (fromBlock && toBlock) {
      try {
        const res = await client.current?.queryTokenMintedEvent(
          Number(fromBlock),
          Number(toBlock)
        );

        setQueryTokenMintedEventRes(JSON.stringify(res));
      } catch (e) {
        alert(JSON.stringify(e));
      }
    } else {
      alert('please input fromBlock and toBlock');
    }
  }

  async function queryLevelUpEvent(fromBlock?: string, toBlock?: string) {
    if (fromBlock && toBlock) {
      try {
        const res = await client.current?.queryLevelUpEvent(
          Number(fromBlock),
          Number(toBlock)
        );

        setQueryTokenMintedEventRes(JSON.stringify(res));
      } catch (e) {
        alert(JSON.stringify(e));
      }
    } else {
      alert('please input fromBlock and toBlock');
    }
  }

  async function queryTransferEvent(fromBlock?: string, toBlock?: string) {
    if (fromBlock && toBlock) {
      try {
        const res = await client.current?.queryTransferEvent(
          Number(fromBlock),
          Number(toBlock)
        );

        setQueryTokenMintedEventRes(JSON.stringify(res));
      } catch (e) {
        alert(JSON.stringify(e));
      }
    } else {
      alert('please input fromBlock and toBlock');
    }
  }

  async function signPreOrderMessage() {
    try {
      const res = await client.current?.signPreOrderMessage(
        signPreOrderMessageQuery.privateKey,
        signPreOrderMessageQuery.account,
        Number(signPreOrderMessageQuery.quota)
      );

      setSignPreOrderMessageRes(res);
    } catch (e) {
      alert(JSON.stringify(e));
    }
  }

  async function signLevelUpMessage() {
    try {
      const res = await client.current?.signLevelUpMessage(
        signLevelUpMessageQuery.privateKey,
        Number(signLevelUpMessageQuery.tokenId),
        Number(signLevelUpMessageQuery.level)
      );

      setSignLevelUpMessageRes(res);
    } catch (e) {
      alert(JSON.stringify(e));
    }
  }

  async function getBlockNumber() {
    try {
      const res = await client.current?.getBlockNumber();
      setGetBlockNumberRes(res);
    } catch (e) {
      alert(JSON.stringify(e));
    }
  }
}
