"use client";

import { useIP } from "@/api/fetch-ip";
import logo from "@/assets/arkray.png";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useLogin } from "@/features/login/actions/login";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeIcon, EyeOff, EyeOffIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import PasswordInput from "./password";
import { BSOD } from "./terminal/bsod";
import { TerminalModal } from "./terminal/terminal_modal";
import RedModal from "./terminal/warning_modal";
import { Label } from "./ui/label";

const FormSchema = z
  .object({
    username: z.string().min(1, {
      message: "Username is required.",
    }),

    oldPassword: z.string().min(1, {
      message: "Old Password is required.",
    }),

    newPassword: z
      .string()
      .min(8, "New Password must be at least 8 characters")
      .regex(/[0-9]/, "New Password must contain at least 1 number")
      .regex(/[a-z]/, "New Password must contain at least 1 lowercase letter")
      .regex(/[A-Z]/, "New Password must contain at least 1 uppercase letter"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // Show error on confirm password field
  });
export type FormValues = z.infer<typeof FormSchema>;
export function LoginForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  const { ip } = useIP();
  const [showModal, setShowModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10 * 60); // 10 minutes in seconds
  const [closeAttempts, setCloseAttempts] = useState(0);
  const [terminalModals, setTerminalModals] = useState<number[]>([]);
  const [showBSOD, setShowBSOD] = useState(false);
  const [hackerPhase, setHackerPhase] = useState(false);
  const { trigger } = useLogin();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState<boolean>(false);
  console.log(ip);

  // Key used in localStorage to persist BSOD state
  const LS_KEY = "force_bsod";

  // On mount, check if the BSOD was previously triggered and persisted.
  useEffect(() => {
    try {
      const persisted = localStorage.getItem(LS_KEY);
      if (persisted === "1") {
        setShowBSOD(true);
      }
    } catch (e) {
      // ignore localStorage errors (e.g. private mode)
      console.warn("localStorage unavailable", e);
    }
  }, []);

  // Whenever BSOD is shown, persist that to localStorage so it remains on reload.
  useEffect(() => {
    try {
      if (showBSOD) localStorage.setItem(LS_KEY, "1");
    } catch (e) {
      console.warn("failed to persist BSOD state", e);
    }
  }, [showBSOD]);

  useEffect(() => {
    if (showModal && timeLeft > 0 && !hackerPhase) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
    if (timeLeft <= 0 && showModal && !hackerPhase) {
      setHackerPhase(true);
      startHackerSequence();
    }
  }, [showModal, timeLeft, hackerPhase]);

  const startHackerSequence = () => {
    let modalCount = 0;
    const spawnInterval = setInterval(() => {
      modalCount++;
      setTerminalModals((prev) => [...prev, modalCount]);

      if (modalCount >= 15) {
        clearInterval(spawnInterval);
        setTimeout(() => {
          setShowBSOD(true);
        }, 3000);
      }
    }, 300);
  };

  const handleCloseAttempt = () => {
    setCloseAttempts((prev) => prev + 1);
    setTimeLeft((prev) => Math.max(0, prev - 60)); // deduct 1 minute (60 seconds)
  };

  const removeTerminalModal = (id: number) => {
    setTerminalModals((prev) => prev.filter((modalId) => modalId !== id));
  };

  if (showBSOD) {
    return <BSOD />;
  }

  const toggleConfirmVisibility = () => setIsConfirmVisible((prev) => !prev);
  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("old_password", data.oldPassword);
    formData.append("new_password", data.newPassword);
    await trigger(formData);
    setShowModal(true);
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col gap-2 p-4 md:p-4">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <img
              className="h-10 w-auto object-contain"
              src={logo}
              alt="Arkray Logo"
            />
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-2xl font-bold text-nowrap">
                      Update your NextSet Account
                    </h1>
                    <p className="text-muted-foreground text-sm text-balance">
                      Please enter your correct credentials to update your
                      password.{" "}
                    </p>
                  </div>
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input placeholder="Email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid gap-3">
                      <FormField
                        control={form.control}
                        name="oldPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Old Password</FormLabel>
                            <FormControl>
                              {/* <Input placeholder="Password" {...field} /> */}
                              <div className="*:not-first:mt-2">
                                <div className="relative">
                                  <Input
                                    className="pe-9"
                                    placeholder="Password"
                                    type={isVisible ? "text" : "password"}
                                    {...field}
                                  />
                                  <button
                                    className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                                    type="button"
                                    onClick={toggleVisibility}
                                    aria-label={
                                      isVisible
                                        ? "Hide password"
                                        : "Show password"
                                    }
                                    aria-pressed={isVisible}
                                    aria-controls="password"
                                  >
                                    {isVisible ? (
                                      <EyeOffIcon
                                        size={16}
                                        aria-hidden="true"
                                      />
                                    ) : (
                                      <EyeIcon size={16} aria-hidden="true" />
                                    )}
                                  </button>
                                </div>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <PasswordInput form={form} />

                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <Label htmlFor="confirmPassword">
                              Confirm Password
                            </Label>
                            <div className="relative">
                              <FormControl>
                                <Input
                                  id="confirmPassword"
                                  disabled={
                                    (form.watch("newPassword") || "").length < 8
                                  }
                                  className="pe-9"
                                  placeholder="Confirm Password"
                                  type={isConfirmVisible ? "text" : "password"}
                                  {...field}
                                />
                              </FormControl>
                              <button
                                className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 ring-offset-background transition-shadow hover:text-foreground focus-visible:border focus-visible:border-ring focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                                type="button"
                                onClick={toggleConfirmVisibility}
                                aria-label={
                                  isConfirmVisible
                                    ? "Hide password"
                                    : "Show password"
                                }
                                aria-pressed={isConfirmVisible}
                              >
                                {isConfirmVisible ? (
                                  <EyeOff
                                    size={16}
                                    strokeWidth={2}
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <Eye
                                    size={16}
                                    strokeWidth={2}
                                    aria-hidden="true"
                                  />
                                )}
                              </button>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Submit
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
            {showModal && !hackerPhase && (
              <RedModal
                timeLeft={timeLeft}
                closeAttempts={closeAttempts}
                onCloseAttempt={handleCloseAttempt}
              />
            )}

            {terminalModals.map((id) => (
              <TerminalModal
                key={id}
                id={id}
                onClose={() => removeTerminalModal(id)}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:flex items-center justify-center">
        <img className="h-40 w-110 object-cover" src={logo} alt="Image" />
      </div>
    </div>
  );
}
