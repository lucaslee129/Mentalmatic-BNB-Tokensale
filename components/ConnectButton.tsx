import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import getTetherAmount from "../utils/getTetherAmount";
import TetherIco from '../assets/usdt.png'
import Notiflix from "notiflix";
import Approve from "../utils/Approve";

import BuyToken from "../utils/BuyToken";
import { useEffect, useState } from "react";

const ConnectBtn = (props: any) => {

  const [tetherAmount, setTetherAmount] = useState("0");
  const [isConnected, setIsConnected] = useState(false);
  const [btnText, setBtnText] = useState("Approve");
  
  useEffect(() => 
    {
      const func = async () => {
        const amount = await getTetherAmount();
        console.log("Amount>>>", amount);
        setTetherAmount(String(amount));
        if(props.isApproved) {
          setBtnText("Buy Tokens");
        } else {
          setBtnText("Approve");
        }
      }
      if(isConnected) {
        func();
      }
    }, [isConnected, props.isApproved]);

  const handleBuyToken = () => {
    console.log(props.isApproved)
    if(props.isApproved) {
      console.log("ere is Buy Tokens Function")
      BuyToken(props);
    } else  {
      console.log("Here is Approve function");
      Approve(props);
    }
  }
  
  try{
    return (
        <ConnectButton.Custom>
          {({
            account,
            chain,
            openAccountModal,
            openChainModal,
            openConnectModal,
            authenticationStatus,
            mounted,
          }) => {
            // Note: If your app doesn't use authentication, you
            // can remove all 'authenticationStatus' checks
            const ready = mounted && authenticationStatus !== "loading";
            const connected =
              ready &&
              account &&
              chain &&
              (!authenticationStatus || authenticationStatus === "authenticated");

            return (
              <div
                {...(!ready && {
                  "aria-hidden": true,
                  style: {
                    opacity: 0,
                    pointerEvents: "none",
                    userSelect: "none",
                  },
                })}
                className={styles.globals}
              >
                {(() => {
                  if (!connected) {
                    return (
                      <button
                        onClick={openConnectModal}
                        type="button"
                        className={styles.connect_button}
                      >
                        Connect Wallet to Buy
                      </button>
                    );
                  }

                  if(connected){
                    setIsConnected(true);
                    props.handleConnect()
                  }

                  if (chain.unsupported) {
                    return (
                      <button
                        onClick={openChainModal}
                        type="button"
                        className={styles.connect_button}
                      >
                        Wrong network
                      </button>
                    );
                  }

                  return (
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                        <button
                          onClick={openChainModal}
                          type="button"
                          className={styles.chain_button}
                        >
                          {chain.hasIcon && (
                            <div
                              style={{
                                background: chain.iconBackground,
                                width: 30,
                                height: 30,
                                borderRadius: 999,
                                overflow: "hidden",
                                marginRight: 4,
                              }}
                            >
                              {chain.iconUrl && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  alt={chain.name ?? "Chain icon"}
                                  src={chain.iconUrl}
                                  style={{ width: 30, height: 30 }}
                                />
                              )}
                            </div>
                          )}
                          {chain.name}
                        </button>

                        <button
                          onClick={openAccountModal}
                          type="button"
                          className={styles.account_button}
                        >
                          <span>
                            {tetherAmount}
                          </span>
                          <div className={styles.account}>
                            {account.ensAvatar ? (
                              account.ensAvatar
                            ) : (
                              <div
                                style={{
                                  padding: "5px",
                                  borderRadius: "9999px",
                                }}
                              >
                                <img
                                  className="bg-[url('../assets/usdt.png')] bg-contain p-3"
                                  style={{ width: 30, height: 30 }}
                                />
                              </div>
                            )}
                            Tether
                          </div>
                        </button>
                      </div>
                      <div className="flex justify-center gap-3 item-center w-full ">
                        <button
                            onClick={handleBuyToken}
                            type="button"
                            className={styles.buy_button}
                          >
                            {btnText}
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            );
          }}
        </ConnectButton.Custom>
    );
  } catch(error: any) {
    const errorMessage = error.message;
    const rejectError = "User rejected the request.";
    const requireError = "reverted with the following reason";
    if(errorMessage.includes(rejectError)) {
      Notiflix.Notify.failure("User rejected the request.");
    } else if(errorMessage.includes(requireError)) {
      const errMsg = error.message.match(/reverted with the following reason:\n(.*?)\n/)[1];
      Notiflix.Notify.failure(errMsg);
    }
  }
};

export default ConnectBtn;
