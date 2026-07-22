import { Request, Response, NextFunction } from "express";
import * as maintenanceStatusService from "../services/maintenanceStatus.service";

export const getMaintenanceStatusForVehicle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const statuses = await maintenanceStatusService.getMaintenanceStatusForVehicle(
      req.params.vehicleId as string,
      req.user!
    );
    res.status(200).json(statuses);
  } catch (error) {
    next(error);
  }
};
