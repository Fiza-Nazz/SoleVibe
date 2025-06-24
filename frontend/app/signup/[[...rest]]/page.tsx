"use client";
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black px-4">
      <div className="w-full max-w-md rounded-xl shadow-lg border border-gray-200 p-6">
        <SignUp
          routing="path"  // 👈 THIS IS VERY IMPORTANT
          path="/signup"
          redirectUrl="/profile"
          appearance={{
            elements: {
              card: "shadow-none border-none",
              formButtonPrimary:
                "bg-black hover:bg-gray-900 text-white font-semibold rounded-md px-4 py-2 mt-4",
              headerTitle: "text-2xl font-bold text-center text-black",
              headerSubtitle: "text-center text-gray-500 text-sm",
            },
          }}
        />
      </div>
    </div>
  );
}
