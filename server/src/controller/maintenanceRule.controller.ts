import { Request, Response, NextFunction } from "express";
import * as maintenanceRuleService from "../services/maintenanceRule.service";

export const createMaintenanceRule = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rule = await maintenanceRuleService.createMaintenanceRule(
      req.params.vehicleId as string, req.body, req.user! );
    res.status(201).json(rule);
  } catch (error) {
    next(error);
  }
};

export const getMaintenanceRulesForVehicle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rules = await maintenanceRuleService.getMaintenanceRulesForVehicle( req.params.vehicleId as string, req.user! );
    res.status(200).json(rules);
  } catch (error) {
    next(error);
    }
};

export const getMaintenanceRuleById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rule = await maintenanceRuleService.getMaintenanceRuleById(req.params.id as string, req.user!);
    res.status(200).json(rule);
  } catch (error) {
    next(error);
  }
};

export const updateMaintenanceRule = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const rule = await maintenanceRuleService.updateMaintenanceRule(req.params.id as string, req.body, req.user!);
        res.status(200).json(rule);
    } catch (error) {
        next(error);
    }
};

export const deleteMaintenanceRule = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await maintenanceRuleService.deleteMaintenanceRule(req.params.id as string, req.user!);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

