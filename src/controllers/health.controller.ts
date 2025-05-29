import { Request, Response } from "express";

export const getHealthCheck = async (req: Request, res: Response): Promise<void> => {
  try {
    res.json({ status: "Health OK" });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving health check ${error.message}` });
  }
};
