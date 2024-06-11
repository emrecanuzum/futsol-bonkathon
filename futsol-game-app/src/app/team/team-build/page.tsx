"use client";
import React, { useEffect } from "react";
import TeamBuildForm from "./team-build-form";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";

const TeamBuildPage = () => {
  const { authToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authToken) {
      router.push("/");
    }
  }, [authToken, router]);

  if (authToken) {
    return (
      <div className="w-screen min-h-screen">
        <div
          className="w-[900px] mx-auto my-auto rounded-xl mt-10 "
          style={{
            backgroundImage: "url(/field.png)",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        >
          <div className=" z-20" style={{ backgroundImage: "" }}>
            <TeamBuildForm />
          </div>
        </div>
        <Link
          href={"/team"}
          className="block mt-4 text-white mx-auto w-screen text-center"
        >
          Go to team
        </Link>
      </div>
    );
  }
};

export default TeamBuildPage;
