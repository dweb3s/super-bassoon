import { beforeAll, afterAll } from "@jest/globals";

import { Prisma, PrismaClient, Sensor } from "@prisma/client";
import { SENSOR_READINGS_CHUNK_SIZE } from "../src/constants";
import { writeSensorReadingsChunk, fetchSensorReadingsChunks } from "../src/sensorReadings";
const prisma = new PrismaClient();

import { getSessionById, createSession, destroySessionById } from "../src/session"

// creates mock users
beforeAll(async () => {
  // clear database before tests to avoid collisions

  // await prisma.sensorReadings.deleteMany();
  // await prisma.session.deleteMany();
  // await prisma.user.deleteMany();


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

  await prisma.session.createMany({
    data: [{
      id: 1,
      userId: 1, 
      createdAt: new Date("December 17, 1995 03:24:00"),
    }, {
      id: 2,
      userId: 2, 
      createdAt: new Date("December 18, 1995 03:24:00"),
    }],
  });

  console.log('✨ 2 sessions successfully created!');

})

afterAll(async () => {
  // clear database after tests

  await prisma.sensorReadings.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  await prisma.$disconnect()
});



it("should write a chunk of 375 elements to Anakin's session, and then fetch the chunk", async () => {
  const sessionId = 1;
  const sensorReadingsChunk: Prisma.SensorReadingsUncheckedCreateInput[] = [];

  const now = Date.now();

  for (let i = 0; i < SENSOR_READINGS_CHUNK_SIZE; i++) {
    let sensor;
    let number = 2 * Math.random() + 1;

    if (number == 1) {
      sensor = Sensor.Accelerometer;
    } else if (number == 2) {
      sensor = Sensor.Gyroscope;
    } else {
      sensor = Sensor.Magnetometer;
    }

    sensorReadingsChunk.push({
      sessionId,
      createdAt: new Date(now + i),
      sensor,
      xAxis: Math.random(),
      yAxis: Math.random(),
      zAxis: Math.random(),
    });
  }

  console.log(await writeSensorReadingsChunk({ sessionId, sensorReadingsChunk }));
  const fetchedSensorReadingsChunk = await fetchSensorReadingsChunks({ sessionId, take: 1, skip: 0 });

  for (let i = 0; i < 375; i++) {
    expect(fetchedSensorReadingsChunk[i]?.id).toBeDefined();
    
    expect(fetchedSensorReadingsChunk[i]?.sessionId).toEqual(sensorReadingsChunk[i].sessionId);
    expect(fetchedSensorReadingsChunk[i]?.createdAt).toEqual(sensorReadingsChunk[i].createdAt);
    expect(fetchedSensorReadingsChunk[i]?.sensor).toEqual(sensorReadingsChunk[i].sensor);

    expect(fetchedSensorReadingsChunk[i]?.xAxis).toBeCloseTo(sensorReadingsChunk[i].xAxis);
    expect(fetchedSensorReadingsChunk[i]?.yAxis).toBeCloseTo(sensorReadingsChunk[i].yAxis);
    expect(fetchedSensorReadingsChunk[i]?.zAxis).toBeCloseTo(sensorReadingsChunk[i].zAxis);
  }
});


it("should generate, write and fetch 25 chunks in total", async () => {
  const anakiSessionId = 1;
  const paisleySessionId = 2;

  for (let i = 0; i < 25; i++) {
    const anakiSensorReadingsChunk: Prisma.SensorReadingsUncheckedCreateInput[] = [];
    const paisleySensorReadingsChunk: Prisma.SensorReadingsUncheckedCreateInput[] = [];

    const now = Date.now();

    for (let j = 0; j < SENSOR_READINGS_CHUNK_SIZE; j++) {
      
      let anakiSensor;
      let anakiNumber = 2 * Math.random() + 1;

      if (anakiNumber == 1) {
        anakiSensor = Sensor.Accelerometer;
      } else if (anakiNumber == 2) {
        anakiSensor = Sensor.Gyroscope;
      } else {
        anakiSensor = Sensor.Magnetometer;
      }

      let paisleySensor;
      let paisleyNumber = 2 * Math.random() + 1;

      if (paisleyNumber == 1) {
        paisleySensor = Sensor.Accelerometer;
      } else if (paisleyNumber == 2) {
        paisleySensor = Sensor.Gyroscope;
      } else {
        paisleySensor = Sensor.Magnetometer;
      }

      anakiSensorReadingsChunk.push({
        sessionId: anakiSessionId,
        createdAt: new Date(now + i),
        sensor: anakiSensor,
        xAxis: Math.random(),
        yAxis: Math.random(),
        zAxis: Math.random(),
      });

      paisleySensorReadingsChunk.push({
        sessionId: paisleySessionId,
        createdAt: new Date(now + i),
        sensor: paisleySensor,
        xAxis: Math.random(),
        yAxis: Math.random(),
        zAxis: Math.random(),
      });
    }

    await writeSensorReadingsChunk({ 
      sessionId: anakiSessionId, 
      sensorReadingsChunk: anakiSensorReadingsChunk,
    });

    await writeSensorReadingsChunk({ 
      sessionId: paisleySessionId, 
      sensorReadingsChunk: paisleySensorReadingsChunk,
    });

    const fetchedAnakiSensorReadingsChunk = await fetchSensorReadingsChunks({ sessionId: anakiSessionId, take: 1, skip: 0 });
    const fetchedPaisleySensorReadingsChunk = await fetchSensorReadingsChunks({ sessionId: paisleySessionId, take: 1, skip: 0 });

    for (let i = 0; i < 375; i++) {
      expect(fetchedAnakiSensorReadingsChunk[i]?.id).toBeDefined();
      
      expect(fetchedAnakiSensorReadingsChunk[i]?.sessionId).toEqual(fetchedAnakiSensorReadingsChunk[i].sessionId);
      expect(fetchedAnakiSensorReadingsChunk[i]?.createdAt).toEqual(fetchedAnakiSensorReadingsChunk[i].createdAt);
      expect(fetchedAnakiSensorReadingsChunk[i]?.sensor).toEqual(fetchedAnakiSensorReadingsChunk[i].sensor);

      expect(fetchedAnakiSensorReadingsChunk[i]?.xAxis).toBeCloseTo(fetchedAnakiSensorReadingsChunk[i].xAxis);
      expect(fetchedAnakiSensorReadingsChunk[i]?.yAxis).toBeCloseTo(fetchedAnakiSensorReadingsChunk[i].yAxis);
      expect(fetchedAnakiSensorReadingsChunk[i]?.zAxis).toBeCloseTo(fetchedAnakiSensorReadingsChunk[i].zAxis);
    

      expect(fetchedPaisleySensorReadingsChunk[i]?.id).toBeDefined();
      
      expect(fetchedPaisleySensorReadingsChunk[i]?.sessionId).toEqual(fetchedPaisleySensorReadingsChunk[i].sessionId);
      expect(fetchedPaisleySensorReadingsChunk[i]?.createdAt).toEqual(fetchedPaisleySensorReadingsChunk[i].createdAt);
      expect(fetchedPaisleySensorReadingsChunk[i]?.sensor).toEqual(fetchedPaisleySensorReadingsChunk[i].sensor);

      expect(fetchedPaisleySensorReadingsChunk[i]?.xAxis).toBeCloseTo(fetchedPaisleySensorReadingsChunk[i].xAxis);
      expect(fetchedPaisleySensorReadingsChunk[i]?.yAxis).toBeCloseTo(fetchedPaisleySensorReadingsChunk[i].yAxis);
      expect(fetchedPaisleySensorReadingsChunk[i]?.zAxis).toBeCloseTo(fetchedPaisleySensorReadingsChunk[i].zAxis);
    }
  }
}, 100000);