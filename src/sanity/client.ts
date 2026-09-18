import { createClient } from "next-sanity";
import { sanityEnv } from "@/sanity/env";

export const sanityReadClient = createClient({
  projectId: sanityEnv.projectId || "placeholder",
  dataset: sanityEnv.dataset,
  apiVersion: sanityEnv.apiVersion,
  useCdn: sanityEnv.useCdn,
  perspective: "published",
});

export const sanityWriteClient = createClient({
  projectId: sanityEnv.projectId || "placeholder",
  dataset: sanityEnv.dataset,
  apiVersion: sanityEnv.apiVersion,
  useCdn: false,
  token: sanityEnv.token,
});
