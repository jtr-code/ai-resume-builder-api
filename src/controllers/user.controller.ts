import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import expressAsyncHandler from "express-async-handler";
import createHttpError from "http-errors";
import { ApiResponse } from "../utils/apiResponse";
import jwt from "jsonwebtoken";
import { generateAccessAndRefreshToken } from "../utils/generateAccessAndRefreshToken";

const prisma = new PrismaClient();

export const registerUser = expressAsyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) throw createHttpError(422, "All fields required");

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw createHttpError(409, "User already exists");

  const hashedPassword = await bcrypt.hash(password, 10);

  const createdUser = await prisma.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    },
  });

  const { accessToken, refreshToken } = generateAccessAndRefreshToken(createdUser.id);

  await prisma.user.update({
    where: { id: createdUser.id },
    data: { refreshToken },
  });

  res
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    })
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .status(201)
    .json(
      new ApiResponse(
        201,
        {
          user: {
            id: createdUser.id,
            name: createdUser.name,
            email: createdUser.email,
            createdAt: createdUser.createdAt,
          },
        },
        "User registered successfully"
      )
    );
});

export const loginUser = expressAsyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw createHttpError(401, "Invalid credentials");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw createHttpError(401, "Invalid credentials");

  const { accessToken, refreshToken } = generateAccessAndRefreshToken(user.id);

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  res
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    })
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .status(200)
    .json(
      new ApiResponse(
        200,
        {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
          },
        },
        "User logged successfully"
      )
    );
});

export const logoutUser = expressAsyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) throw createHttpError(401, "Unauthorized");

  await prisma.user.update({
    where: { id: userId },
    data: { refreshToken: null },
  });

  res
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .status(200)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

export const refreshAccessToken = expressAsyncHandler(async (req: Request, res: Response) => {
  const incomingToken = req.cookies?.refreshToken;
  if (!incomingToken) throw createHttpError(401, "Refresh token missing");

  let decoded;
  try {
    decoded = jwt.verify(incomingToken, process.env.REFRESH_TOKEN_SECRET!);
  } catch {
    throw createHttpError(401, "Invalid refresh token");
  }

  const user = await prisma.user.findUnique({
    where: { id: (decoded as any).id },
  });
  if (!user || user.refreshToken !== incomingToken) {
    throw createHttpError(401, "Refresh token expired or invalid");
  }

  const { accessToken, refreshToken } = generateAccessAndRefreshToken(user.id);

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  res
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    })
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .status(200)
    .json(new ApiResponse(200, {}, "Access token refreshed"));
});

export const forgotPassword = expressAsyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) throw createHttpError(400, "Email is required");

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw createHttpError(404, "User not found");

  const resetToken = jwt.sign({ id: user.id }, process.env.RESET_PASSWORD_SECRET!, {
    expiresIn: "15m",
  });

  const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  // TODO: send email using nodemailer/sendgrid/etc.
  console.log(" Reset link:", resetLink);

  res.status(200).json(new ApiResponse(200, {}, "Reset link sent to email (mocked)"));
});

export const resetPassword = expressAsyncHandler(async (req: Request, res: Response) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  if (!token || !newPassword) {
    throw createHttpError(400, "Token and new password are required");
  }

  try {
    const decoded = jwt.verify(token, process.env.RESET_PASSWORD_SECRET!) as {
      id: string;
    };

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: decoded.id },
      data: { password: hashedPassword },
    });

    res.status(200).json(new ApiResponse(200, {}, "Password reset successfully"));
  } catch (err) {
    throw createHttpError(400, "Invalid or expired token");
  }
});

export const changeCurrentPassword = expressAsyncHandler(async (req: Request, res: Response) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user?.id;

  if (!oldPassword || !newPassword) {
    throw createHttpError(400, "Old and new passwords are required");
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw createHttpError(404, "User not found");

  const isValid = await bcrypt.compare(oldPassword, user.password);
  if (!isValid) throw createHttpError(401, "Old password is incorrect");

  const hashed = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashed },
  });

  res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"));
});

export const updateAccountDetails = expressAsyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { name, email } = req.body;

  if (!name && !email) {
    throw createHttpError(422, "Please provide name and email");
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      name: name?.trim(),
      email: email?.toLowerCase(),
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });

  res.status(200).json(new ApiResponse(200, { user: updatedUser }, "Account updated successfully"));
});

export const getUser = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    res.status(200).json({
      success: true,
      users,
      message: users.length > 0 ? "Users retrieved successfully" : "No users found",
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
      message: "User retrieved successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const { name } = req.body;

    if (!name || typeof name !== "string" || name.trim() === "") {
      res.status(422).json({
        success: false,
        message: "Valid name is required",
      });
    }

    const existingUser = await prisma.user.findUnique({ where: { id: userId } });

    if (!existingUser) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name: name.trim() },
    });

    res.status(200).json({
      success: true,
      data: updatedUser,
      message: "User updated successfully",
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const deletedUser = await prisma.user.delete({
      where: { id: userId },
    });

    res.status(200).json({
      success: true,
      message: `User ${deletedUser.name} deleted successfully`,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete user and related data",
    });
  }
};
