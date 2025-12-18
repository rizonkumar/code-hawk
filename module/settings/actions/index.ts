"use server";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import prisma from "@/lib/db";
import { deleteWebHooks } from "@/module/github/lib/github";

export const getUserProfile = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("You must be logged in to access this resource");
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

export const updateUserProfile = async (data: {
  name?: string;
  email?: string;
}) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("You must be logged in to access this resource");
    }

    const updateUser = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        name: data.name,
        email: data.email,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!updateUser) {
      throw new Error("User not found");
    }

    revalidatePath("/dashboard/settings", "page");

    return {
      success: true,
      user: updateUser,
    };
  } catch (error) {
    console.error("Error updating user profile:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
};

export const getConnectedRepositories = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("You must be logged in to access this resource");
    }

    const repositories = await prisma.repository.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        id: true,
        name: true,
        fullName: true,
        url: true,
        createdAt: true,
        owner: true,
        language: true,
        description: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!repositories) {
      return [];
    }

    return repositories;
  } catch (error) {
    console.error("Error fetching connected repositories:", error);
    throw error;
  }
};

export const disconnectRepository = async (repositoryId: string) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("You must be logged in to access this resource");
    }

    const repository = await prisma.repository.findUnique({
      where: {
        id: repositoryId,
        userId: session.user.id,
      },
    });

    if (!repository) {
      throw new Error("Repository not found");
    }

    await deleteWebHooks(repository.owner, repository.name);
    await prisma.repository.delete({
      where: {
        id: repositoryId,
        userId: session.user.id,
      },
    });
    revalidatePath("/dashboard/settings", "page");
    revalidatePath("/dashboard/repository", "page");
    return {
      success: true,
    };
  } catch (error) {
    console.error("Error disconnecting repository:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
};

export const disconnectAllRepository = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("You must be logged in to access this resource");
    }

    const repositories = await prisma.repository.findMany({
      where: {
        userId: session.user.id,
      },
    });

    if (!repositories) {
      throw new Error("Repositories not found");
    }

    await Promise.all(
      repositories.map(
        async (repository) =>
          await deleteWebHooks(repository.owner, repository.name)
      )
    );

    const result = await prisma.repository.deleteMany({
      where: {
        userId: session.user.id,
      },
    });

    revalidatePath("/dashboard/settings", "page");
    revalidatePath("/dashboard/repository", "page");
    return {
      success: true,
    };
  } catch (error) {
    console.error("Error disconnecting all repositories:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
};
