import { FC } from 'react';

// mui
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { GridRenderCellParams } from '@mui/x-data-grid';
import { IconButton } from '@mui/material';

// interface
import { Shift } from '../../interfaces/roster.interface';

interface RosterShiftListOptionsProps {
  params: GridRenderCellParams<Shift>;
  handleEditShift: (shift: Shift) => void;
}

const RosterShiftListOptions: FC<RosterShiftListOptionsProps> = ({
  params,
  handleEditShift,
}) => {
  return (
    <div>
      <IconButton
        onClick={() => handleEditShift(params.value)}
        aria-label="edit"
      >
        <EditIcon />
      </IconButton>
      <IconButton
        disabled
        onClick={() => alert(JSON.stringify(params.value, null, 2))}
        aria-label="delete"
      >
        <DeleteIcon />
      </IconButton>
    </div>
  );
};

export default RosterShiftListOptions;
