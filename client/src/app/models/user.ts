import { RolesEnum } from "./roles";

export interface User {
  token: string;
  username: string;
  photoUrl: string;
  knownAs: string;
  gender: string;
  roles: RolesEnum[];
}
