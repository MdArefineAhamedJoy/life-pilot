"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ImageUp,
  LockKeyhole,
  Mail,
  Phone,
  UserRound,
  X,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export function RegisterStepForm() {
  const router = useRouter();
  const [profileImageName, setProfileImageName] = useState("");
  const [profileImagePreview, setProfileImagePreview] = useState("");
  const [isProfileImageOpen, setIsProfileImageOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accepted, setAccepted] = useState(false);
  const { error, isSubmitting, register } = useAuth();
  const hasValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canCreate =
    Boolean(profileImageName && fullName.trim() && phone.trim()) &&
    hasValidEmail &&
    password.length >= 8 &&
    confirmPassword === password &&
    accepted;

  useEffect(() => {
    return () => {
      if (profileImagePreview) {
        URL.revokeObjectURL(profileImagePreview);
      }
    };
  }, [profileImagePreview]);

  function handleProfileImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    setProfileImageName(file?.name ?? "");
    setProfileImagePreview((currentPreview) => {
      if (currentPreview) {
        URL.revokeObjectURL(currentPreview);
      }

      return file ? URL.createObjectURL(file) : "";
    });
    setIsProfileImageOpen(false);
  }

  async function handleCreateAccount() {
    try {
      await register({
        name: fullName,
        email,
        phone,
        password,
      });
      router.push("/dashboard");
    } catch {
      // The reusable auth hook exposes the error state to the form.
    }
  }

  return (
    <>
      <div className="mt-3 space-y-2.5 sm:mt-5 sm:space-y-3">
        <div className="flex justify-center">
          <div className="relative">
            {profileImagePreview ? (
              <button
                aria-label="View profile image"
                className="block size-18 overflow-hidden rounded-full border-2 border-white bg-slate-100 bg-cover bg-center shadow-md ring-1 ring-slate-200 transition hover:ring-[3px] hover:ring-emerald-600/20 sm:size-24"
                onClick={() => setIsProfileImageOpen(true)}
                style={{ backgroundImage: `url(${profileImagePreview})` }}
                type="button"
              />
            ) : (
              <label className="grid size-18 cursor-pointer place-items-center rounded-full border border-dashed border-slate-300 bg-white text-slate-500 shadow-sm ring-4 ring-slate-100 transition hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 sm:size-24">
                <ImageUp aria-hidden="true" className="size-7" strokeWidth={2} />
                <input
                  accept="image/*"
                  aria-label="Upload profile image"
                  className="sr-only"
                  name="profileImage"
                  onChange={handleProfileImageChange}
                  required
                  type="file"
                />
              </label>
            )}

            {profileImagePreview ? (
              <label className="absolute -bottom-1 -right-1 grid size-8 cursor-pointer place-items-center rounded-full border-2 border-white bg-emerald-600 text-white shadow-sm transition hover:bg-emerald-700 sm:size-9">
                <ImageUp aria-hidden="true" className="size-4" strokeWidth={2} />
                <input
                  accept="image/*"
                  aria-label="Change profile image"
                  className="sr-only"
                  name="profileImage"
                  onChange={handleProfileImageChange}
                  required
                  type="file"
                />
              </label>
            ) : null}
          </div>
        </div>

        <label className="block space-y-1 sm:space-y-1.5">
          <span className="text-sm font-medium text-slate-900">Full name</span>
          <span className="relative block">
            <UserRound
              aria-hidden="true"
              className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
              strokeWidth={2}
            />
            <input
              className="h-9 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-[3px] focus:ring-emerald-600/20 sm:h-10"
              name="name"
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Your name"
              required
              type="text"
              value={fullName}
            />
          </span>
        </label>

        <label className="block space-y-1 sm:space-y-1.5">
          <span className="text-sm font-medium text-slate-900">Email address</span>
          <span className="relative block">
            <Mail
              aria-hidden="true"
              className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
              strokeWidth={2}
            />
            <input
              className="h-9 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-[3px] focus:ring-emerald-600/20 sm:h-10"
              name="email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
              type="email"
              value={email}
            />
          </span>
        </label>

        <label className="block space-y-1 sm:space-y-1.5">
          <span className="text-sm font-medium text-slate-900">Phone number</span>
          <span className="relative block">
            <Phone
              aria-hidden="true"
              className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
              strokeWidth={2}
            />
            <input
              className="h-9 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-[3px] focus:ring-emerald-600/20 sm:h-10"
              name="phone"
              onChange={(event) => setPhone(event.target.value)}
              placeholder="+880 1XXX XXXXXX"
              required
              type="tel"
              value={phone}
            />
          </span>
        </label>

        <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-3">
          <label className="block space-y-1 sm:space-y-1.5">
            <span className="text-sm font-medium text-slate-900">Password</span>
            <span className="relative block">
              <LockKeyhole
                aria-hidden="true"
                className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
                strokeWidth={2}
              />
              <input
                className="h-9 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-[3px] focus:ring-emerald-600/20 sm:h-10"
                minLength={8}
                name="password"
                onChange={(event) => setPassword(event.target.value)}
                placeholder="8+ characters"
                required
                type="password"
                value={password}
              />
            </span>
          </label>

          <label className="block space-y-1 sm:space-y-1.5">
            <span className="text-sm font-medium text-slate-900">Confirm</span>
            <span className="relative block">
              <LockKeyhole
                aria-hidden="true"
                className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
                strokeWidth={2}
              />
              <input
                className="h-9 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-[3px] focus:ring-emerald-600/20 sm:h-10"
                minLength={8}
                name="confirmPassword"
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Repeat"
                required
                type="password"
                value={confirmPassword}
              />
            </span>
          </label>
        </div>

        {confirmPassword && confirmPassword !== password ? (
          <p className="text-sm font-medium text-red-600">
            Password and confirm password must match.
          </p>
        ) : null}

        {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}

        <label className="flex items-start gap-3 text-sm leading-5 text-slate-600">
          <input
            className="mt-1 size-4 shrink-0 rounded border-slate-300 text-emerald-600"
            checked={accepted}
            onChange={(event) => setAccepted(event.target.checked)}
            required
            type="checkbox"
          />
          <span className="min-w-0">I agree to continue.</span>
        </label>

        <button
          className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300 sm:h-10"
          disabled={!canCreate || isSubmitting}
          onClick={handleCreateAccount}
          type="button"
        >
          {isSubmitting ? "Creating account..." : "Create account"}
          <ArrowRight aria-hidden="true" className="size-4" strokeWidth={2} />
        </button>
      </div>

      {profileImagePreview && isProfileImageOpen ? (
        <div
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4"
          onClick={() => setIsProfileImageOpen(false)}
          role="dialog"
        >
          <button
            aria-label="Close image preview"
            className="absolute right-4 top-4 grid size-10 place-items-center rounded-full bg-white text-slate-900 shadow-sm transition hover:bg-slate-100"
            onClick={() => setIsProfileImageOpen(false)}
            type="button"
          >
            <X aria-hidden="true" className="size-5" strokeWidth={2} />
          </button>
          <div
            aria-label="Profile image preview"
            className="h-full max-h-[86dvh] w-full max-w-4xl rounded-xl bg-contain bg-center bg-no-repeat"
            onClick={(event) => event.stopPropagation()}
            role="img"
            style={{ backgroundImage: `url(${profileImagePreview})` }}
          />
        </div>
      ) : null}
    </>
  );
}
