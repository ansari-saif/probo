export interface User {
    balance: number;
    locked: number;
}
interface UserAction {
    quantity: number;
    locked: number;
}

interface UserPosition {
    yes?: UserAction; // Optional, as not all users may have "yes" actions
    no?: UserAction;  // Optional, as not all users may have "no" actions
}

interface UserData {
    [key: string]: UserPosition; // Dynamically keyed by user actions
}

export interface StockBalances {
    [user: string]: {
        [position: string]: UserPosition; // Dynamically keyed by trading positions
    };
}

