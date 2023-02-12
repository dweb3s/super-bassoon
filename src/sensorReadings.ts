import { Prisma, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import { SENSOR_READINGS_CHUNK_SIZE } from "./constants";

export interface writeSensorReadingsChunkParams {
  sessionId: number;
  sensorReadingsChunk: Prisma.SensorReadingsUncheckedCreateInput[];
};

export async function writeSensorReadingsChunk(params: writeSensorReadingsChunkParams) {
  const { sensorReadingsChunk } = params;

  if (sensorReadingsChunk.length !== SENSOR_READINGS_CHUNK_SIZE) {
    throw new Error("Invalid chunk size");
  }

  return await prisma.sensorReadings.createMany({
    data: sensorReadingsChunk,
  });
}


export interface fetchSensorReadingsChunksParams {
  sessionId: number;
  take: number,
  skip?: number;
};

export async function fetchSensorReadingsChunks(params: fetchSensorReadingsChunksParams) {
  const { sessionId, take, skip } = params;

  return await prisma.sensorReadings.findMany({ 
    where: { sessionId },
    take: take * SENSOR_READINGS_CHUNK_SIZE,
    skip: skip? skip * SENSOR_READINGS_CHUNK_SIZE : 0,
  });  
}