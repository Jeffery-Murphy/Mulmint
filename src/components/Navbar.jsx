import React, { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import { connectWallet, disconnectWallet, clearWalletState, clearTransaction, clearTransactionState, clearAddress } from "../redux/slices"
import { useSelector, useDispatch } from "react-redux"
import ReactLoading from "react-loading";
import Notification from "./Notification";

function Navbar() {
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(false)
  const walletState = useSelector((state) => state.wallet.walletState)
  const address = useSelector((state) => state.wallet.address)
  const _transaction = useSelector((state) => state.wallet.transaction);

  const connectWalletHandler = () => {
    dispatch(connectWallet());
  };

  const disconnectWalletHandle = () => {
    setLoading(true);
    setTimeout(() => {
      dispatch(clearWalletState());
      dispatch(clearTransaction());
      dispatch(clearTransactionState());
      dispatch(clearAddress());
      setLoading(false);
      Notification({ message: "Wallet disconnected successfully." });
    }, 3000);
  };

  useEffect(() => {
    if(walletState?.success && walletState?.status === "connection" && !_transaction){
      Notification({ message: walletState?.message });
    }
  }, [walletState?.success, _transaction?.transaction]);


  return (
    <>
    <nav className="w-full fixed z-20 top-0 start-0" style={{background: '#041436'}}>
      <nav style={{borderColor: '#152344', borderBottomWidth: 1}}>
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-3">
          <a className="flex items-center space-x-3 rtl:space-x-reverse">
            <img src={logo} className="h-8 lg:h-12" alt="Mula Mint" />
          </a>
          {
            address || _transaction ? 
            <button
            onClick={disconnectWalletHandle}
            type="button"
            style={{background: '#50b54d'}}
            className="rounded-sm  py-[8px] w-36 lg:w-40 lg:py-2 flex-row flex items-center justify-center space-x-1"
            >
            <svg
              className="w-4 h-4 lg:me-2 -ms-1 text-white"
              aria-hidden="true"
              focusable="false"
              data-prefix="fab"
              data-icon="wallet"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
              >
              <path
                fill="currentColor"
                d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"
                ></path>
            </svg>
            {
              loading ? <ReactLoading
              type={"bars"}
              color={"white"}
              height={20}
              width={20}
              /> :
              <span className="text-[14px] text-white">Disconnect Wallet</span>
            }
          </button> : <button
            onClick={connectWalletHandler}
            type="button"
            className="bg-gray-100 rounded-sm  py-[8px] w-36 lg:w-40 lg:py-2 flex-row flex items-center justify-center space-x-1"
            >
            <svg
              className="w-4 h-4 lg:me-2 -ms-1 text-[#626890]"
              aria-hidden="true"
              focusable="false"
              data-prefix="fab"
              data-icon="wallet"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
              >
              <path
                fill="currentColor"
                d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"
                ></path>
            </svg>
            {
              walletState?.loading ? <ReactLoading
              type={"bars"}
              color={"#041436"}
              height={20}
              width={20}
              /> :
              <span className="text-[14px] text-gray-900">Connect Wallet</span>
            }
          </button>
          }
        </div>
      </nav>
      <nav className="">
        <div className="max-w-screen-xl px-4 py-3 mx-auto">
          <div className="flex items-center">
            <ul className="flex flex-row font-medium mt-0 space-x-8 rtl:space-x-reverse text-sm">
              <li>
                <a
                  href="#"
                  className="text-gray-400 uppercase text-[12px] hover:underline"
                  aria-current="page"
                  >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 uppercase text-[12px] hover:underline"
                  >
                  Contribute
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 uppercase text-[12px] hover:underline"
                  >
                  Buy Token
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 text-[12px] uppercase hover:underline"
                  >
                  Sell Token
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </nav>
    </>
  );
}

export default Navbar;
