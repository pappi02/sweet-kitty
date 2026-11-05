// Every price on the site comes from this file (KES). Change a number here and the
// shop, product pages, bag, WhatsApp order message and FAQ all follow.

/** The usual price of a single product. */
export const standardPrice = 3000;

/** Keyed by product id. Give any product its own number to move it off the standard price. */
export const prices = {
  "kit-7-day": 10000,
  "magic-juice": standardPrice,
  "body-scrub": standardPrice,
  "kitty-oil": standardPrice,
  candies: standardPrice,
  "magic-bath": standardPrice,
  tight: standardPrice,
  slippery: standardPrice,
};
