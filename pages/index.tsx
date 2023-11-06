import { useEffect, useState } from "react";
import type { NextPage } from "next";
import ConnectBtn from "../components/ConnectButton";
import InputForm from "../components/InputForm";
import getRoundBalance from "../utils/getRoundBalance";
import Notiflix from 'notiflix';
require('dotenv').config();

const Home: NextPage = () => {

  const [coinAmount, setCoinAmount] = useState(0);
  const [tokenAmount, setTokenAmount] = useState(0);
  const [saleStage, setSaleStage] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [roundBalance, setRoundBalance] = useState(0);

  useEffect(() => 
    {
      const func = async () => {
        const amount: any = await getRoundBalance();
        setRoundBalance(amount);
        const saleStageTemp: number = Number(process.env.NEXT_PUBLIC_SALESTAGE);
        setSaleStage(saleStageTemp);
        console.log("Sale Stage>>>", saleStage);
        // @desc Code for posting data to wix site. but don't work due to not published page
        window.parent.postMessage(saleStageTemp, '*');
        console.log(typeof saleStage);
        console.log("saleStage>>>>>>", saleStage);
      }
      if(isConnected) {
        func();
      }
    }, [isConnected]);

    const handleConnect = () => {
      setIsConnected(true);
    }

  const convert = async (value : number, flag : boolean) => {

    if(saleStage == 1) {
      if(flag == true){
        return value *  500;
      } else {
        return value * 2 / 1000;
      } 
    } else if (saleStage == 2) {
      if(flag == true){
        return value * 250;
      } else {
        return value * 4 / 1000;
      } 
    } else if (saleStage == 3) {
      if(flag == true){
        return value * 1000 / 7;
      } else {
        return value * 7 / 1000;
      } 
    } else if(saleStage == 4){
      if(flag == true){
        return value * 100;
      } else {
        return value / 100;
      }  
    } else {
      return 0;
    }
  }

  const checkOverFlow = (tokenAmount: number) => {
    if((saleStage == 1) && (tokenAmount >= roundBalance)) {
      console.log("Less than 80000000");
      return { flag: false, value: roundBalance}
    } else if ((saleStage == 2) && (tokenAmount >= roundBalance) ) {
      console.log("Less than 130000000");
      return { flag: false, value: roundBalance}
    } else if ((saleStage == 3) && (tokenAmount >= roundBalance) ) {
      console.log("Less than 210000000");
      return { flag: false, value: roundBalance}
    } else if ((saleStage == 4) && (tokenAmount >= roundBalance) ) {
      console.log("Less than 240000000");
      return { flag: false, value: roundBalance}
    } else if (saleStage == 0) {
      console.log("TokenSale is Over");
      return { flag: false, value: 0}
    } else {
      return { flag: true, value: tokenAmount}
    }
  }

  const handleCoinChage = async(event: any) => {
    const newCoinAmount = event.target.value;
    const newTokenAmount = await convert(newCoinAmount, true);
    const checkedToken = checkOverFlow(newTokenAmount); // Check if added token amount overflows scope of current stage
    if(checkedToken.flag) {
      setCoinAmount(newCoinAmount);
      setTokenAmount(newTokenAmount);
    } else {
      setCoinAmount(await convert(checkedToken.value, false)); // Token -> Coin : false
      setTokenAmount(checkedToken.value);
      Notiflix.Notify.warning("Your Token amount is overflow of this stage price scope");
    }
  }

  const handleTokenChange = async (event: any) => {
    const newTokenAmount = event.target.value;
    const newCoinAmount = await convert(newTokenAmount, false);
    const checkedToken = checkOverFlow(Number(newTokenAmount)); // Check if added token amount overflows scope of current stage
    if(checkedToken.flag == true) {
      setCoinAmount(newCoinAmount);
      setTokenAmount(newTokenAmount);
    } else {
      console.log("This is False");
      setCoinAmount(await convert(checkedToken.value, false)); // Token -> Coin : false
      setTokenAmount(checkedToken.value);
      Notiflix.Notify.warning("Your Token amount is overflow of this stage price scope");
    }
  }
  
  return (
    <div className="box-sizing justify-center mx-auto w-1/4 mt-[65vh] ">
      <div className="flex justify-center gap-1">
        <InputForm id="usdt" isConnected = {isConnected} value = {coinAmount} onChange = {handleCoinChage} />
        <InputForm id="dolphin" isConnected={isConnected} value= {tokenAmount} onChange = {handleTokenChange} />
      </div>
      <div className="flex justify-center gap-5">
        <ConnectBtn handleConnect = {handleConnect} coinAmount={coinAmount} tokenAmount={tokenAmount} />
      </div>
    </div>
  );
};

export default Home;
