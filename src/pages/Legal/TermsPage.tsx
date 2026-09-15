import { ROUTES } from '@/config/site';
import { useSeo } from '@/hooks/useSeo';
import { LegalPageLayout, type LegalSection } from './LegalPageLayout';

const SECTIONS: LegalSection[] = [
  {
    id: 'scope',
    heading: 'Scope of these terms',
    paragraphs: [
      'These terms govern the use of the VOIDCARD storefront and the purchase of digital prepaid and gift card codes through it. By placing an order you accept them.',
      'VOIDCARD is a demonstration project. It does not currently process real payments and makes no claim to hold any financial licence, registration or authorisation.',
    ],
  },
  {
    id: 'accounts',
    heading: 'Accounts',
    paragraphs: [
      'An account is required to place an order so that orders and delivered codes can be retrieved and so support can verify ownership before discussing an order.',
      'You are responsible for keeping your credentials confidential. Registration is currently limited to addresses on approved email domains.',
    ],
  },
  {
    id: 'products',
    heading: 'Products and pricing',
    paragraphs: [
      'Each product is a redemption code for a prepaid balance or store credit of the stated face value. Nothing physical is shipped.',
      'Prices, discounts and availability are shown per product and may change between visits. The price applied to an order is the price at the moment the order is created.',
    ],
  },
  {
    id: 'payment',
    heading: 'Payment',
    paragraphs: [
      'Payments are made in supported crypto assets through a payment provider. The provider issues a deposit address and an exact amount, valid for a limited quote window.',
      'An order is only treated as paid once the provider independently confirms the transfer. Statements made in the browser, including confirming that you have sent a payment, do not settle an order.',
    ],
    list: [
      'Send only on the network shown at checkout. Transfers on other networks may be unrecoverable.',
      'Underpayments are held as partial payments and may be topped up within the payment window.',
      'Expired quotes can be replaced by creating a new payment at the current rate.',
    ],
  },
  {
    id: 'delivery',
    heading: 'Delivery',
    paragraphs: [
      'Codes are issued after payment confirmation and delivered to the email address recorded on the order. They also remain available in your account history.',
      'Delivery estimates are shown per product and are estimates, not guarantees.',
    ],
  },
  {
    id: 'cancellation',
    heading: 'Cancellation and refunds',
    paragraphs: [
      'An order may be cancelled at no cost while payment is still pending. Once a code has been issued and revealed it cannot be returned, because the balance may already have been spent.',
      'If a code cannot be redeemed with the issuing brand, contact support with the order reference so it can be investigated.',
    ],
  },
  {
    id: 'acceptable-use',
    heading: 'Acceptable use',
    paragraphs: [
      'You may not use the storefront for fraudulent purchases, resale in breach of an issuer’s terms, or any unlawful purpose.',
      'We may cancel orders and suspend accounts where activity appears fraudulent or abusive.',
    ],
  },
  {
    id: 'liability',
    heading: 'Liability',
    paragraphs: [
      'To the extent permitted by law, liability is limited to the amount paid for the order in question.',
      'We are not responsible for losses arising from incorrect addresses supplied by you, transfers sent on unsupported networks, or the policies of an issuing brand.',
    ],
  },
  {
    id: 'changes',
    heading: 'Changes to these terms',
    paragraphs: [
      'These terms may be updated. Material changes will be reflected in the date at the top of this page, and continued use constitutes acceptance.',
    ],
  },
];

export default function TermsPage() {
  useSeo({
    title: 'Terms of Service',
    description: 'The terms that govern purchases and use of the VOIDCARD storefront.',
    path: ROUTES.terms,
  });

  return (
    <LegalPageLayout
      title="Terms of Service"
      updated="September 2026"
      intro="Placeholder terms structured for a digital prepaid card storefront. Replace with counsel-reviewed copy before commercial use."
      sections={SECTIONS}
    />
  );
}
