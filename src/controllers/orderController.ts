import { Request, Response } from 'express';
import { CLOSURE_AMOUNT, INR_BALANCES, ORDERBOOK, STOCK_BALANCES } from '../db';
const getStockType = (val: string) => val == "yes" ? "no" : "yes";
const getPrice = (val: number) => CLOSURE_AMOUNT - val

export const placeBuyOrder = (req: Request, res: Response) => {
    const {
        stockSymbol,
        stockType,
        price,
        quantity,
        userId
    }: {
        stockSymbol: string;
        stockType: 'yes' | 'no';
        price: number;
        quantity: number;
        userId: string;
    } = req.body;

    const updatedStockType = getStockType(stockType);
    const updatedPrice = getPrice(price);

    // Check if user exists in INR_BALANCES
    if (!INR_BALANCES[userId]) {
        return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const totalCost = price * quantity;

    // Check if user has enough INR balance
    if (INR_BALANCES[userId].balance < totalCost) {
        return res.status(400).json({ success: false, message: 'Insufficient INR balance.' });
    }

    // Deduct the amount from INR_BALANCES

    // Update the STOCK_BALANCES ledger
    STOCK_BALANCES[userId] ??= {};
    STOCK_BALANCES[userId][stockSymbol] ??= {};
    STOCK_BALANCES[userId][stockSymbol][stockType] ??= { quantity: 0, locked: 0 };

    // Increase the quantity in the user's stock balance
    STOCK_BALANCES[userId][stockSymbol][stockType].quantity += quantity;

    // Initialize the order book if necessary
    ORDERBOOK[stockSymbol] ??= { yes: {}, no: {} };

    // Check if an order exists at the same or lower price
    let orderMatched = false;
    for (const [orderPrice, orderDetails] of Object.entries(ORDERBOOK[stockSymbol][stockType])) {
        if (parseFloat(orderPrice) <= price) {
            orderMatched = true;

            // Handle fulfilling the order for 1 quantity
            const availableQty = Math.min(orderDetails.total, 1); // We only buy 1 qty

            // Loop through the users in this price level
            for (const [existingUserId, userOrderQty] of Object.entries(orderDetails.orders)) {
                const quantityToDeduct = Math.min(userOrderQty as number, availableQty);

                // Deduct from the order
                orderDetails.orders[existingUserId] -= quantityToDeduct;
                orderDetails.total -= quantityToDeduct;
                INR_BALANCES[userId].balance -= Number(orderPrice)*quantityToDeduct;

                // If the order is completely fulfilled for a user, remove the user from the order
                if (orderDetails.orders[existingUserId] === 0) {
                    delete orderDetails.orders[existingUserId];
                }

                // Break after fulfilling the 1 qty
                if (quantityToDeduct === availableQty) {
                    break;
                }
            }

            // If the total order at this price is completely filled, remove it from the order book
            if (orderDetails.total === 0) {
                delete ORDERBOOK[stockSymbol][stockType][orderPrice];
            }

            break;
        }
    }

    // If no matching order was found, add the order to the order book
    if (!orderMatched) {
        INR_BALANCES[userId].balance -= totalCost;
        ORDERBOOK[stockSymbol][updatedStockType][updatedPrice] ??= { total: 0, orders: {} };

        // Add to the order book
        const orderEntry = ORDERBOOK[stockSymbol][updatedStockType][updatedPrice];
        orderEntry.total += quantity;
        orderEntry.orders[userId] = (orderEntry.orders[userId] || 0) + quantity;
    }

    return res.json({
        success: true,
        message: `Buy order placed for ${quantity} '${stockType}' options at price ${price}.`,
        order: { stockSymbol, stockType, price, quantity },
        remainingBalance: INR_BALANCES[userId],
        updatedStockBalance: STOCK_BALANCES[userId][stockSymbol][updatedStockType]
    });
};




export const placeSellOrder = (req: Request, res: Response) => {
    const { stockSymbol, stockType, price, quantity, userId }: {
        stockSymbol: string;
        stockType: 'yes' | 'no';
        price: number;
        quantity: number;
        userId: string;
    } = req.body;

    // Check if user exists in INR_BALANCES
    if (!INR_BALANCES[userId]) {
        return res.status(404).json({ success: false, message: 'User not found in INR balances.' });
    }

    // Check if user has stock options in STOCK_BALANCES
    const userStockBalance = STOCK_BALANCES[userId]?.[stockSymbol]?.[stockType];
    if (!userStockBalance || userStockBalance.quantity < quantity) {
        return res.status(400).json({ success: false, message: 'Insufficient stock options to sell.' });
    }

    const totalSellValue = price * quantity;

    // Deduct the stock options from the user's holdings
    userStockBalance.quantity -= quantity;

    // Check if an entry exists in ORDERBOOK with the same or a higher price
    const orderBookForSymbol = ORDERBOOK[stockSymbol]?.[stockType] || {};
    let orderFulfilled = false;

    for (const [existingPrice, order] of Object.entries(orderBookForSymbol)) {
        const existingPriceNumber = parseFloat(existingPrice);
        
        // If there is an order at the same or higher price
        if (existingPriceNumber >= price) {
            // Fulfill the order by deducting from the orders in the ORDERBOOK
            let remainingQuantity = quantity;

            for (const [existingUserId, existingUserQuantity] of Object.entries(order.orders)) {
                const userOrderQuantity = Math.min(existingUserQuantity, remainingQuantity);
                remainingQuantity -= userOrderQuantity;

                // Update the order in the ORDERBOOK
                order.orders[existingUserId] -= userOrderQuantity;
                order.total -= userOrderQuantity;

                // Update INR_BALANCES for the selling user
                INR_BALANCES[userId].balance += userOrderQuantity * existingPriceNumber;

                // If the order is fully fulfilled
                if (remainingQuantity === 0) {
                    orderFulfilled = true;
                    break;
                }
            }

            // If the total order was fulfilled, we can stop checking further
            if (orderFulfilled) {
                break;
            }
        }
    }

    // If order not fulfilled, lock the stocks in STOCK_BALANCES and add to ORDERBOOK
    if (!orderFulfilled) {
        // Lock the user's stocks
        userStockBalance.locked = (userStockBalance.locked || 0) + quantity;

        // Add order to ORDERBOOK
        if (!ORDERBOOK[stockSymbol]) {
            ORDERBOOK[stockSymbol] = { yes: {}, no: {} };
        }

        ORDERBOOK[stockSymbol][stockType][price] ??= { total: 0, orders: {} };
        
        ORDERBOOK[stockSymbol][stockType][price].total += quantity;
        ORDERBOOK[stockSymbol][stockType][price].orders[userId] = (ORDERBOOK[stockSymbol][stockType][price].orders[userId] || 0) + quantity;
    }

    // Send success response
    res.json({
        success: true,
        message: `Sell order placed for ${quantity} '${stockType}' options at price ${price}.`,
        order: { stockSymbol, stockType, price, quantity },
        updatedINRBalance: INR_BALANCES[userId].balance,
        remainingStockBalance: userStockBalance
    });
};

