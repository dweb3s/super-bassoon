import { beforeAll, afterAll } from "@jest/globals";

import { PrismaClient, User } from "@prisma/client";
const prisma = new PrismaClient();

import { getUserByPublicKey } from "../src/user";

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

  console.log('✨ 2 successfully successfully created!');
})

afterAll(async () => {
  await prisma.sensorReadings.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  await prisma.$disconnect();
});


it('should return Paisley', async () => {
  const paisley: User = {
    id: 2,
    publicKey: "ed25519:4U76jDwfEVekd9rhTVBAvGqJXUyKtWV2AgvfAsUMwdzR",
    firstName: "Paisley",
    lastName: "Madden",
    email: "paisley.madden@manvantara.com.ua",
  };

  const publicKey = "ed25519:4U76jDwfEVekd9rhTVBAvGqJXUyKtWV2AgvfAsUMwdzR";
  const user = await getUserByPublicKey({ publicKey });

  expect(user).toEqual(paisley);
});