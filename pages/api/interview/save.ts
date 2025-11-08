// pages/api/interview/save.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { saveInterview } from "@/lib/interviewService";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const interviewId = await saveInterview(req.body);
      res.status(200).json({ success: true, id: interviewId });
    } catch (error) {
      const errorMessage = typeof error === "object" && error !== null && "message" in error ? (error as { message: string }).message : String(error);
      res.status(500).json({ success: false, error: errorMessage });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
