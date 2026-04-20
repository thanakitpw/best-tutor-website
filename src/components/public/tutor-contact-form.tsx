"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

/**
 * Mirrors the subset of `/api/leads` request schema that we collect from this
 * contact form. `subjectCategory` is required by the API so we always pass it
 * (defaulting to the first subject the tutor teaches). Phone regex matches
 * the backend so users get the same validation experience.
 */
const PHONE_REGEX = /^[0-9+\-() ]{9,20}$/;

const formSchema = z.object({
  fullName: z.string().trim().min(2, "กรุณากรอกชื่ออย่างน้อย 2 ตัวอักษร").max(100),
  phone: z
    .string()
    .trim()
    .regex(PHONE_REGEX, "เบอร์โทรไม่ถูกต้อง (ใช้ตัวเลข + หรือ - เท่านั้น)"),
  subject: z.string().trim().min(1, "กรุณาเลือกวิชาที่สนใจ"),
  learningGoal: z.string().trim().max(500).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface TutorContactFormProps {
  tutorNickname: string;
  tutorSlug: string;
  /** Subjects the tutor actually teaches — used to pre-fill select options. */
  subjects: readonly string[];
  /** Parent subject category used as `subjectCategory` in API payload. */
  subjectCategory: string;
}

export function TutorContactForm({
  tutorNickname,
  tutorSlug,
  subjects,
  subjectCategory,
}: TutorContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      subject: subjects[0] ?? "",
      learningGoal: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subjectCategory,
          subject: values.subject,
          learningGoal: values.learningGoal || `สนใจเรียนกับครู${tutorNickname} (${tutorSlug})`,
          fullName: values.fullName,
          phone: values.phone,
        }),
      });

      if (!res.ok) {
        // Try to surface the server-side Thai error message when available.
        let message = "ส่งข้อความไม่สำเร็จ กรุณาลองใหม่";
        try {
          const data = (await res.json()) as { error?: { message?: string } };
          if (data?.error?.message) message = data.error.message;
        } catch {
          // Ignore JSON parse errors — keep the generic message.
        }
        toast.error(message);
        return;
      }

      toast.success("ส่งข้อความแล้ว — ทีมงานจะติดต่อกลับใน 24 ชม.");
      form.reset({
        fullName: "",
        phone: "",
        subject: subjects[0] ?? "",
        learningGoal: "",
      });
    } catch (err) {
      console.error("[TutorContactForm] submit failed:", err);
      toast.error("ส่งข้อความไม่สำเร็จ กรุณาลองใหม่");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-2xl border border-[color:var(--color-border)] bg-white p-5 shadow-sm md:p-7">
      <div className="mb-5">
        <h3 className="text-xl font-bold text-[color:var(--color-heading)] md:text-2xl">
          สนใจเรียนกับครู{tutorNickname}?
        </h3>
        <p className="mt-1 text-sm text-[color:var(--color-muted)]">
          กรอกข้อมูลสั้น ๆ ทีมงานจะติดต่อกลับเพื่อจัดคอร์สให้ภายใน 24 ชม.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-4 md:grid-cols-2"
        >
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ชื่อ-นามสกุล / ชื่อเล่น *</FormLabel>
                <FormControl>
                  <Input placeholder="เช่น คุณแม่พิมพ์ / น้องออม" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>เบอร์โทร *</FormLabel>
                <FormControl>
                  <Input type="tel" inputMode="tel" placeholder="08x-xxx-xxxx" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>วิชาที่สนใจ *</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="เลือกวิชา" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="learningGoal"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>ข้อความ (ไม่บังคับ)</FormLabel>
                <FormControl>
                  <Textarea
                    rows={3}
                    placeholder="เช่น ต้องการเรียน 2 คาบ/สัปดาห์ สำหรับน้อง ม.5 เตรียมสอบ..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="md:col-span-2">
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="h-12 w-full bg-[color:var(--color-primary)] text-base font-semibold text-white hover:bg-[color:var(--color-primary-hover)] md:w-auto"
            >
              {isSubmitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Send className="size-4" />
              )}
              ส่งข้อความ
            </Button>
            <p className="mt-2 text-xs text-[color:var(--color-muted)]">
              โดยการกดส่ง คุณยอมรับ{" "}
              <a
                href="/privacy"
                className="underline underline-offset-2 hover:text-[color:var(--color-primary)]"
              >
                นโยบายความเป็นส่วนตัว
              </a>{" "}
              ของเรา
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
}
