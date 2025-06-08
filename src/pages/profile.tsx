import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth";
import { userService } from "@/services/userService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
});
const passwordFormSchema = z
  .object({
    oldPassword: z.string().min(1, "Current password is required."),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

function ProfileForm() {
  const { t } = useTranslation();
  const { user, setUser } = useAuthStore();
  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: { name: user?.name || "" },
  });

  const { mutate, isPending: isLoading } = useMutation({
    mutationFn: (data: { name: string }) => userService.updateProfile(data),
    onSuccess: (updatedUser) => {
      toast.success(t("profile.updateSuccess"));
      setUser(updatedUser);
    },
    onError: () => toast.error(t("profile.updateError")),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("profile.tabs.profile")}</CardTitle>
        <CardDescription>{t("profile.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((d) => mutate(d))}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("profile.nameLabel")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem>
              <FormLabel>{t("profile.emailLabel")}</FormLabel>
              <Input value={user?.email || ""} disabled />
            </FormItem>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? t("profile.savingButton") : t("profile.saveButton")}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function SecurityForm() {
  const { t } = useTranslation();
  const form = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: { oldPassword: "", newPassword: "", confirmPassword: "" },
  });
  const { mutate, isPending: isLoading } = useMutation({
    mutationFn: (data: z.infer<typeof passwordFormSchema>) =>
      userService.changePassword(data),
    onSuccess: () => {
      toast.success(t("profile.password.success"));
      form.reset();
    },
    onError: (err: any) =>
      toast.error(err.message || t("profile.password.error")),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("profile.password.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((d) => mutate(d))}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="oldPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("profile.password.currentLabel")}</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("profile.password.newLabel")}</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("profile.password.confirmLabel")}</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {t("profile.password.submitButton")}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default function ProfilePage() {
  const { t } = useTranslation();
  return (
    <div className="w-full max-w-4xl p-4 sm:p-8">
      <h1 className="text-3xl font-bold tracking-tight mb-6">
        {t("profile.title")}
      </h1>
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-sm">
          <TabsTrigger value="profile">{t("profile.tabs.profile")}</TabsTrigger>
          <TabsTrigger value="security">
            {t("profile.tabs.security")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="mt-6">
          <ProfileForm />
        </TabsContent>
        <TabsContent value="security" className="mt-6">
          <SecurityForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
