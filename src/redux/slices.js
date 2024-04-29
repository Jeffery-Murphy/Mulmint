import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import services from "./services";

// connect wallet
export const connectWallet = createAsyncThunk(
  "connect/wallet",
  async (_, thunkAPI) => {
    try {
      return await services.connectWallet();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// disconnect wallet
export const disconnectWallet = createAsyncThunk(
  "disconnect/wallet",
  async (_, thunkAPI) => {
    try {
      return await services.disconnectWallet();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// load transaction from sanity.io
export const transaction = createAsyncThunk(
  "wallet/transaction",
  async (address, thunkAPI) => {
    try {
      return await services.transaction(address);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// load settings from sanity.io
export const settings = createAsyncThunk(
  "settings",
  async (_, thunkAPI) => {
    try {
      return await services.settings();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const initialState = {
  address: null,
  walletState: {
    loading: false,
    error: false,
    message: "wallet",
    status: "none",
    success: false,
  },
  transaction: null,
  transactionState: {
    loading: false,
    error: false,
    message: "transaction",
    success: false,
  },
  settingsState: {
    loading: false,
    error: false,
    settings: null,
    message: "settings",
    success: false,
  },
};

export const slices = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    clearWalletState: (state) => {
      state.walletState = {
        loading: false,
        error: false,
        message: "wallet",
        status: "none",
        success: false,
      };
    },
    clearTransactionState: (state) => {
      state.transactionState = {
        loading: false,
        error: false,
        message: "transaction",
        success: false,
      };
    },
    clearSettingsState: (state) => {
      state.settingsState = {
        loading: false,
        error: false,
        message: "settings",
        settings: null,
        success: false,
      };
    },
    clearTransaction: (state) => {
      state.transaction = null;
    },
    clearAddress: (state) => {
      state.address = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(connectWallet.pending, (state) => {
        state.walletState.loading = true;
        state.walletState.error = false;
        state.walletState.message = "connecting...";
        state.walletState.status = "connection";
        state.walletState.success = false;
      })
      .addCase(connectWallet.fulfilled, (state, action) => {
        (state.address = action.payload.address),
          (state.walletState = {
            ...state.walletState,
            loading: false,
            error: false,
            message: action.payload.message,
            status: "connection",
            success: true,
          });
      })
      .addCase(connectWallet.rejected, (state, action) => {
        state.walletState = {
          ...state.walletState,
          loading: false,
          error: true,
          message: action.payload.message,
          status: "connection",
          address: null,
          success: false,
        };
      })

      .addCase(disconnectWallet.pending, (state) => {
        state.walletState.loading = true;
        state.walletState.error = false;
        state.walletState.message = "disconnecting...";
        state.walletState.status = "disconnection";
        state.walletState.success = false;
      })
      .addCase(disconnectWallet.fulfilled, (state, action) => {
        (state.address = null),
          (state.walletState = {
            ...state.walletState,
            loading: false,
            error: action.payload.error,
            message: action.payload.message,
            status: "disconnection",
            success: action.payload.success,
          });
      })
      .addCase(disconnectWallet.rejected, (state, action) => {
        state.walletState = {
          ...state.walletState,
          loading: false,
          error: action.payload.error,
          message: action.payload.message,
          status: "disconnection",
          success: action.payload.success,
        };
      })

      .addCase(transaction.pending, (state) => {
        if (!state.transaction) {
          state.transactionState.loading = true;
          state.transactionState.transaction = null;
        }
        state.transactionState.error = false;
        state.transactionState.success = true;
        state.transactionState.message = "Loading transaction...";
      })
      .addCase(transaction.fulfilled, (state, action) => {
        state.transactionState.loading = false;
        // Set the new transaction, discarding the existing one
        state.transaction = action.payload;
        state.transactionState.error = false;
        state.transactionState.success = true;
        state.transactionState.message = "Loading transaction successfully";
      })
      .addCase(transaction.rejected, (state) => {
        if (!state.transaction) {
          state.transactionState.loading = true;
          state.transaction = null;
        }
        state.transactionState.error = true;
        state.transactionState.success = false;
        state.transactionState.message = "Loading transaction failed";
      })

      .addCase(settings.pending, (state) => {
        state.settingsState.loading = true;
        state.settingsState.error = false;
        state.settingsState.message = "loading settings...";
        state.settingsState.status = "loading";
        state.settingsState.success = false;
      })
      .addCase(settings.fulfilled, (state, action) => {
        state.settingsState = {
          ...state.settingsState,
          loading: false,
          error: false,
          message: action.payload.message,
          settings: action.payload,
          status: "success",
          success: true,
        };
      })
      .addCase(settings.rejected, (state, action) => {
        state.settingsState = {
          ...state.settingsState,
          loading: false,
          error: true,
          message: action.payload.message,
          settings: null,
          status: "failure",
          success: false,
        };
      });
  },
});

export const { clearWalletState, clearTransactionState, clearSettingsState, clearTransaction, clearAddress } = slices.actions;

export default slices.reducer;
