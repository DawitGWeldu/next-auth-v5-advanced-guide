"use client";

import { startTransition, useCallback, useEffect, useState, useTransition } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";


import { newVerification } from "@/actions/new-verification";

import { otpSchema } from "@/schemas";

import { CardWrapper } from "@/components/auth/card-wrapper";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { OTPInput } from '@/components/auth/otp-input';
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";



export const NewVerificationForm = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const router = useRouter();



  const form = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),

  });
  const onSubmit = (values: z.infer<typeof otpSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      newVerification(values.otp)
        .then((data) => {
          if (data?.error) {
            setError(data.error);
          }

          if (data?.success) {
            setSuccess(data.success);
            setTimeout(() => {
              router.push("/auth/login")
            }, 3000);
          }
        })
        .catch(() => setError("Something went wrong"));
    });
  };

  return (
    <>

      <CardWrapper
        headerLabel="Verify your phone number"
        backButtonLabel="Back to login"
        backButtonHref="/auth/login"
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verivication Code</FormLabel>
                    <FormControl>
                      <OTPInput
                        {...field}
                        placeholder="-"
                        type="number"
                        autoFocus
                      />
                    </FormControl>
        
                    <FormMessage />
                  </FormItem>
                )}
              />

            </div>
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </CardWrapper>
    </>
  )
}