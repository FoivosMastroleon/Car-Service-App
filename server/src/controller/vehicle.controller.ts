import { Request, Response, NextFunction } from "express";
import * as vehicleService from "../services/vehicle.service";

export const createVehicle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const vehicle = await vehicleService.createVehicle(req.body, req.user!);
    res.status(201).json(vehicle);
  } catch (err) {
    next(err);
  }
};

export const getMyVehicles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const vehicles = await vehicleService.getVehiclesForUser(req.user!.userId);
    res.status(200).json(vehicles);
  } catch (err) {
    next(err);
  }
};

export const getAllVehicles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const vehicles = await vehicleService.getAllVehicles();
    res.status(200).json(vehicles);
  } catch (err) {
    next(err);
  }
};

export const getVehicleById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const vehicle = await vehicleService.getVehicleById(req.params.id as string, req.user!);
    res.status(200).json(vehicle);
  } catch (err) {
    next(err);
  }
};

export const updateVehicle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const vehicle = await vehicleService.updateVehicle(req.params.id as string, req.body, req.user!);
    res.status(200).json(vehicle);
  } catch (err) {
    next(err);
  }
};

export const deleteVehicle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await vehicleService.deleteVehicle(req.params.id as string, req.user!);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
