/**
 * User Service
 * Business logic layer for User operations
 */

import User, { UserCreationAttributes } from "./user.model";

interface PaginationOptions {
  page?: number;
  limit?: number;
}

interface PaginatedResult<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

class UserService {
  /**
   * Get all users with pagination
   */
  async findAll(
    options: PaginationOptions = {},
  ): Promise<PaginatedResult<User>> {
    const page = Math.max(1, options.page || 1);
    const limit = Math.min(100, Math.max(1, options.limit || 10));
    const offset = (page - 1) * limit;

    const { count, rows } = await User.findAndCountAll({
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    return {
      data: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  /**
   * Find a user by ID
   */
  async findById(id: number): Promise<User | null> {
    return User.findByPk(id);
  }

  /**
   * Find a user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    return User.findOne({ where: { email } });
  }

  /**
   * Create a new user
   */
  async create(data: UserCreationAttributes): Promise<User> {
    return User.create(data);
  }

  /**
   * Update a user
   */
  async update(
    id: number,
    data: Partial<UserCreationAttributes>,
  ): Promise<User | null> {
    const user = await User.findByPk(id);
    if (!user) return null;

    return user.update(data);
  }

  /**
   * Delete a user
   */
  async delete(id: number): Promise<boolean> {
    const user = await User.findByPk(id);
    if (!user) return false;

    await user.destroy();
    return true;
  }
}

export default new UserService();
