import { PrismaClient, User } from "@prisma/client";
const prisma = new PrismaClient();


export interface getUserByPublicKeyParams {
  publicKey: string;
};

export async function getUserByPublicKey(params: getUserByPublicKeyParams): Promise<User | null> {
  const { publicKey } = params;

  return await prisma.user.findUnique({
    where: { publicKey },
  });
}