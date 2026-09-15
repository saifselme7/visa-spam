import { ROUTES } from '@/config/site';
import { useSeo } from '@/hooks/useSeo';
import { LegalPageLayout, type LegalSection } from './LegalPageLayout';

const SECTIONS: LegalSection[] = [
  {
    id: 'summary',
    heading: 'Summary',
    paragraphs: [
      'We collect the minimum needed to sell a digital code and deliver it: an email address, your order history, and support correspondence.',
      'We do not collect card numbers, bank details, government identity documents or wallet private keys, and we never ask for a recovery phrase.',
    ],
  },
  {
    id: 'what-we-collect',
    heading: 'What we collect',
    paragraphs: ['The following categories of data are processed when you use the storefront.'],
    list: [
      'Account data: email address, display name, account creation date, preferences.',
      'Order data: products purchased, amounts, order and payment status, delivery email.',
      'Payment metadata: the asset and network chosen, and confirmation events reported by the payment provider. We do not receive your wallet keys.',
      'Support data: the content of tickets you send us and the order they relate to.',
      'Local device data: cart and wishlist contents stored in your browser.',
    ],
  },
  {
    id: 'how-we-use-it',
    heading: 'How we use it',
    paragraphs: [
      'Data is used to fulfil orders, deliver codes, provide support, and prevent fraud and abuse.',
      'Marketing emails are only sent if you opt in, and the preference can be changed at any time from your profile.',
    ],
  },
  {
    id: 'sharing',
    heading: 'Who we share it with',
    paragraphs: [
      'Order and payment information is shared with the payment provider strictly as needed to create and verify a payment, and with card issuers as needed to issue a code.',
      'We do not sell personal data.',
    ],
  },
  {
    id: 'retention',
    heading: 'Retention',
    paragraphs: [
      'Order records are retained for as long as needed to support the purchase and meet record-keeping obligations. Support tickets are retained while the issue is open and for a reasonable period afterwards.',
    ],
  },
  {
    id: 'security',
    heading: 'Security',
    paragraphs: [
      'Access to order data is scoped to the account that created it and enforced at the database level, not only in the browser.',
      'Secrets such as provider API keys never exist in client-side code; they remain on the server.',
    ],
  },
  {
    id: 'your-rights',
    heading: 'Your rights',
    paragraphs: [
      'Depending on where you live, you may have rights to access, correct, export or delete your personal data. Requests can be made through a support ticket.',
    ],
  },
  {
    id: 'cookies',
    heading: 'Cookies and local storage',
    paragraphs: [
      'We use local storage to keep your cart, wishlist and session. No third-party advertising or cross-site tracking cookies are set.',
    ],
  },
  {
    id: 'contact',
    heading: 'Contact',
    paragraphs: [
      'Privacy questions can be raised through the support centre, which routes them to the person handling data requests.',
    ],
  },
];

export default function PrivacyPage() {
  useSeo({
    title: 'Privacy Policy',
    description: 'What data VOIDCARD collects, how it is used, and how it is protected.',
    path: ROUTES.privacy,
  });

  return (
    <LegalPageLayout
      title="Privacy Policy"
      updated="September 2026"
      intro="Placeholder privacy policy structured for a digital prepaid card storefront. Replace with counsel-reviewed copy before commercial use."
      sections={SECTIONS}
    />
  );
}
