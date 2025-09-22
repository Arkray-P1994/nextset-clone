import { useState } from "react";
import type { Control, FieldValues, Path } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PasswordFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  disabled?: boolean;
}

const PasswordField = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  disabled,
}: PasswordFieldProps<T>) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <Label htmlFor={name}>{label}</Label>
          <div className="relative">
            <FormControl>
              <Input
                id={name}
                disabled={disabled}
                className="pe-9"
                placeholder={placeholder}
                type={isVisible ? "text" : "password"}
                {...field}
              />
            </FormControl>
            <button
              className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 ring-offset-background transition-shadow hover:text-foreground focus-visible:border focus-visible:border-ring focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
              type="button"
              onClick={() => setIsVisible(!isVisible)}
              aria-label={isVisible ? "Hide password" : "Show password"}
              aria-pressed={isVisible}
            >
              {isVisible ? (
                <EyeOff size={16} strokeWidth={2} />
              ) : (
                <Eye size={16} strokeWidth={2} />
              )}
            </button>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default PasswordField;
