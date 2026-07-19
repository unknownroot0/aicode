"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Mail,
  Phone,
  MapPin,
  User,
  Layers,
  PenLine,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  subject: z.string().min(2, {
    message: "Subject must be at least 2 characters.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

export default function ContactPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast.success("Message sent successfully!");
    form.reset();
  }

  return (
    <div className="relative min-h-svh w-full flex flex-col items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/common-hero-bg.png')" }}
      />

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-20 lg:pb-28 pt-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Contact Info */}
          <div>
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 mb-4">
              <Link href="/" className="text-[#C7C0AF] text-sm">
                Home
              </Link>
              <ChevronRight className="size-4" />
              <span className="text-[#FEF5DE] text-sm">Contact</span>
            </nav>

            <div className="mb-8 md:mb-16">
              <h1 className="text-2xl md:text-3xl font-semibold text-[#FEF5DE] uppercase mb-5">
                Contact Us
              </h1>
              <p className="text-[#FEF5DECC] text-sm sm:max-w-md">
                Have questions, feedback, or just want to say hello? We’d love
                to hear from you.
              </p>
            </div>

            <div className="md:space-y-8 space-y-5">
              {/* Email Card */}
              <div className="flex items-start gap-5 group">
                <div className="size-9.5 rounded-full bg-[#69E5BB] flex items-center justify-center shrink-0 transition-transform group-hover:scale-110">
                  <Mail className="size-5 text-[#11160E]" />
                </div>
                <div>
                  <h3 className="text-[#FEF5DE] font-semibold md:text-base text-sm uppercase">
                    Email
                  </h3>
                  <Link
                    href="mailto:games@diceymio.com"
                    className="text-[#C7C0AF] text-sm"
                  >
                    games@diceymio.com
                  </Link>
                </div>
              </div>

              {/* Phone Card */}
              <div className="flex items-start gap-5 group">
                <div className="size-9.5 rounded-full bg-[#69E5BB] flex items-center justify-center shrink-0 transition-transform group-hover:scale-110">
                  <Phone className="size-5 text-[#11160E]" />
                </div>
                <div>
                  <h3 className="text-[#FEF5DE] font-semibold md:text-base text-sm uppercase">
                    Phone
                  </h3>
                  <Link
                    href="tel:+8801740711194"
                    className="text-[#C7C0AF] text-sm"
                  >
                    +8801740711194
                  </Link>
                </div>
              </div>

              {/* Location Card */}
              <div className="flex items-start gap-5 group">
                <div className="size-9.5 rounded-full bg-[#69E5BB] flex items-center justify-center shrink-0 transition-transform group-hover:scale-110">
                  <MapPin className="size-5 text-[#11160E]" />
                </div>
                <div>
                  <h3 className="text-[#FEF5DE] font-semibold md:text-base text-sm uppercase">
                    Location
                  </h3>
                  <p className="text-[#C7C0AF] text-sm leading-relaxed">
                    bangladesh, Dhaka, Bangladesh, 1216
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-[#FEF5DE] text-xl font-medium uppercase mb-6">
              Send us a message
            </h2>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                {/* Full Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative group">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-white transition-colors z-10" />
                          <Input
                            placeholder="Full Name"
                            className="pl-10.5 bg-[#FFFFFF17] backdrop-blur-sm border-[#FFFFFF1F] text-white placeholder:text-[#FFFFFF94] h-12 focus:border-[#69E5BB]/50 transition-all rounded-xl"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* Email Address */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative group">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-white transition-colors z-10" />
                          <Input
                            placeholder="Email Address"
                            type="email"
                            className="pl-10.5 bg-[#FFFFFF17] backdrop-blur-sm border-[#FFFFFF1F] text-white placeholder:text-[#FFFFFF94] h-12 focus:border-[#69E5BB]/50 transition-all rounded-xl"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* Subject */}
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative group">
                          <Layers className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-white transition-colors z-10" />
                          <Input
                            placeholder="Subject"
                            className="pl-10.5 bg-[#FFFFFF17] backdrop-blur-sm border-[#FFFFFF1F] text-white placeholder:text-[#FFFFFF94] h-12 focus:border-[#69E5BB]/50 transition-all rounded-xl"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* Message */}
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative group">
                          <PenLine className="absolute left-4 top-4 size-4 text-white transition-colors z-10" />
                          <Textarea
                            placeholder="Message"
                            className="pl-10.5 bg-[#FFFFFF17] backdrop-blur-sm border-[#FFFFFF1F] text-white placeholder:text-[#FFFFFF94] min-h-35 focus:border-[#69E5BB]/50 transition-all resize-none pt-3.5"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-[#EAEA4C] hover:bg-[#dcdc3c] text-[#12100A] font-semibold h-14 rounded-lg border-2 border-b-4 border-[#8c8c24] uppercase mt-4 flex items-center justify-center cursor-pointer active:scale-95 transition-all"
                >
                  Send Message
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
