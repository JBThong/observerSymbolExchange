import { STATE_ORDER, TOTAL_QUANTITY, TOTAL_QUANTITY_PRICE } from '../../configuration/constants/index'

/**
 * @param {number} stateOrder The stateOrder is like bid or ask.
 * @param {any} bookTicker
 * @param {number} limit
 * 
 */
export function generateOrderList(stateOrder: number, bookTicker: any, limit: number) {
    let result = [];
    let isBidOrder = stateOrder === STATE_ORDER.bidOrder;
    let firstPrice = parseFloat(isBidOrder ? bookTicker?.bidPrice : bookTicker?.askPrice);
    let firstQuantity = parseFloat(isBidOrder ? bookTicker?.bidQty : bookTicker?.askQty);

    result = [...result, {price: firstPrice, qty: firstQuantity, total: firstPrice * firstQuantity}];

    let condition = firstQuantity >= TOTAL_QUANTITY || firstPrice * firstQuantity >= TOTAL_QUANTITY_PRICE;

    if (condition) {
        return result;
    }

    let commonDifferenceOfQuantity = findDeltaBasedOnSumQuantity(TOTAL_QUANTITY - firstQuantity, 0, limit);
    let commonDifferenceOfPrice = findDeltaBasedOnSumTotal(TOTAL_QUANTITY_PRICE - (firstPrice * firstQuantity), firstPrice, TOTAL_QUANTITY - firstQuantity, commonDifferenceOfQuantity, limit);

    for (let i = 1; i < limit; i++) {
        let item = {
            price: parseFloat(getRandomPrice(firstPrice, isBidOrder, commonDifferenceOfPrice).toFixed(6)),
            qty: parseFloat(getRandomQuantity(0, commonDifferenceOfQuantity, i).toFixed(6)),
        }

        result = [...result, {...item, total: item.price * item.qty}];
    }

    return result.sort((a,b) => isBidOrder ? (b.price - a.price) : (a.price - b.price));
}

/**
 * Returns a random price of Symbol. Include: Bid price or ask price.
 * 
 * @param {number} Boolean The stateOrder is like bid or ask.
 * @param {number} price The price.
 * @returns {number} The random price.
 * 
 */
function getRandomPrice(price: number, stateOrder: Boolean, commonDifferenceOfPrice: number): number {
    let random = Math.random() * commonDifferenceOfPrice;
    return stateOrder ? (price + random) : (price - random)
}


/**
 * Returns a random quantity of Symbol. Include: Bid quantity or ask quantity.
 * 
 * @param {number} quantity The stateOrder is like bid or ask.
 * @param {number} commonDifferenceOfQuantity
 * @returns {number} The random quantity.
 */
function getRandomQuantity(quantity: number, commonDifferenceOfQuantity: number, index): number {
    return quantity + Math.random() * (index) * commonDifferenceOfQuantity;
}


/**
 * Returns the common difference of an arithmetic progression of Quantity.
 * 
 * @param {number} sumQuantity The sum of n elements of an arithmetic sequence.
 * @param {number} firstQuantity The first quantity of the progression,
 * @param {number} numOfEls Number of elements of a sequence.
 * @returns {number} The common difference
 * 
 */
function findDeltaBasedOnSumQuantity(sumQuantity: number, firstQuantity: number, numOfEls: number): number {    
    return (2 * sumQuantity/numOfEls - 2 * firstQuantity)/(numOfEls-1);
}

/**
 * Returns the common difference of an arithmetic progression of Price.
 * 
 * @param {number} sumTotal The sum of n price of an arithmetic sequence (Price * Quantity).
 * @param {number} firstPrice The first price of the progression.
 * @param {number} firstQuantity The first quantity of the progression.
 * @param {number} numOfPrice Number of price of a sequence.
 * @returns {number} The common difference
 * 
 */
function findDeltaBasedOnSumTotal(sumTotal: number, firstPrice: number,
    firstQuantity: number, commonDifferenceOfQuantity: number, numOfPrice: number): number {

    // We have (1): sumTotal = price(1)*quantity(1) + price(2) * quantity(2) + ... + price(n) * quantity(n)
    // (2): price(n) = price(1) + (numOfPrice - 1) * commonDifferenceOfPrice
    // (3): quantity(n) = quantity(1) + (numOfQuantity - 1) * commonDifferenceOfQuantity
    // with (4): numOfPrice = numOfQuantity
    // => commonDifferenceOfPrice below:
    let numerator = sumTotal - numOfPrice * firstQuantity * firstPrice - numOfPrice * (numOfPrice -1) * commonDifferenceOfQuantity * firstPrice/2;
    let denominator = (numOfPrice * (numOfPrice -1 )/2) * (firstQuantity + (2 * numOfPrice - 1)/2);
    
    if (denominator) {
        return numerator/denominator;
    }

    return 0;
}

export function calculateSum(array, property) {
    let total = array.reduce((accumulator, object) => {
      return accumulator + object[property];
    }, 0);
  
    return total;
}

export function parseStreamBookTicker(streamBookTicker) {
    return {
        symbol: streamBookTicker.s,
        bidPrice: streamBookTicker.b,
        bidQty: streamBookTicker.B,
        askPrice: streamBookTicker.a,
        askQty: streamBookTicker.A,
    }
}