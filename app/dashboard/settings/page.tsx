"use client";

import { ProfileForm } from "@/module/settings/components/profile-form";
import { Separator } from "@/components/ui/separator";

const SettingPage = () => {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>
      <Separator />
      <ProfileForm />
    </div>
  );
};

export default SettingPage;
