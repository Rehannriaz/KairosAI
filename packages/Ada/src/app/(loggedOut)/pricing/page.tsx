import Navbar from '@/components/LoggedOut/navbar';
import { PricingCard } from '@/components/LoggedOut/pricing-card';
import { SparklesCore } from '@/components/LoggedOut/sparkles';
import { Check } from 'lucide-react';

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      <div className="h-full w-full absolute inset-0 z-0">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
      </div>

      <div className="relative z-10">
        <Navbar />
        <div className="container mx-auto px-6 py-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 text-center">
            Find Your Dream Job Faster
          </h1>
          <p className="text-gray-400 text-xl mb-12 text-center max-w-3xl mx-auto">
            Automate your job search with AI-powered resume optimization, job
            scraping, and auto-applications. Choose the plan that fits your
            needs.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <PricingCard
              title="Starter"
              price="$9.99"
              period="per month"
              features={[
                'Resume parsing & formatting',
                '5 job applications per month',
                'Basic job recommendations',
                'Standard support',
              ]}
              ctaText="Get Started"
            />
            <PricingCard
              title="Pro"
              price="$24.99"
              period="per month"
              features={[
                'Advanced resume optimization',
                '25 job applications per month',
                'AI-powered job matching',
                'ATS keyword analysis',
                'Priority support',
              ]}
              ctaText="Upgrade to Pro"
              highlighted={true}
            />
            <PricingCard
              title="Elite"
              price="Custom"
              period="contact us for pricing"
              features={[
                'Unlimited applications',
                'Automated job scraping',
                'Auto-apply on selected sites',
                'Mock interview AI chatbot',
                'Dedicated career advisor',
                '24/7 premium support',
              ]}
              ctaText="Contact Sales"
            />
          </div>

          <div className="bg-blue-900/20 border border-blue-500/20 rounded-lg p-8 backdrop-blur-sm">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
              <Check className="w-6 h-6 mr-2 text-blue-400" />
              All plans include
            </h2>
            <ul className="text-gray-300 grid grid-cols-1 md:grid-cols-2 gap-4">
              <li className="flex items-center">
                <Check className="w-5 h-5 mr-2 text-blue-400" />
                AI-powered resume parsing
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 mr-2 text-blue-400" />
                Job tracking dashboard
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 mr-2 text-blue-400" />
                Secure cloud storage for applications
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 mr-2 text-blue-400" />
                Regular AI enhancements & updates
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
