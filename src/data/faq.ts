export interface FaqEntry {
  id: string;
  question: string;
  answer: string;
  topic: 'cards' | 'checkout' | 'payments' | 'orders' | 'refunds' | 'account';
}

export const faqEntries: FaqEntry[] = [
  {
    id: 'what-is-a-prepaid-card',
    topic: 'cards',
    question: 'What exactly am I buying?',
    answer:
      'A redemption code for a prepaid or gift card of the denomination shown. Nothing physical ships. You enter the code at the issuing brand’s checkout or account page and the balance is applied there.',
  },
  {
    id: 'where-can-i-use-it',
    topic: 'cards',
    question: 'Where can a code be used?',
    answer:
      'Each product page lists the supported regions and redemption channels. Brand-specific cards only work with that brand; general prepaid denominations work wherever the issuing network is accepted online.',
  },
  {
    id: 'partial-balance',
    topic: 'cards',
    question: 'What happens to leftover balance?',
    answer:
      'The balance stays on the code until it is spent. If a purchase costs less than the balance, the remainder is available for the next one.',
  },
  {
    id: 'checkout-steps',
    topic: 'checkout',
    question: 'How does checkout work?',
    answer:
      'Review your cart, confirm the email the codes should go to, pick a payment asset, and you are shown payment instructions issued by our payment provider. Once the provider confirms the funds, the order moves to preparing and the codes are issued.',
  },
  {
    id: 'account-required',
    topic: 'checkout',
    question: 'Do I need an account to buy?',
    answer:
      'Yes. Orders and codes are tied to an account so they can be retrieved later and so support can verify ownership before discussing an order.',
  },
  {
    id: 'crypto-flow',
    topic: 'payments',
    question: 'How is a crypto payment verified?',
    answer:
      'Our payment provider issues a deposit address and amount for your order, watches the chain, and reports confirmations back to us. Nothing on this website decides that a payment arrived — the order only moves forward when the provider confirms it on-chain.',
  },
  {
    id: 'supported-assets',
    topic: 'payments',
    question: 'Which assets are accepted?',
    answer:
      'USDT (TRC20), USDC (ERC20), BTC and ETH. The network for each asset is shown before you commit, and sending on a different network will not be detected.',
  },
  {
    id: 'underpayment',
    topic: 'payments',
    question: 'What if I send the wrong amount?',
    answer:
      'Underpayments are held and shown on the order as a partial payment; you can top up within the payment window. Overpayments are reconciled by support. Contact us with the order reference and the provider will handle the difference.',
  },
  {
    id: 'payment-window',
    topic: 'payments',
    question: 'Why does the payment screen have a timer?',
    answer:
      'Quotes are only valid for a limited window because the crypto amount is derived from a rate at the moment the intent is created. If the window elapses, the order is marked expired and you can create a new payment at the current rate.',
  },
  {
    id: 'delivery-time',
    topic: 'orders',
    question: 'How quickly are codes delivered?',
    answer:
      'Most denominations are issued within minutes of the payment being confirmed. The estimate is shown on each product page, and larger denominations may take longer because they are issued in batches.',
  },
  {
    id: 'order-status',
    topic: 'orders',
    question: 'What do the order statuses mean?',
    answer:
      'Pending means no payment has been detected yet. Payment processing means funds were seen but not yet confirmed. Paid means the provider confirmed the payment. Preparing means codes are being issued. Completed means everything has been delivered.',
  },
  {
    id: 'refunds',
    topic: 'refunds',
    question: 'Can I get a refund?',
    answer:
      'An order can be cancelled at no cost while payment is still pending. After codes are issued they cannot be returned, because the balance may already be spent. If a code fails to redeem, contact support with the order reference and we will investigate with the issuer.',
  },
  {
    id: 'wrong-product',
    topic: 'refunds',
    question: 'I bought the wrong card. What now?',
    answer:
      'Open a support ticket before revealing the code. If the code has not been issued or viewed, we can usually swap it for the correct product.',
  },
  {
    id: 'account-security',
    topic: 'account',
    question: 'How is my account protected?',
    answer:
      'Authentication is handled by our identity provider; we never see your password. Codes and order history are readable only by the account that created them, enforced at the database level rather than in the browser.',
  },
  {
    id: 'gmail-only',
    topic: 'account',
    question: 'Why can I only register with a Gmail address?',
    answer:
      'Registration is currently limited to Gmail addresses while we work through deliverability for our order emails. The restriction is enforced on the server, not just in this browser.',
  },
];
