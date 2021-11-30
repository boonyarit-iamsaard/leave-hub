import { Profile } from '../interfaces/auth.interface';

const getProfile = (uid: string, userList: Profile[]): Profile =>
  userList.find(user => user.uid === uid) || ({} as Profile);

export default getProfile;
