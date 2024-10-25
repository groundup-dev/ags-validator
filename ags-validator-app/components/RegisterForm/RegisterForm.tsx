"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
import { Check, LoaderCircle } from "lucide-react";
import { useState } from "react";

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
});

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    const response = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify(values),
    });
    setIsLoading(false);

    if (!response.ok) {
      console.error("Failed to submit form");
      const data = await response.json();
      setError(data.error);

      return;
    } else {
      setIsSuccess(true);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex gap-4 flex-col sm:flex-row">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="sm:w-1/2">
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem className="sm:w-1/2">
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col min-h-16 items-center justify-center">
          {!isLoading && !isSuccess && (
            <Button
              variant="secondary"
              type="submit"
              className="w-32 self-center rounded-full"
            >
              Register
            </Button>
          )}
          {isSuccess && (
            <span className="flex flex-row gap-2">
              <Check />
              Success! We will contact you when GroundUp is ready.
            </span>
          )}

          {isLoading && <LoaderCircle className="animate-spin w-6 h-6" />}
          {error && <FormMessage>{error}</FormMessage>}
        </div>
      </form>
    </Form>
  );
}
