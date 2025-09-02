import { adminMenu } from "./admin";
import { employeeMenu } from "./employee";

export function getSidebarMenu(role: string) {
  switch (role) {
    case "employee":
      return employeeMenu;
    case "admin":
      return adminMenu;
    default:
      return adminMenu;
  }
}
