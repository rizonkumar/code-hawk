"use client";

import { ProfileForm } from "@/module/settings/components/profile-form";
import { Separator } from "@/components/ui/separator";
import { RespositoryList } from "@/module/settings/components/repository-list";

const SettingPage = () => {
  return (
    <div className="space-y-6 max-w-3xl">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and connected repositories.
        </p>
      </div>
      <Separator />
      <div className="space-y-10">
        <ProfileForm />
        <RespositoryList />
      </div>
    </div>
  );
};

export default SettingPage;
