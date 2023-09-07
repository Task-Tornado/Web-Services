import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth, CSRF_experimental } from "@task-tornado/auth";

import Google from "~/assets/icons/google.svg";
import Mockup from "~/assets/mockup.png";
import Screenshot from "~/assets/screenshot.avif";
import TTLogo from "~/assets/task-tornado-logo.svg";
import { GoogleAuth } from "~/components/auth";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export default async function Page() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center py-24 sm:px-6 lg:px-8">
      <div className="z-10 sm:mx-auto sm:w-full sm:max-w-md">
        <Image
          className="mx-auto h-20 w-auto"
          src={TTLogo as string}
          alt="Task Tornado"
        />
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-200">
          Sign in to your account
        </h2>
      </div>

      <div className="z-10 mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <Card className="rounded-none sm:rounded-xl">
          <CardHeader>
            <CardTitle>Alpha Version 1.0</CardTitle>
            <CardDescription>
              There will be more authentication coming in the future. However,
              for now we&apos;re just sticking with Google.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GoogleAuth />
          </CardContent>
        </Card>

        <p className="mt-10 text-center text-sm text-neutral-300 ">
          Not sure how to integrate your business?{" "}
          <Link href="#" className="font-semibold leading-6  text-neutral-100">
            Book a Free Demo
          </Link>
        </p>
      </div>
      <Image
        className="absolute inset-0 z-0 h-screen object-cover brightness-[0.4]"
        src={Mockup}
        alt="Task Tornado Mockup"
      />
    </div>
  );
}
