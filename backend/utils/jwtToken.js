import jwt from "jsonwebtoken";

export const generateToken = (user, role, res, message = "Success") => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });
  const cookieName = role === "Admin" ? "adminToken" : "patientToken";

  res
    .status(200)
    .cookie(cookieName, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .json({
      success: true,
      message,
      user,
    });
};
