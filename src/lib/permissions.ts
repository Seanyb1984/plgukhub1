import { Role, Brand } from "@prisma/client";

export const PERMISSIONS = {
  CAN_VIEW_ALL_BRANDS: ["PLG_UK"] as Brand[],
  CAN_MANAGE_USERS: ["ADMIN"] as Role[],
};

export function hasBrandAccess(userBrand: Brand, targetBrand: Brand) {
  // HQ Admins see everything
  if (PERMISSIONS.CAN_VIEW_ALL_BRANDS.includes(userBrand)) return true;
  return userBrand === targetBrand;
}
