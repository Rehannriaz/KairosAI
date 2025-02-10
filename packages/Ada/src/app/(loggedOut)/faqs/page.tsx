import { FAQItem } from '@/components/LoggedOut/faq-item';
import Navbar from '@/components/LoggedOut/navbar';
import { SparklesCore } from '@/components/LoggedOut/sparkles';
import { HelpCircle } from 'lucide-react';

export default function FAQsPage() {
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
            Frequently Asked Questions
          </h1>
          <p className="text-gray-400 text-xl mb-12 text-center max-w-3xl mx-auto">
            Got questions? We've got answers. If you can't find what you're
            looking for, feel free to contact our support team.
          </p>

          <div className="grid gap-6 mb-12">
            <FAQItem
              question="How does the platform help with job applications?"
              answer="Our platform automates the job application process by parsing resumes, extracting key details, and auto-filling applications on company websites. It also provides job recommendations based on your profile and preferences."
            />

            <FAQItem
              question="How accurate is the resume parsing feature?"
              answer="Our AI-driven resume parser leverages NLP techniques to extract essential information such as skills, experience, education, and contact details with high accuracy. However, we recommend reviewing parsed details before submitting applications."
            />

            <FAQItem
              question="Can I edit my application before submitting?"
              answer="Yes! You can review and edit the extracted information before finalizing and submitting an application to ensure accuracy and completeness."
            />

            <FAQItem
              question="How does the job scraping module work?"
              answer="Our job scraping system continuously scans job boards and company career pages to gather relevant job postings, ensuring you have access to the latest opportunities."
            />

            <FAQItem
              question="Is my data secure on the platform?"
              answer="Absolutely. We prioritize data security by encrypting all stored information and ensuring compliance with industry standards. You can also delete your data at any time."
            />

            <FAQItem
              question="Does the platform provide interview assistance?"
              answer="Yes! We offer a mock interview chatbot powered by AI to help you practice common interview questions and receive feedback on your responses."
            />

            <FAQItem
              question="How does the ATS optimization feature work?"
              answer="Our ATS optimization analyzes your resume against job descriptions, suggesting improvements to ensure your application passes applicant tracking systems used by recruiters."
            />

            <FAQItem
              question="Which job platforms are supported?"
              answer="Our system integrates with multiple job boards and career sites. However, some websites with strict anti-scraping measures may have limited support."
            />
          </div>

          <div className="bg-purple-900/20 border border-purple-500/20 rounded-lg p-8 backdrop-blur-sm">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
              <HelpCircle className="w-6 h-6 mr-2 text-purple-400" />
              Still have questions?
            </h2>
            <p className="text-gray-300 mb-4">
              Our support team is here to help. Contact us anytime and we'll get
              back to you as soon as possible.
            </p>
            <a
              href="#"
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded transition duration-300"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
