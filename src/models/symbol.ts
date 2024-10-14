// src/models/symbol.ts

export interface OrderEntry {
    total: number;
    orders: Record<string, number>;
}

export interface SymbolEntry {
    yes: Record<string, OrderEntry>;
    no: Record<string, OrderEntry>;
}

export interface OrderBook {
    [key: string]: SymbolEntry;
}

