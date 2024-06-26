import { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import ConnectBtn from '../components/ConnectButton';
import InputForm from '../components/InputForm';
import getRoundBalance from '../utils/getRoundBalance';
import Notiflix from 'notiflix';
require('dotenv').config();

const Home: NextPage = () => {
  const [coinAmount, setCoinAmount] = useState(0);
  const [tokenAmount, setTokenAmount] = useState(0);
  const [saleStage, setSaleStage] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [roundBalance, setRoundBalance] = useState(0);
  const [approveState, setApproveState] = useState(0); // 0: Non-approved, 1: Approved, 2:over-amount
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const func = async () => {
      const amount: any = await getRoundBalance();
      setRoundBalance(amount);
      const saleStageTemp: number = Number(process.env.NEXT_PUBLIC_SALESTAGE);
      let totalUsdt = 0;
      let currentPrice = 0;
      setSaleStage(saleStageTemp);

      switch (saleStageTemp) {
        case 1:
          totalUsdt = 160000;
          currentPrice = 0.002;
          break;
        case 2:
          totalUsdt = 200000;
          currentPrice = 0.004;
          break;
        case 3:
          totalUsdt = 560000;
          currentPrice = 0.007;
          break;
        case 4:
          totalUsdt = 300000;
          currentPrice = 0.01;
          break;
        default:
          totalUsdt = 0;
          currentPrice = 0;
          break;
      }

      const spentUsdt =
        Number(totalUsdt) -
        Number((currentPrice * Number(amount) * 10 ** -18).toFixed(0)) +
        5000;
      const data = {
        saleStage: saleStageTemp,
        spentUsdt: spentUsdt,
      };
      window.parent.postMessage(data, '*');
    };
    if (isConnected) {
      func();
    }
  }, [isConnected, coinAmount, tokenAmount]);

  const handleConnect = () => {
    setIsConnected(true);
  };

  const convert = async (value: number, flag: boolean) => {
    if (saleStage == 1) {
      if (flag == true) {
        return value * 500;
      } else {
        return (value * 2) / 1000;
      }
    } else if (saleStage == 2) {
      if (flag == true) {
        return value * 250;
      } else {
        return (value * 4) / 1000;
      }
    } else if (saleStage == 3) {
      if (flag == true) {
        return (value * 1000) / 7;
      } else {
        return (value * 7) / 1000;
      }
    } else if (saleStage == 4) {
      if (flag == true) {
        return value * 100;
      } else {
        return value / 100;
      }
    } else {
      return 0;
    }
  };

  const checkOverFlow = (tokenAmount: number) => {
    if (saleStage == 1 && tokenAmount >= roundBalance) {
      console.log('Less than 80000000');
      return { flag: false, value: roundBalance };
    } else if (saleStage == 2 && tokenAmount >= roundBalance) {
      console.log('Less than 130000000');
      return { flag: false, value: roundBalance };
    } else if (saleStage == 3 && tokenAmount >= roundBalance) {
      console.log('Less than 210000000');
      return { flag: false, value: roundBalance };
    } else if (saleStage == 4 && tokenAmount >= roundBalance) {
      console.log('Less than 240000000');
      return { flag: false, value: roundBalance };
    } else if (saleStage == 0) {
      console.log('TokenSale is Over');
      return { flag: false, value: 0 };
    } else {
      return { flag: true, value: tokenAmount };
    }
  };

  const handleCoinChage = async (event: any) => {
    const newCoinAmount = event.target.value;
    const newTokenAmount = await convert(newCoinAmount, true);
    const checkedToken = checkOverFlow(newTokenAmount); // Check if added token amount overflows scope of current stage
    if (checkedToken.flag) {
      setCoinAmount(newCoinAmount);
      setTokenAmount(newTokenAmount);
    } else {
      setCoinAmount(await convert(checkedToken.value, false)); // Token -> Coin : false
      setTokenAmount(checkedToken.value);
      Notiflix.Notify.warning(
        'Your Token amount is overflow of this stage price scope'
      );
    }
  };

  const handleTokenChange = async (event: any) => {
    const newTokenAmount = event.target.value;
    const newCoinAmount = await convert(newTokenAmount, false);
    const checkedToken = checkOverFlow(Number(newTokenAmount)); // Check if added token amount overflows scope of current stage
    if (checkedToken.flag == true) {
      setCoinAmount(newCoinAmount);
      setTokenAmount(newTokenAmount);
    } else {
      console.log('This is False');
      setCoinAmount(await convert(checkedToken.value, false)); // Token -> Coin : false
      setTokenAmount(checkedToken.value);
      Notiflix.Notify.warning(
        'Your Token amount is overflow of this stage price scope'
      );
    }
  };

  const handleApproveChange = (_approveState: number) => {
    setApproveState(_approveState);
  };

  const handleErrorMessage = (errMsg: string) => {
    setErrorMessage(errMsg);
    console.log(errMsg);
  };

  return (
    <div className="box-sizing justify-center mx-auto w-1/4 mt-[55vh] md:mt-[65vh]">
      <div className="flex flex-col items-center gap-1 sm:flex-row sm:justify-center sm:gap-6">
        <InputForm
          id="usdt"
          isConnected={isConnected}
          value={coinAmount}
          onChange={handleCoinChage}
          approveState={approveState}
        />
        <InputForm
          id="dolphin"
          isConnected={isConnected}
          value={tokenAmount}
          onChange={handleTokenChange}
          approveState={approveState}
        />
      </div>
      <p className="flex text-base text-red-800 justify-center items-center">
        {errorMessage}
      </p>
      <div className="flex justify-center gap-5">
        <ConnectBtn
          handleConnect={handleConnect}
          coinAmount={coinAmount}
          tokenAmount={tokenAmount}
          handleApproveChange={handleApproveChange}
          handleErrorMessage={handleErrorMessage}
          approveState={approveState}
        />
      </div>
    </div>
  );
};

export default Home;
