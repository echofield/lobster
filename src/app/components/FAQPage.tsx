import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';

const FAQ_SECTIONS = [
  {
    title: 'FREQUENTLY ASKED QUESTIONS',
    items: [
      {
        id: '1',
        question: 'WHAT DO I GET FOR SUBSCRIBING ?',
        answer: 'With a subscription, you get unlimited access to our entire library of premium samples, exclusive new releases every month, and priority support. You can download as many samples as you need for your productions without any additional costs.'
      },
      {
        id: '2',
        question: 'IS PAYMENT SECURE ?',
        answer: 'Yes, all payments are processed through industry-standard secure payment gateways with end-to-end encryption. We use SSL certificates and comply with PCI DSS standards to ensure your payment information is always protected.'
      },
      {
        id: '3',
        question: 'HOW ARE FEATURED ARTISTS GETTING PAID ?',
        answer: 'Featured artists receive 85% of all sales from their sample packs. Payments are processed monthly via direct deposit or PayPal. We believe in fair compensation for creators and maintain complete transparency in our revenue sharing model.'
      },
      {
        id: '4',
        question: 'WHO IS BEHIND LOBSTER STUDIO ?',
        answer: 'Lobster Studio was founded by a team of professional music producers and audio engineers with over 20 years of combined experience in the music industry. Our mission is to democratize access to professional-quality samples and support the creative community.'
      },
      {
        id: '5',
        question: 'WHEN IS THE NEXT LOBSTER SESSION TAKING PLACE ?',
        answer: 'Lobster Sessions are held quarterly. The next session is scheduled for April 15, 2026. Sessions feature live sampling workshops, collaboration opportunities, and exclusive preview access to upcoming releases. Subscribe to our newsletter to stay updated.'
      },
    ]
  },
  {
    title: 'SUPPORT AND CONTACT',
    items: [
      {
        id: '6',
        question: 'MY SONG AREN\'T UPLOADING',
        answer: 'If you\'re experiencing upload issues, first check your internet connection and ensure your files are in supported formats (WAV, MP3, AIFF). Files should be under 500MB each. If the problem persists, try clearing your browser cache or contact our support team at support@lobsterstudio.com'
      },
      {
        id: '7',
        question: 'I DIDN\'T RECEIVE MY LOBSTER I-KEY',
        answer: 'The Lobster I-Key is sent to your registered email address within 24 hours of subscription. Please check your spam folder. If you still haven\'t received it, contact support@lobsterstudio.com with your order number and we\'ll resend it immediately.'
      },
      {
        id: '8',
        question: 'COPYRIGHT AND PROPERTY ISSUES',
        answer: 'All samples on our platform come with royalty-free licenses for unlimited use in your productions. You retain full copyright of your final works. However, you cannot resell or redistribute the raw samples. For specific licensing questions, please refer to our Terms of Service or contact legal@lobsterstudio.com'
      },
      {
        id: '9',
        question: 'REFUND POLICY',
        answer: 'We offer a 14-day money-back guarantee for subscription plans. For individual sample pack purchases, refunds are available within 48 hours if you haven\'t downloaded the files. Please contact support@lobsterstudio.com with your order details to initiate a refund.'
      },
      {
        id: '10',
        question: 'WHEN IS THE NEXT LOBSTER SESSION TAKING PLACE ?',
        answer: 'Lobster Sessions are held quarterly. The next session is scheduled for April 15, 2026. Sessions feature live sampling workshops, collaboration opportunities, and exclusive preview access to upcoming releases. Subscribe to our newsletter to stay updated.'
      },
    ]
  }
];

export function FAQPage() {
  return (
    <div className="flex-1 px-6 py-12">
      <div className="max-w-4xl mx-auto">
        {FAQ_SECTIONS.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-16">
            <h2 className="text-2xl font-medium mb-8">{section.title}</h2>
            <Accordion type="single" collapsible className="space-y-4">
              {section.items.map((item) => (
                <AccordionItem key={item.id} value={item.id} className="border border-neutral-200 rounded-lg px-6">
                  <AccordionTrigger className="text-left hover:no-underline py-5">
                    <span className="font-medium">{item.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-neutral-600 pb-5">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}
      </div>
    </div>
  );
}
