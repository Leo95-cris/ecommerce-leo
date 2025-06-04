import { request, response } from "express";
import UserModel from "./entity.js";
import bcryptjs from "bcryptjs";

import jwt from "jsonwebtoken";

const createUser = async (req = request, resp = response) => {
  const { firstName, lastName, password, email, role, username } = req.body;
  // if (!firstName || !lastName || !password || !email || !username) {
  //   return resp.status(400).json({ message: "se requiere datos" });
  // }

  console.log("creating user");

  const salt = await bcryptjs.genSalt(10);

  const newPassword = await bcryptjs.hash(password, salt);

  const newUser = await UserModel.create({
    firstName,
    lastName,
    password: newPassword,
    email,
    username,
    role: role ?? "usuario",
  });

  await newUser.save();

  const token = jwt.sign(
    { id: newUser.dataValues.id },
    process.env.SECRET_TOKEN
  );
  return resp.json({ user: newUser, token });
};

// const updateUser = async (req = request, resp = response) => {
//   const { user } = req;
//   console.log("🚀 ~ updateUser ~ user:", user);

//   ///validar roles

//   const { password, role, ...rest } = req.body;
//   const { userId } = req.params;
//   console.log("🚀 ~ updateUser ~ userId:", userId);

//   const userFound = await UserModel.findByIdPk(userId);
//   console.log("🚀 ~ updateUser ~ userFound:", userFound);
//   if (!userFound) {
//     return resp.status(400).json({ message: "User not found" });
//   }
//   const result = await UserModel.findByIdAndUpdate(userId, { ...rest });

//   console.log("🚀 ~ updateUser ~ result:", result);
//   return resp.json({ message: result ? true : false });
// };
export { createUser };
