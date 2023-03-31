import getAllUsers from "@/lib/getAllUsers";
import getUser from "@/lib/getUser";
import getUserPosts from "@/lib/getUserPosts";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import UserPosts from "./components/UserPosts";

type Params = {
  params: {
    userId: string;
  };
};

export async function generateMetadata({
  params: { userId },
}: Params): Promise<Metadata> {
  const userData: Promise<User> = getUser(userId);
  const user: User = await userData;

  if (!user?.name) {
    return {
      title: "User not found",
    };
  }

  return {
    title: user?.name,
    description: `This is the page for ${user?.name}`,
  };
}

export default async function UserPage({ params: { userId } }: Params) {
  const userData: Promise<User> = getUser(userId);
  const userPostsData: Promise<Post[]> = getUserPosts(userId);
  //   const [user, userPosts] = await Promise.all([userData, userPostsData]);

  const user = await userData;
  if (!user.name) return notFound();
  return (
    <>
      <h2>{user?.name}</h2>
      <Link href="/">Back to Home</Link>
      <Suspense fallback={<h2>Loading...</h2>}>
        {/* @ts-expect-error Async Server Component */}
        <UserPosts promise={userPostsData} />
      </Suspense>
    </>
  );
}

export async function generateStaticParams() {
  const userData: Promise<User[]> = getAllUsers();
  const users = await userData;
  return users.map((user) => ({
    userId: user.id.toString(),
  }));
}
