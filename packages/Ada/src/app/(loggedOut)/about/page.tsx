import Navbar from '@/components/LoggedOut/navbar';
import { SparklesCore } from '@/components/LoggedOut/sparkles';
import { TeamMember } from '@/components/LoggedOut/team-member';
import { Sparkles } from 'lucide-react';

export default function AboutPage() {
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
            About
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              {' '}
              KairosAI
            </span>
          </h1>
          <p className="text-gray-400 text-xl mb-12 text-center max-w-3xl mx-auto">
            We're on a mission to transform the job search experience by
            harnessing AI to simplify applications, optimize resumes, and match
            you with the perfect opportunities—saving you time and maximizing
            your success.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <TeamMember
              name="Adeen Amir"
              role="Founder"
              image="/adeen_profile.png"
              bio="Fullstack Developer"
            />
            <TeamMember
              name="Muhammad Rehan"
              role="Founder"
              image="/rehan_profile.png"
              bio="Fullstack Developer"
            />
            <TeamMember
              name="Zaid Bin Muzammil"
              role="Founder"
              image="/zaid_profile_1.png"
              bio="Fullstack Developer"
            />
          </div>

          <div className="bg-purple-900/20 border border-purple-500/20 rounded-lg p-8 backdrop-blur-sm">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
              <Sparkles className="w-6 h-6 mr-2 text-purple-400" />
              Our Vision
            </h2>
            <p className="text-gray-300">
              We envision a future where job searching is effortless and
              accessible to everyone. By leveraging cutting-edge AI technology,
              we're breaking down barriers between job seekers and
              opportunities—automating applications, optimizing resumes, and
              streamlining the path to your dream career.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
