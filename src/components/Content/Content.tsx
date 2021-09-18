import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { BigNumber, ethers } from 'ethers';
import {
  MirrorClient,
  MirrorProvider,
  DeploymentInfo
} from '@white-matrix/nft-mirror-sdk';

import styles from './Content.module.less';
interface ContentProps {
  className?: string;
}

export const CONTRACT_ADDRESS = DeploymentInfo.rinkeby.mirror.proxyAddress;

export function Content(props: ContentProps) {
  const { className } = props;
  const ethProvider = useRef<ethers.providers.Web3Provider>();
  const client = useRef<MirrorClient>();

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

  const [getBlockNumberRes, setgetBlockNumberRes] = useState<number>();
  useEffect(() => {
    ethProvider.current = new ethers.providers.Web3Provider(window.ethereum);
    client.current = MirrorProvider(false);

    client.current.connectProvider(CONTRACT_ADDRESS, ethProvider.current);

    const signer = ethProvider.current.getSigner();
    client.current.connectSigner(signer);

    client.current.setWaitConfirmations(1);
  }, []);

  return (
    <div className={cn(styles.Content, className)}>
      <div className={styles.item}>
        <button onClick={getStockSupply}>get stockSupply</button>
        <div>res: {stockSupplyRes}</div>
      </div>

      <div className={styles.item}>
        <button onClick={getTokenPriceRes}>get tokenPrice</button>
        <div>res: {tokenPriceRes}</div>
      </div>

      <div className={styles.item}>
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

      <div>signPreOrderMessage</div>

      <div>signLevelUpMessage</div>

      <div className={styles.item}>
        <button onClick={getBlockNumber}>getBlockNumber</button>
        <div>res: {getBlockNumberRes}</div>
      </div>
    </div>
  );

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

  async function getBlockNumber() {
    if (fromBlock && toBlock) {
      try {
        const res = await client.current?.getBlockNumber();

        setgetBlockNumberRes(res);
      } catch (e) {
        alert(JSON.stringify(e));
      }
    } else {
      alert('please input fromBlock and toBlock');
    }
  }
}
