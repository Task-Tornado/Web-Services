import type { ComponentProps } from "react";
import { Redirect } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { CSRF_experimental } from "@task-tornado/auth";
import type { OAuthProviders } from "@task-tornado/auth";

import Google from "~/assets/icons/google.svg";
import { Button } from "./ui/button";
import { DropdownMenuItem, DropdownMenuShortcut } from "./ui/dropdown-menu";

export function SignIn({
  provider,
  ...props
}: { provider: OAuthProviders } & ComponentProps<"button">) {
  return (
    <form action={`/api/auth/signin/${provider}`} method="post">
      <button {...props} />
      <CSRF_experimental />
    </form>
  );
}

export function SignOut(props: ComponentProps<"button">) {
  return (
    <form action="/api/auth/signout" method="post">
      <button {...props} />
      <CSRF_experimental />
    </form>
  );
}
export function GoogleAuth() {
  return (
    <form action="/api/auth/signin/google" method="POST">
      <Button className="flex w-full gap-x-2 bg-neutral-950 hover:bg-neutral-800">
        <Image
          className="h-5 w-auto"
          src={Google as string}
          loading="lazy"
          alt="google logo"
        />
        Continue with Google
      </Button>
      <CSRF_experimental />
    </form>
  );
}

export default function SignOutDashboard() {
  return (
    <form action="/api/auth/signout" method="post">
      <button type="submit" className="w-full">
        <DropdownMenuItem>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
        <CSRF_experimental />
      </button>
    </form>
  );
}
