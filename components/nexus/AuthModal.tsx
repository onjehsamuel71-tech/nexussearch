import { useState } from "react";
import { Sparkles, Mail, Lock, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-slate-800 bg-slate-900 text-slate-100 sm:max-w-md">
        <DialogHeader>
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg shadow-blue-900/50">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle className="font-serif text-xl text-white">Nexus Account</DialogTitle>
              <DialogDescription className="text-xs text-cyan-400/90">
                Powered by Orion AI
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="signin" className="mt-2">
          <TabsList className="grid w-full grid-cols-2 bg-slate-950/60">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="create">Create Nexus ID</TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signin-email" className="text-slate-300">
                Email
              </Label>
              <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/60 px-3">
                <Mail className="h-4 w-4 text-slate-500" />
                <Input
                  id="signin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="border-0 bg-transparent text-slate-100 placeholder:text-slate-600 focus-visible:ring-0"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="signin-password" className="text-slate-300">
                Password
              </Label>
              <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/60 px-3">
                <Lock className="h-4 w-4 text-slate-500" />
                <Input
                  id="signin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="border-0 bg-transparent text-slate-100 placeholder:text-slate-600 focus-visible:ring-0"
                />
              </div>
            </div>
            <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-500 hover:to-cyan-400">
              Sign In
            </Button>
          </TabsContent>

          <TabsContent value="create" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="create-name" className="text-slate-300">
                Full Name
              </Label>
              <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/60 px-3">
                <User className="h-4 w-4 text-slate-500" />
                <Input
                  id="create-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Amara Okonkwo"
                  className="border-0 bg-transparent text-slate-100 placeholder:text-slate-600 focus-visible:ring-0"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-email" className="text-slate-300">
                Email
              </Label>
              <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/60 px-3">
                <Mail className="h-4 w-4 text-slate-500" />
                <Input
                  id="create-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="border-0 bg-transparent text-slate-100 placeholder:text-slate-600 focus-visible:ring-0"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-password" className="text-slate-300">
                Password
              </Label>
              <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/60 px-3">
                <Lock className="h-4 w-4 text-slate-500" />
                <Input
                  id="create-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  className="border-0 bg-transparent text-slate-100 placeholder:text-slate-600 focus-visible:ring-0"
                />
              </div>
            </div>
            <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-500 hover:to-cyan-400">
              Create Nexus ID
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}