export interface User {
    balance: number;
    locked: number;
}
interface UserAction {
    quantity: number;
    locked: number;
}

interface UserPosition {
    yes?: UserAction;
    no?: UserAction; 
}

export interface StockBalances {
    [user: string]: {
        [position: string]: UserPosition;
    };
}

