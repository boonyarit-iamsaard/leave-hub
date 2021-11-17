import { FC } from 'react';

import useUsers from '../hooks/useUsers';

const AdminPage: FC = () => {
  const { users } = useUsers();
  return (
    <div>
      <p>Admin - Page</p>
      <pre>{JSON.stringify(users, null, 2)}</pre>
    </div>
  );
};

export default AdminPage;
