import React, { useEffect, useState } from "react";
import {
  settings,
  transaction,
  clearTransactionState,
  clearWalletState,
} from "../redux/slices";
import { useSelector, useDispatch } from "react-redux";
import ReactLoading from "react-loading";
import Web3 from "web3";
import mulaMintABI from "../contract/MulaMint.json";
import Notification from "../components/Notification";
import bnb from "../assets/bnb.png";
import usd from "../assets/usd.png";
import client from "../sanity";

function HomePage() {
  const dispatch = useDispatch();

  const [claiming, setClaiming] = useState(false);
  const [_claiming, set_Claiming] = useState(true);

  const address = useSelector((state) => state.wallet.address);
  const transactionState = useSelector(
    (state) => state.wallet.transactionState
  );
  const _transaction = useSelector((state) => state.wallet.transaction);

  const portal = useSelector((state) => state.wallet.settingsState);

  useEffect(() => {
    dispatch(settings());
  }, []);

  useEffect(() => {
    if (portal){
      set_Claiming(portal.settings?.claimButtonEnabled)
    }
  }, [portal])

  useEffect(() => {
    if (address) {
      setTimeout(() => {
        dispatch(transaction(address));
      }, 3000);
    }
  }, [address]);

  // Convert deposite currency to either USD or BNB
  useEffect(() => {
    const convertCurrency = async () => {
      const conversionRateUSDToBNB = 0.0044;
      const conversionRateBNBToUSD = 1;

      if (_transaction) {
        if (_transaction.currency === "Bnb") {
          const usdAmount =
            _transaction?.transaction?.amount * conversionRateBNBToUSD;
          setConvertedAmount(usdAmount);
          setConversionRate(`1 BNB = ${conversionRateBNBToUSD} USD`);
        } else if (_transaction?.transaction?.currency === "USD") {
          const bnbAmount =
            _transaction?.transaction?.amount * conversionRateUSDToBNB;
          setConvertedAmount(bnbAmount);
          setConversionRate(`1 USD = ${conversionRateUSDToBNB} BNB`);
        }
      }
    };

    convertCurrency();
  }, [_transaction?.transaction]);

  /**
   * Claiming mula mint token from the smart contract
   * updating sanity.io db after successful claiming mula mint token
   */
  const handleClaimToken = async () => {
    try {
      setClaiming(true);
      const currentTimestamp = Date.now();
      const isoDateString = new Date(currentTimestamp).toISOString();
      const web3 = new Web3(window.ethereum);
      const contractAddress = "0x4f6c111358d063fe8F2b6aBc0ce357bdBe51fcf1";
      const contract = new web3.eth.Contract(mulaMintABI.abi, contractAddress);

      const bnbInvestedInWei = web3.utils.toWei(
        (_transaction?.transaction?.bnb).toString(),
        "wei"
      );
      const usdInvestedInWei = web3.utils.toWei(
        _transaction?.transaction?.amount.toString(),
        "wei"
      );
      const mulaValueInvestedInWei = web3.utils.toWei(
        _transaction?.transaction?.mulaValue.toString(),
        "wei"
      );


      const gasPriceWei = await web3.eth.getGasPrice();
      const gasPriceGwei = web3.utils.fromWei(gasPriceWei, "wei");

      const gasEstimate = await contract.methods
        .claim(bnbInvestedInWei, usdInvestedInWei, mulaValueInvestedInWei)
        .estimateGas({ from: address, value: mulaValueInvestedInWei });

      const claimResponse = await contract.methods
        .claim(bnbInvestedInWei, usdInvestedInWei, mulaValueInvestedInWei)
        .send({
          from: address,
          gas: gasEstimate,
          gasPrice: gasPriceWei,
          value: mulaValueInvestedInWei,
        });

      const claimedMulaMint =
        claimResponse.events.ClaimedMulaMint.returnValues._claimed;

      if (claimedMulaMint > 0) {
        await client
          .patch(_transaction?.transaction?._id)
          .set({
            status: "claimed",
            mulMint: _transaction?.transaction?.mulaValue,
            transactionHash: claimResponse.transactionHash.toString(),
            claimedTimestamp: isoDateString,
          })
          .commit();
        Notification({
          message:
            "Claim successful! Your wallet's tokens have been claimed. Thank you!",
        });
        setTimeout(() => {
          dispatch(transaction(address));
        }, 0);
      }
    } catch (error) {
      console.error(error);
      Notification({
        message: `${error}`,
      });
    } finally {
      setClaiming(false);
    }
  };

  return (
    <div className="mx-auto max-w-screen-xl pt-36 lg:pt-28">
      <div className="px-4 mx-auto flex-1 max-w-screen-xl lg:py-16 lg:grid lg:grid-cols-5 gap-8 lg:gap-16">
        <div className="flex flex-col col-span-3 justify-start">
          <h1 className="mb-4 text-lg font-extrabold tracking-tight leading-none text-white md:text-xl lg:text-xl">
            Mula Token Claim
          </h1>
          <h1 className="text-3xl font-extrabold tracking-tight leading-none text-white md:text-4xl lg:text-4xl">
            A Wallet Built For The Everyday Person
          </h1>
          <p className="mb-6 mt-2 text-[15px] text-justify font-normal text-white lg:text-md">
            The Mula wallet is an easy-to-use multi-chain and multi-currency
            wallet that gives your complete control <br /> over your assets.
          </p>
          <p className="mb-2 text-[15px] font-normal text-justify text-white lg:text-m">
            As a SEED investor in mula wallet, you have access to the base
            features of mula wallet and more perks within the wallet app.
          </p>
          <div className="mb-8">
            <p className="text-[15px]"> - Basic self custody wallet</p>
            <p className="text-[15px]"> - Chat and send</p>
            <p className="text-[15px]">
              {" "}
              - Cassava Trading Signal (Premium access for SEED investors - TNCs
              apply)
            </p>
            <p className="text-[15px]">
              {" "}
              - Shop gift card purchase (with x3 on rewards for SEED
              INVESTORS - TNCs apply )
            </p>
          </div>
          <div className="grid gap-3 grid-cols-3 lg:grid-cols-4">
            <div
              className="py-2 justify-center items-centertext-base font-medium text-center text-white rounded-sm hover:bg-[#d8a83f]"
              style={{ background: "#d8a83f" }}
            >
              <h1 className="lg:text-lg text-sm">250,000</h1>
              <p className="text-[12px] font-normal text-white uppercase lg:text-[12px]">
                Hard Cap
              </p>
            </div>
            <div
              className="py-2 justify-center items-center text-base font-medium text-center text-white rounded-sm hover:bg-[#55b248]"
              style={{ background: "#55b248" }}
            >
              <h1 className="lg:text-lg text-sm">0.025</h1>
              <p className="text-[12px] font-normal text-white uppercase lg:text-[12px]">
                Rate
              </p>
            </div>
            <div
              className="py-2 justify-center items-center  text-base font-medium text-center text-white rounded-sm hover:bg-[#d8a83f]"
              style={{ background: "#379ce5" }}
            >
              <h1 className="lg:text-lg text-sm">500</h1>
              <p className="text-[12px] font-normal text-white uppercase lg:text-[12px]">
                Min Inv
              </p>
            </div>
            <div
              className="py-2 justify-center items-center text-base font-medium text-center text-white rounded-sm hover:bg-[#55b248]"
              style={{ background: "#55b248" }}
            >
              <h1 className="text-sm lg:text-lg">7,500</h1>
              <p className="text-[12px] font-normal uppercase text-white lg:text-[12px]">
                Max Inv
              </p>
            </div>
          </div>
          { !_claiming && (
            <div className="lg:py-8 mt-8 text-center z-10 relative">
              <a
                href="#"
                className="flex items-start lg:items-center py-2 px-1 pe-4 text-sm bg-[#152344] rounded-sm"
              >
                <span className="text-xs bg-blue-600 rounded-sm text-white lg:px-4 px-1 py-2.5 ml-[2px] me-3">
                  Mula Token Claim
                </span>
                <span className="text-sm text-justify font-normal">
                  Once the verification is complete, you'll be able to claim
                  your tokens.
                </span>
              </a>
            </div>
          )}
        </div>
        <div className="lg:-mt-8 lg:mb-0 mb-4 lg:col-span-2">
          <div
            className="w-full flex-row rounded-sm shadow mt-8 xl:mt-0"
            style={{ background: "#152344" }}
          >
            <h1
              style={{ fontSize: 12 }}
              className="bg-gray-700 uppercase justify-center mx-auto text-center rounded-sm py-3 mb-2"
            >
              conversion rate
            </h1>
            <div className="flex-row flex justify-between p-2">
              <div className="flex-row flex space-x-2">
                <img src={usd} alt="usd" className="w-5 h-5" />
                <div>
                  <h1
                    className="font-medium text-md lg:text-[14px]"
                    style={{ fontSize: 16 }}
                  >
                    Dollar <span className="text-sm">(USDT)</span>
                  </h1>
                  <p className="text-xs font-medium text-gray-400">
                    −0.13 (0.04%)
                  </p>
                </div>
              </div>
              <span className="text-xs">1 (USDT) - 0.0033 (BNB)</span>
            </div>
            <div className="flex-row flex justify-between p-2">
              <div className="flex-row flex space-x-2">
                <img src={bnb} alt="usd" className="w-5 h-5" />
                <div>
                  <h1
                    className="font-medium text-md lg:text-[16px]"
                    style={{ fontSize: 16 }}
                  >
                    Binance <span className="text-sm">(BNB)</span>
                  </h1>
                  <p className="text-xs font-medium text-gray-400">
                    0.00 (0.03%)
                  </p>
                </div>
              </div>
              <span className="text-xs">1 (BNB) - 302.78 (USDT)</span>
            </div>
          </div>

          {_transaction?.transaction && (
            <div
              className="w-full flex-row rounded-sm p-2 shadow mt-4 xl:mt-4"
              style={{ background: "#152344" }}
            >
              <div>
                <p
                  style={{ fontSize: 12 }}
                  className="text-sm text-gray-400 md:text-sm lg:text-sm font-normal uppercase"
                >
                  Deposited amount
                </p>
                <div className="flex-row justify-between flex">
                  <h1
                    style={{ fontSize: 14 }}
                    className="text-gray-200 text-lg"
                  >
                    {_transaction?.transaction?.amount}{" "}
                  </h1>
                </div>
              </div>

              <div>
                <p
                  style={{ fontSize: 12 }}
                  className="text-sm mt-2 text-gray-400 md:text-sm lg:text-sm font-normal uppercase"
                >
                  Deposited currency
                </p>
                <div className="flex-row justify-between flex">
                  <h1
                    style={{ fontSize: 14 }}
                    className="text-gray-200 text-lg"
                  >
                    {_transaction?.transaction?.currency}
                  </h1>
                </div>
              </div>
              <div>
                <p
                  style={{ fontSize: 12 }}
                  className="text-sm mt-2 text-gray-400 md:text-sm lg:text-sm font-normal uppercase"
                >
                  USD Equivalent
                </p>
                <div className="flex-row justify-between flex">
                  <h1
                    style={{ fontSize: 14 }}
                    className="text-gray-200 text-lg"
                  >
                    $ {_transaction?.transaction?.usd}
                  </h1>
                </div>
              </div>
              <div>
                <p
                  style={{ fontSize: 12 }}
                  className="text-sm mt-2 text-gray-400 md:text-sm lg:text-sm font-normal uppercase"
                >
                  Mula Value
                </p>
                <div className="flex-row justify-between flex">
                  <h1
                    style={{ fontSize: 14 }}
                    className="text-gray-200 text-lg"
                  >
                    {_transaction?.transaction?.mulaValue}
                  </h1>
                </div>
              </div>
            </div>
          )}
          {_transaction?.transaction?.status === "pending" && (
            <div>
              {portal?.settings?.claimButtonEnabled ? (
                <button
                  disabled={claiming ? true : false}
                  onClick={handleClaimToken}
                  style={{ background: "#d8a83f", color: "#041436" }}
                  className="my-4 flex  justify-center w-full py-3 lg:py-3 rounded-sm font-medium text-[12px]"
                >
                  {claiming ? (
                    <>
                      <ReactLoading
                        type={"bars"}
                        color={"white"}
                        height={20}
                        width={20}
                      />
                    </>
                  ) : (
                    <>Claim token</>
                  )}
                </button>
              ) : (
                <button
                  disabled={true}
                  style={{ color: "#041436" }}
                  className="my-4 flex bg-gray-700 justify-center w-full py-3 lg:py-3 rounded-sm font-medium text-[12px]"
                >
                  Claim token
                </button>
              )}
            </div>
          )}
          {address && _transaction?.transaction?.status === "claimed" && (
            <div
              className="w-full flex-row rounded-sm p-2 shadow my-4 xl:mt-4"
              style={{ background: "#152344" }}
            >
              <div>
                <p
                  style={{ fontSize: 12 }}
                  className="text-sm text-gray-400 md:text-sm lg:text-sm font-normal uppercase"
                >
                  Amount claimed
                </p>
                <h1 style={{ fontSize: 14 }} className="text-gray-200 text-lg">
                  {_transaction?.transaction?.mulaValue}{" "}
                  <span className="text-xs uppercase">mulmint</span>
                </h1>
              </div>
              <div className="mt-2">
                <p
                  style={{ fontSize: 12 }}
                  className="text-sm text-gray-400 uppercase"
                >
                  Block Hash(ID)
                </p>
                <div className="flex-row flex items-center justify-between">
                  <h1
                    style={{ fontSize: 13, wordBreak: "break-all" }}
                    className="text-gray-200 w-[80%] text-lg"
                  >
                    {_transaction?.transaction?.transactionHash}
                  </h1>
                  <svg
                    className="w-4 h-4 hover:cursor text-gray-500"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 18 20"
                  >
                    <path d="M5 9V4.13a2.96 2.96 0 0 0-1.293.749L.879 7.707A2.96 2.96 0 0 0 .13 9H5Zm11.066-9H9.829a2.98 2.98 0 0 0-2.122.879L7 1.584A.987.987 0 0 0 6.766 2h4.3A3.972 3.972 0 0 1 15 6v10h1.066A1.97 1.97 0 0 0 18 14V2a1.97 1.97 0 0 0-1.934-2Z" />
                    <path d="M11.066 4H7v5a2 2 0 0 1-2 2H0v7a1.969 1.969 0 0 0 1.933 2h9.133A1.97 1.97 0 0 0 13 18V6a1.97 1.97 0 0 0-1.934-2Z" />
                  </svg>
                </div>
              </div>
              <div className="mt-2">
                <p
                  style={{ fontSize: 12 }}
                  className="text-sm text-gray-400 uppercase"
                >
                  Date
                </p>
                <h1 style={{ fontSize: 14 }} className="text-gray-200 text-lg">
                  {_transaction?.transaction?.claimedTimestamp}
                </h1>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
