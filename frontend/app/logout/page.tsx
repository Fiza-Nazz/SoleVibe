"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { FaCheckCircle } from "react-icons/fa";

export default function LogoutPage() {
  const { signOut } = useClerk();
  const router = useRouter();

  useEffect(() => {
    // Sign out the user on page load
    signOut().then(() => {
      setTimeout(() => {
        router.push("/signup");
      }, 2000); // Redirect to login after 2 seconds
    });
  }, [signOut, router]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white text-black px-4">
      <div className="text-center">
        <FaCheckCircle className="text-green-500 text-6xl mb-4 animate-bounce" />
        <h1 className="text-3xl font-bold mb-2">You have been logged out</h1>
        <p className="text-gray-600">Redirecting you to login page...</p>
      </div>
    </div>
  );
}
