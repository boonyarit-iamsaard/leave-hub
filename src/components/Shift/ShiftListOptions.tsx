import { FC } from 'react';

import EditIcon from '@mui/icons-material/Edit';
import { GridRenderCellParams } from '@mui/x-data-grid';
import { IconButton } from '@mui/material';

import { Shift } from '../../interfaces/roster.interface';

import useProfile from '../../hooks/useProfile';

interface ShiftListOptionsProps {
  params: GridRenderCellParams<Shift>;
  handleClickEdit: (shift: Shift) => void;
}

const ShiftListOptions: FC<ShiftListOptionsProps> = ({
  handleClickEdit,
  params,
}) => {
  const { profile } = useProfile();

  return (
    <div>
      <IconButton
        aria-label="edit"
        disabled={!profile.isAdmin}
        onClick={() => handleClickEdit(params.value)}
      >
        <EditIcon />
      </IconButton>
    </div>
  );
};

export default ShiftListOptions;
