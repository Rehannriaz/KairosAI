import { AnimatedLayout } from '@/components/global/animated-layout';
import { SettingsToggle } from '@/components/settings/settings-toggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Bell,
  Moon,
  Lock,
  CreditCard,
  LogOut,
  Upload,
  ChevronRight,
} from 'lucide-react';
import type React from 'react';

export default function SettingsPage() {
  return (
    <AnimatedLayout>
      <main className="p-6 space-y-6 star-bg">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className=" mt-2">Manage your account settings and preferences.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-5">
          <Card className="md:col-span-2 bg-card/50 backdrop-blur-sm border-purple-800/30 glow-effect">
            <CardHeader>
              <CardTitle className="text-purple-300">Profile</CardTitle>
              <CardDescription className="text-purple-300/70">
                Manage your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/profile_picture.png" />
                  <AvatarFallback className="bg-purple-800 text-purple-200 text-xl">
                    U
                  </AvatarFallback>
                </Avatar>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Upload size={14} />
                  <span>Change Avatar</span>
                </Button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="text-sm font-medium text-purple-300"
                  >
                    Full Name
                  </label>
                  <Input id="name" defaultValue="User Name" />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-purple-300"
                  >
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue="user@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="bio"
                    className="text-sm font-medium text-purple-300"
                  >
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    rows={3}
                    className="w-full rounded-md border border-purple-800/30 bg-purple-900/30 px-3 py-2 text-sm text-purple-200 ring-offset-background placeholder:text-purple-400/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
                    defaultValue="Frontend developer with 5 years of experience."
                  />
                </div>

                <Button className="w-full">Save Changes</Button>
              </div>
            </CardContent>
          </Card>

          <div className="md:col-span-3 space-y-6">
            <SettingsSection
              icon={<Bell className="h-5 w-5 text-purple-400" />}
              title="Notifications"
              description="Manage how you receive notifications"
            >
              <div className="space-y-4">
                <SettingsToggle
                  title="Email Notifications"
                  description="Receive job recommendations via email"
                  defaultChecked={true}
                />
                <SettingsToggle
                  title="Push Notifications"
                  description="Get notified about new job matches"
                  defaultChecked={true}
                />
                <SettingsToggle
                  title="SMS Alerts"
                  description="Receive urgent notifications via text message"
                  defaultChecked={false}
                />
                <SettingsToggle
                  title="Weekly Digest"
                  description="Get a summary of your activity every week"
                  defaultChecked={true}
                />
              </div>
            </SettingsSection>

            <SettingsSection
              icon={<Moon className="h-5 w-5 text-purple-400" />}
              title="Appearance"
              description="Customize how KairosAI looks"
            >
              <div className="space-y-4">
                <SettingsToggle
                  title="Dark Mode"
                  description="Use dark theme throughout the application"
                  defaultChecked={true}
                />
                <SettingsToggle
                  title="Reduce Animations"
                  description="Minimize motion for accessibility"
                  defaultChecked={false}
                />
              </div>
            </SettingsSection>

            <SettingsSection
              icon={<Lock className="h-5 w-5 text-purple-400" />}
              title="Privacy & Security"
              description="Manage your privacy settings"
            >
              <div className="space-y-4">
                <SettingsToggle
                  title="Profile Visibility"
                  description="Allow employers to view your profile"
                  defaultChecked={true}
                />
                <SettingsToggle
                  title="Two-Factor Authentication"
                  description="Add an extra layer of security to your account"
                  defaultChecked={false}
                />
                <div className="pt-2">
                  <Button variant="outline" className="w-full justify-between">
                    Change Password
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            </SettingsSection>

            <SettingsSection
              icon={<CreditCard className="h-5 w-5 text-purple-400" />}
              title="Billing"
              description="Manage your subscription and payment methods"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between p-2 rounded-md bg-purple-800/20">
                  <div>
                    <p className="font-medium text-purple-300">Free Plan</p>
                    <p className="text-sm text-purple-300/70">
                      Basic features included
                    </p>
                  </div>
                  <Button size="sm">Upgrade</Button>
                </div>
                <Button variant="outline" className="w-full justify-between">
                  Billing History
                  <ChevronRight size={16} />
                </Button>
              </div>
            </SettingsSection>

            <div className="pt-4">
              <Button
                variant="outline"
                className="w-full text-red-400 border-red-900/30 hover:bg-red-900/20 hover:text-red-300 flex items-center gap-2"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </AnimatedLayout>
  );
}

interface SettingsSectionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}

function SettingsSection({
  icon,
  title,
  description,
  children,
}: SettingsSectionProps) {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-purple-800/30 glow-effect overflow-hidden">
      <CardHeader>
        <div className="flex items-center gap-2">
          {icon}
          <div>
            <CardTitle className="text-lg text-purple-300">{title}</CardTitle>
            <CardDescription className="text-purple-300/70">
              {description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
