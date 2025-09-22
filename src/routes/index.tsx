// routes/auth/index.tsx
import { LoginForm } from "@/components/login-form";
import { createFileRoute } from "@tanstack/react-router";

// const { user } = useUser();

export const Route = createFileRoute("/")({
  component: LoginForm,
});
