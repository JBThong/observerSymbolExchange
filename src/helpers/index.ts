import { STATE_ORDER } from '../../configuration/constants/index'

/**
 * @param {number} stateOrder The stateOrder is like bid or ask.
 * @param {any} bookTicker
 * @param {number} limit
 * 
 */
export function generateOrderList(stateOrder: number, bookTicker: any, limit: number) {
    let result = [];

    if (stateOrder === STATE_ORDER.bidOrder) {
        result = [...result, {price: parseFloat(bookTicker?.bidPrice), qty: parseFloat(bookTicker?.bidQty)}];
    } else {
        result = [...result, {price: parseFloat(bookTicker?.askPrice), qty: parseFloat(bookTicker?.askQty)}];
    }

    for (let i = 0; i < limit - 1; i++) {
        let item = {
            price: getRandomPrice(bookTicker, stateOrder).toFixed(6),
            qty: getRandomSize(bookTicker, stateOrder).toFixed(6),
        }

        result = [...result, item];
    }

    return result.sort((a,b) => stateOrder === STATE_ORDER.bidOrder ? a.price - b.price : b.price - a.price);
}

/**
 * Returns a random price of Symbol. Include: Bid price or ask price.
 * 
 * @param {number} stateOrder The stateOrder is like bid or ask.
 * @param {any} bookTicker
 * 
 */
function getRandomPrice(bookTicker: any, stateOrder): number {
    if (stateOrder === STATE_ORDER.bidOrder) {
        return parseFloat(bookTicker?.bidPrice) + Math.random() * 1;
    }

    return parseFloat(bookTicker?.askPrice) - Math.random() * parseFloat(bookTicker?.askPrice);
}


/**
 * Returns a random size of Symbol. Include: Bid size or ask size.
 * 
 * @param {number} stateOrder The stateOrder is like bid or ask.
 * @param {any} bookTicker
 * 
 */
function getRandomSize(bookTicker: any, stateOrder): number {
    if (stateOrder === STATE_ORDER.bidOrder) {
        return parseFloat(bookTicker?.bidQty) + Math.random() * 5;
    }

    return parseFloat(bookTicker?.askQty) - Math.random() * parseFloat(bookTicker?.askQty);
}