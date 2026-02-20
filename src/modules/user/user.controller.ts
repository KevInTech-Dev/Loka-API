/**
 * User Controller
 * HTTP request handlers for User endpoints
 */

import { Request, Response } from "express";
import userService from "./user.service";

class UserController {
  /**
   * GET /api/users
   * List all users with pagination
   */
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await userService.findAll({ page, limit });

      res.json({ success: true, ...result });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération des utilisateurs",
        error: error.message,
      });
    }
  }

  /**
   * GET /api/users/:id
   * Get a single user by ID
   */
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id)) {
        res.status(400).json({ success: false, message: "ID invalide" });
        return;
      }

      const user = await userService.findById(id);
      if (!user) {
        res
          .status(404)
          .json({ success: false, message: "Utilisateur non trouvé" });
        return;
      }

      res.json({ success: true, data: user });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération de l'utilisateur",
        error: error.message,
      });
    }
  }

  /**
   * POST /api/users
   * Create a new user
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const { firstName, lastName, email, phone, role } = req.body;

      // Check required fields
      if (!firstName || !lastName || !email) {
        res.status(400).json({
          success: false,
          message: "Les champs firstName, lastName et email sont requis",
        });
        return;
      }

      // Check for duplicate email
      const existing = await userService.findByEmail(email);
      if (existing) {
        res.status(409).json({
          success: false,
          message: "Un utilisateur avec cet email existe déjà",
        });
        return;
      }

      const user = await userService.create({
        firstName,
        lastName,
        email,
        phone,
        role,
      });

      res.status(201).json({
        success: true,
        data: user,
        message: "Utilisateur créé avec succès",
      });
    } catch (error: any) {
      if (error.name === "SequelizeValidationError") {
        res.status(400).json({
          success: false,
          message: "Erreur de validation",
          errors: error.errors?.map((e: any) => e.message),
        });
        return;
      }
      res.status(500).json({
        success: false,
        message: "Erreur lors de la création de l'utilisateur",
        error: error.message,
      });
    }
  }

  /**
   * PUT /api/users/:id
   * Update a user
   */
  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id)) {
        res.status(400).json({ success: false, message: "ID invalide" });
        return;
      }

      const { firstName, lastName, email, phone, role, isActive } = req.body;

      // If email is being changed, check for duplicates
      if (email) {
        const existing = await userService.findByEmail(email);
        if (existing && existing.id !== id) {
          res.status(409).json({
            success: false,
            message: "Un utilisateur avec cet email existe déjà",
          });
          return;
        }
      }

      const user = await userService.update(id, {
        firstName,
        lastName,
        email,
        phone,
        role,
        isActive,
      });

      if (!user) {
        res
          .status(404)
          .json({ success: false, message: "Utilisateur non trouvé" });
        return;
      }

      res.json({
        success: true,
        data: user,
        message: "Utilisateur mis à jour avec succès",
      });
    } catch (error: any) {
      if (error.name === "SequelizeValidationError") {
        res.status(400).json({
          success: false,
          message: "Erreur de validation",
          errors: error.errors?.map((e: any) => e.message),
        });
        return;
      }
      res.status(500).json({
        success: false,
        message: "Erreur lors de la mise à jour de l'utilisateur",
        error: error.message,
      });
    }
  }

  /**
   * DELETE /api/users/:id
   * Delete a user
   */
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id)) {
        res.status(400).json({ success: false, message: "ID invalide" });
        return;
      }

      const deleted = await userService.delete(id);
      if (!deleted) {
        res
          .status(404)
          .json({ success: false, message: "Utilisateur non trouvé" });
        return;
      }

      res.json({
        success: true,
        message: "Utilisateur supprimé avec succès",
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Erreur lors de la suppression de l'utilisateur",
        error: error.message,
      });
    }
  }
}

export default new UserController();
