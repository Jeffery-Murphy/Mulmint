import Web3 from "web3";
import client from "../sanity";

const services = {
  // Connect Wallet
  connectWallet: async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const web3Instance = new Web3(window.ethereum);
        const accounts = await web3Instance.eth.getAccounts();
        const response = {
          message:
            "Wallet connection successfully, wait transaction loading...",
          address: accounts[0],
        };
        return response;
      } catch (error) {
        console.error("Error connecting wallet:", error);
        return {
          message: `Wallet connection failed, ${error.message}. Try again.`,
        };
      }
    } else {
      return {
        message:
          "Unable to connect! Please make sure MetaMask is installed and properly configured.",
      };
    }
  },

  // Disconnect wallet
  disconnectWallet: async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({
          method: "wallet_requestPermissions",
          params: [
            {
              eth_accounts: {},
            },
          ],
        });
        return {
          error: false,
          success: true,
          message: "Wallet disconnected successfully.",
        };
      } catch (error) {
        console.error("Error disconnecting wallet:", error);
        return {
          error: true,
          success: false,
          message: `Wallet disconnection failed. Try again.`,
        };
      }
    } else {
      return {
        message:
          "Unable to disconnect! Please make sure MetaMask is installed and properly configured.",
      };
    }
  },

  // Load transaction from sanity.io
  transaction: async (address) => {
    try {
      const timestamp = Date.now();
      const query = `*[_type == 'mulmint' && address == $address]`;
      const params = { address, timestamp };
      const transactions = await client.fetch(query, params);

      if (transactions.length === 0) {
        return {
          message:
            "No transactions found for the provided wallet address. Please ensure the address is correct and try again.",
          transaction: transactions,
        };
      } else {
        const transactionData = transactions[0];
        const message =
          transactionData.status === "claimed"
            ? "Great news! Transactions have been successfully loaded. Tokens have already been claimed."
            : "Great news! Transactions have been successfully loaded. You can now claim your tokens.";

        return {
          message,
          transaction: transactionData,
        };
      }
    } catch (error) {
      console.log(error);
      return {
        message: `Unexpected error! Please refresh the browser and try again later.${error.message}`,
        transaction: null,
      };
    }
  },

  // Fetch settings from sanity.io
  settings: async () => {
    try {
      const timestamp = Date.now();
      const query = `*[_type == 'setting'][0].claimButtonEnabled`;
      const params = { timestamp };
      let claimButtonEnabled = await client.fetch(query, params);

      const subscription = client.listen(query, params).subscribe((update) => {
        claimButtonEnabled = update?.result?.claimButtonEnabled;
        console.log(update?.result)
      });

      return {
        claimButtonEnabled,
        message: `Fetching settings successfully`,
      };
    } catch (error) {
      return {
        claimButtonEnabled: null,
        message: `Error fetching claim button status: ${error.message}`,
      };
    }
  },
};

export default services;
