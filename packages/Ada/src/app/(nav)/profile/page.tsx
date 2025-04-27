import { AnimatedLayout } from '@/components/global/animated-layout';
import { ProfileActivity } from '@/components/profile/profile-activity';
import { ProfileStats } from '@/components/profile/profile-stats';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Mail,
  MapPin,
  Phone,
  Globe,
  Briefcase,
  Calendar,
  Star,
  Edit,
  Share2,
  Download,
} from 'lucide-react';

export default function ProfilePage() {
  return (
    <AnimatedLayout>
      <main className="p-6 space-y-6 star-bg">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight ">My Profile</h1>
            <p className="mt-2">Manage your personal profile and information</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Share2 size={16} />
              <span>Share</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Download size={16} />
              <span>Export</span>
            </Button>
            <Button size="sm" className="flex items-center gap-2">
              <Edit size={16} />
              <span>Edit Profile</span>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Profile Card */}
          <Card className="md:col-span-1 bg-card/50 backdrop-blur-sm border-purple-800/30 glow-effect">
            <CardHeader className="pb-2">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src="/profile_picture.png" />
                  <AvatarFallback className="bg-purple-800 text-purple-200 text-xl">
                    JD
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl">Jane Doe</CardTitle>
                <CardDescription className="">
                  Senior Frontend Developer
                </CardDescription>
                <div className="flex items-center gap-1 mt-2  text-sm">
                  <MapPin size={14} />
                  <span>San Francisco, CA</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="pt-4 space-y-3">
                <div className="flex items-center gap-3 ">
                  <Mail size={16} className="" />
                  <span>jane.doe@example.com</span>
                </div>
                <div className="flex items-center gap-3 ">
                  <Phone size={16} className="" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-3 ">
                  <Globe size={16} className="" />
                  <span>janedoe.dev</span>
                </div>
                <div className="flex items-center gap-3 ">
                  <Briefcase size={16} className="" />
                  <span>TechCorp Inc.</span>
                </div>
                <div className="flex items-center gap-3 ">
                  <Calendar size={16} className="" />
                  <span>Joined April 2022</span>
                </div>
              </div>

              <div className="pt-4">
                <h3 className="text-sm font-medium  mb-2">Bio</h3>
                <p className="text-sm ">
                  Frontend developer with 5+ years of experience specializing in
                  React, TypeScript, and UI/UX design. Passionate about creating
                  accessible and performant web applications.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Stats */}
            <ProfileStats />

            {/* Skills */}
            <Card className="bg-card/50 backdrop-blur-sm border-purple-800/30 glow-effect">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg ">Skills & Expertise</CardTitle>
                  <Button variant="ghost" size="sm" className="h-8 ">
                    <Edit size={16} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {[
                    'React',
                    'TypeScript',
                    'JavaScript',
                    'HTML',
                    'CSS',
                    'Tailwind CSS',
                    'Next.js',
                    'Node.js',
                    'GraphQL',
                    'UI/UX Design',
                    'Responsive Design',
                    'Accessibility',
                    'Git',
                    'Jest',
                    'Cypress',
                  ].map((skill) => (
                    <div
                      key={skill}
                      className="flex items-center gap-1 px-3 py-1 bg-purple-800/30  rounded-full text-sm"
                    >
                      <Star size={12} className="" />
                      <span>{skill}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <ProfileActivity />
          </div>
        </div>
      </main>
    </AnimatedLayout>
  );
}
