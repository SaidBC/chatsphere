import { CheckIcon } from '@heroicons/react/20/solid';

const tiers = [
  {
    name: 'Free',
    id: 'tier-free',
    href: '/signup',
    price: { monthly: '$0', annually: '$0' },
    description: 'Perfect for individuals and small teams just getting started.',
    features: [
      'Up to 5 chat rooms',
      '10,000 messages per month',
      'Basic file sharing (up to 5MB)',
      'Standard support',
      '7-day message history',
    ],
    mostPopular: false,
  },
  {
    name: 'Pro',
    id: 'tier-pro',
    href: '/signup',
    price: { monthly: '$15', annually: '$144' },
    description: 'Ideal for growing teams and communities that need more features.',
    features: [
      'Unlimited chat rooms',
      'Unlimited messages',
      'Advanced file sharing (up to 100MB)',
      'Priority support',
      '90-day message history',
      'Custom themes',
      'Advanced analytics',
    ],
    mostPopular: true,
  },
  {
    name: 'Enterprise',
    id: 'tier-enterprise',
    href: '/signup',
    price: { monthly: 'Custom', annually: 'Custom' },
    description: 'Dedicated support and infrastructure for your company.',
    features: [
      'Everything in Pro',
      'Unlimited message history',
      'Enterprise-grade security',
      'Custom integrations',
      'Dedicated account manager',
      'SSO authentication',
      'Advanced permissions',
      'SLA guarantees',
    ],
    mostPopular: false,
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Pricing() {
  return (
    <div className="bg-gray-900 py-24 sm:py-32 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -right-40 w-96 h-96 opacity-10 bg-accent-1 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 left-1/4 w-96 h-96 opacity-10 bg-accent-2 rounded-full blur-3xl"></div>
      </div>
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="gradient-text inline-block text-base font-semibold leading-7">Pricing</h1>
          <p className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Plans for teams of all sizes
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Choose the perfect plan for your needs. Always know what you'll pay with our transparent pricing.
          </p>
        </div>
        
        <div className="mt-16 flex justify-center">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {tiers.map((tier) => (
              <div
                key={tier.id}
                className={classNames(
                  tier.mostPopular 
                    ? 'relative border-2 border-white rounded-xl p-8 bg-gray-800 transition-all duration-300 group' 
                    : 'rounded-xl p-8 bg-gray-800 border border-gray-700 transition-all duration-300 hover:border-transparent group'
                )}
              >
                {tier.mostPopular && (
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-1 to-accent-2 rounded-xl opacity-75 blur-sm -z-10"></div>
                )}
                
                <div className="flex items-center justify-between gap-x-4">
                  <h2 id={tier.id} className={classNames(
                    tier.mostPopular ? 'gradient-text' : 'text-white',
                    'text-lg font-semibold leading-8'
                  )}>
                    {tier.name}
                  </h2>
                  {tier.mostPopular ? (
                    <p className="rounded-full gradient-text px-2.5 py-1 text-xs font-semibold leading-5 border border-gray-600">
                      Most popular
                    </p>
                  ) : null}
                </div>
                <p className="mt-4 text-sm leading-6 text-gray-300">{tier.description}</p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold tracking-tight text-white">{tier.price.monthly}</span>
                  {tier.name !== 'Enterprise' && <span className="text-sm font-semibold leading-6 text-gray-300">/month</span>}
                </p>
                <p className="mt-2 text-xs leading-5 text-gray-400">
                  {tier.name !== 'Enterprise' ? 'Billed annually: ' + tier.price.annually : 'Contact us for custom pricing'}
                </p>
                <a
                  href={tier.href}
                  aria-describedby={tier.id}
                  className={classNames(
                    tier.mostPopular
                      ? 'bg-white text-black shadow-sm hover:bg-gray-100'
                      : 'text-white border border-gray-600 hover:border-gray-500',
                    'mt-6 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-accent-1 focus:outline-none'
                  )}
                >
                  {tier.name === 'Enterprise' ? 'Contact sales' : 'Get started'}
                </a>
                <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-300">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <CheckIcon className="h-6 w-5 flex-none text-accent-1" aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mx-auto mt-16 max-w-2xl rounded-xl border border-gray-700 bg-gray-800 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none relative group hover:border-transparent transition-all duration-300">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-1 to-accent-2 rounded-xl opacity-0 group-hover:opacity-75 blur-sm -z-10 transition-opacity duration-300"></div>
          
          <div className="p-8 sm:p-10 lg:flex-auto">
            <h3 className="text-2xl font-bold tracking-tight text-white">Enterprise plan</h3>
            <p className="mt-6 text-base leading-7 text-gray-300">
              For larger organizations with specific needs, our Enterprise plan offers custom solutions, dedicated support, and advanced security features.
            </p>
            <div className="mt-10 flex items-center gap-x-4">
              <h4 className="flex-none text-sm font-semibold leading-6 gradient-text">What's included</h4>
              <div className="h-px flex-auto bg-gray-700" />
            </div>
            <ul
              role="list"
              className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-gray-300 sm:grid-cols-2 sm:gap-6"
            >
              <li className="flex gap-x-3">
                <CheckIcon className="h-6 w-5 flex-none text-accent-1" aria-hidden="true" />
                Dedicated account manager
              </li>
              <li className="flex gap-x-3">
                <CheckIcon className="h-6 w-5 flex-none text-accent-1" aria-hidden="true" />
                24/7 priority support
              </li>
              <li className="flex gap-x-3">
                <CheckIcon className="h-6 w-5 flex-none text-accent-1" aria-hidden="true" />
                Custom integrations
              </li>
              <li className="flex gap-x-3">
                <CheckIcon className="h-6 w-5 flex-none text-accent-1" aria-hidden="true" />
                SSO authentication
              </li>
              <li className="flex gap-x-3">
                <CheckIcon className="h-6 w-5 flex-none text-accent-1" aria-hidden="true" />
                Advanced permissions
              </li>
              <li className="flex gap-x-3">
                <CheckIcon className="h-6 w-5 flex-none text-accent-1" aria-hidden="true" />
                SLA guarantees
              </li>
            </ul>
          </div>
          <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
            <div className="rounded-xl bg-gray-900 py-10 text-center border border-gray-700 lg:flex lg:flex-col lg:justify-center lg:py-16">
              <div className="mx-auto max-w-xs px-8">
                <p className="text-base font-semibold text-gray-300">Contact our sales team</p>
                <p className="mt-6 flex items-baseline justify-center gap-x-2">
                  <span className="text-5xl font-bold tracking-tight text-white">Custom</span>
                  <span className="text-sm font-semibold leading-6 tracking-wide text-gray-300">pricing</span>
                </p>
                <a
                  href="#"
                  className="mt-10 block w-full rounded-md bg-gradient-to-r from-accent-1 to-accent-2 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-opacity duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-accent-1 focus:outline-none"
                >
                  Get in touch
                </a>
                <p className="mt-6 text-xs leading-5 text-gray-400">
                  Invoices and receipts available for easy company reimbursement
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-20 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-white">Frequently asked questions</h2>
          <div className="mt-10 max-w-2xl mx-auto text-left space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-white">Can I switch plans later?</h3>
              <p className="mt-2 text-gray-300">Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Is there a free trial?</h3>
              <p className="mt-2 text-gray-300">Yes, all paid plans come with a 14-day free trial. No credit card required to start.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">How does billing work?</h3>
              <p className="mt-2 text-gray-300">We offer both monthly and annual billing options. Annual plans come with a discount equivalent to getting 2 months free.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">What payment methods do you accept?</h3>
              <p className="mt-2 text-gray-300">We accept all major credit cards, PayPal, and for Enterprise customers, we can arrange invoicing.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
