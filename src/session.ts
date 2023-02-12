import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


export interface createSessionParams {
  userId: number;
};

export async function createSession(params: createSessionParams): Promise<number> {
  const { userId } = params;

  const currentSession = await prisma.session.findFirst({
    where: { userId, destroyedAt: null },
  });

  if (currentSession) {
    throw new Error("Session already exist");
  }

  const createdSession = await prisma.session.create({
    data: { userId },  
  });

  return createdSession.id;
}


export interface getSessionByIdParams {
  id: number;
};

export async function getSessionById(params: getSessionByIdParams) {
  const { id } = params;

  return await prisma.session.findUnique({
    where: { id },
  });
}


export interface destroySessionByIdParams {
  id: number;
};

export async function destroySessionById(params: destroySessionByIdParams): Promise<number> {
  const { id } = params;

  const currentSession = await prisma.session.findFirst({
    where: { id },
  });

  if (!currentSession) {
    throw new Error("Session not found");
  } 
  else if (currentSession.destroyedAt !== null) {
    throw new Error("Session already destroyed");
  }

  // sets destroyedAt to be the current data
  // destroyedAt !== null means that session has ended
  const destroyedSession = await prisma.session.update({
    where: { id },
    data: { destroyedAt: new Date() }
  })

  return destroyedSession.id;
}


// TO-DO
// fetch_sessions