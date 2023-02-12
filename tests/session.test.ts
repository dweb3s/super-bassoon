import { beforeAll, afterAll } from "@jest/globals";

import { PrismaClient, Session } from "@prisma/client";
const prisma = new PrismaClient();

import { getSessionById, createSession, destroySessionById } from "../src/session"


// creates mock users
beforeAll(async () => {
  // clear database before tests to avoid collisions

  await prisma.sensorReadings.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();


  // create mock users

  await prisma.user.createMany({
    data: [{
      id: 1,
      publicKey: "ed25519:73g5FkDR5f9onJM7goQEZFMZZTH53Gv4cGAaEeEoQgDW",
      email: "anakin.barlowe@manvantara.com.ua",
      firstName: "Anakin",
      lastName: "Barlowe",
    }, {
      id: 2,
      publicKey: "ed25519:4U76jDwfEVekd9rhTVBAvGqJXUyKtWV2AgvfAsUMwdzR",
      email: "paisley.madden@manvantara.com.ua",
      firstName: "Paisley",
      lastName: "Madden",
    }],
  });

  console.log('✨ 2 users successfully created!');

  // create a session for the first mock user

  await prisma.session.create({
    data: {
      id: 1,
      userId: 1, 
      createdAt: new Date("December 17, 1995 03:24:00"),
    },
  });

  console.log('✨ 1 session successfully created!');

})

afterAll(async () => {
  // clear database after tests

  await prisma.sensorReadings.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  await prisma.$disconnect()
});


it("should return Anakin's session", async () => {
  const expectedSession: Session = {
    id: 1,
    userId: 1,
    createdAt: new Date("December 17, 1995 03:24:00"),
    destroyedAt: null,
  };

  const sessionId = 1;
  const session = await getSessionById({ id: sessionId });

  expect(session?.id).toEqual(1);
  expect(session?.userId).toEqual(1);
  expect(session?.createdAt).toEqual(new Date("December 17, 1995 03:24:00"));
  expect(session?.destroyedAt).toBeNull();

});

it("should create a new session for Paisley", async () => {
  const userId = 2;
  const createdSessionId = await createSession({ userId });
  const createdSession = await getSessionById({ id: createdSessionId });

  expect(createdSession?.id).toBeDefined();
  expect(createdSession?.userId).toEqual(2); // 2 is Paisley's id
  expect(createdSession?.createdAt).not.toBeNull();
  expect(createdSession?.destroyedAt).toBeNull();
});

it("should destroy the session for Anakin", async () => {
  const sessionId = 1;
  const destroyedSessionId = await destroySessionById({ id: sessionId });

  expect(destroyedSessionId).toEqual(sessionId);

  const destroyedSession = await getSessionById({ id: destroyedSessionId });

  expect(destroyedSession?.id).toEqual(1);
  expect(destroyedSession?.userId).toEqual(1); // 1 is Anakin's id
  expect(destroyedSession?.createdAt).toEqual(new Date("December 17, 1995 03:24:00"));
  expect(destroyedSession?.destroyedAt).not.toBeNull();
});