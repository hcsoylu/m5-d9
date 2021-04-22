import fs from "fs-extra";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const { readJSON, writeJSON } = fs;

const pathToJsonData = join(
  dirname(fileURLToPath(import.meta.url)),
  "../jsondata"
);

export const getReviews = async () =>
  await readJSON(join(pathToJsonData, "reviews.json"));

export const getProducts = async () =>
  await readJSON(join(pathToJsonData, "products.json"));

export const writeProducts = async (content) =>
  await writeJSON(join(pathToJsonData, "products.json"), content);

export const writeReviews = async (content) =>
  await writeJSON(join(pathToJsonData, "reviews.json"), content);
