import { FC, useEffect, useState } from 'react';
import { format } from 'date-fns';

import { Button, Typography } from '@mui/material';
import { Box, styled } from '@mui/system';

// components
import { RosterContainer, RosterForm } from '../components/Roster';
import { ConfirmDialog } from '../components/Common';

// hooks
import useDaysOff from '../hooks/useDaysOff';
import useProfile from '../hooks/useProfile';
import useShiftList from '../hooks/useShiftList';

// interfaces
import {
  Roster,
  RosterType,
  Shift,
  ShiftType,
} from '../interfaces/roster.interface';

import { ref, remove } from '@firebase/database';
import { realtimeDatabase } from '../firebase/config';

const RosterPageContainer = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: theme.breakpoints.values.lg,
  margin: '0 auto',
}));

const RosterPageHeader = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const RosterPage: FC = () => {
  const { daysOff } = useDaysOff();
  const { profile } = useProfile();
  const { removeShiftDocument, shiftList } = useShiftList();
  const [rosterType, setRosterType] = useState<RosterType>(RosterType.Mechanic);
  const [shift, setShift] = useState<Shift>({} as Shift);
  const [year, setYear] = useState(2022);
  const [month, setMonth] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: '',
    message: '',
    onConfirm: () =>
      setConfirmDialog(prevState => ({ ...prevState, open: false })),
    onClose: () =>
      setConfirmDialog(prevState => ({ ...prevState, open: false })),
  });
  const [editMode, setEditMode] = useState(false);

  const handleSwitchRosterType = (type: RosterType) => {
    setRosterType(type);
  };

  const handleConfirmDialogOpen = (shift: Shift): void => {
    setConfirmDialog(prevState => ({
      ...prevState,
      open: true,
      title: 'Confirm',
      message: 'Are you sure you want to delete this item?',
      onConfirm: () => handleDeleteShift(shift),
    }));
  };

  const handleDeleteShift = async (shift: Shift): Promise<void> => {
    if (shift.type === ShiftType.X) {
      const docRef = ref(realtimeDatabase, 'days-off/' + shift.id);
      await remove(docRef);
    } else {
      await removeShiftDocument(shift);
    }

    setConfirmDialog(prevState => ({ ...prevState, open: false }));
    setEditMode(false);
    setShift({} as Shift);
    setDialogOpen(!dialogOpen);
  };

  const handleEditDialogOpen = (roster: Roster) => {
    let selectedShift: Shift | undefined;

    roster.type === ShiftType.X
      ? (selectedShift = daysOff.find(dayOff => dayOff.id === roster.shiftId))
      : (selectedShift = shiftList.find(shift => shift.id === roster.shiftId));

    selectedShift && setShift(selectedShift);
    setEditMode(true);
    setDialogOpen(!dialogOpen);
  };

  const handleDialogOpen = () => {
    setEditMode(false);
    setShift({} as Shift);
    setDialogOpen(!dialogOpen);
  };

  const handlePreviousClick = () => {
    if (month === 0) {
      setYear(year - 1);
      setMonth(11);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextClick = () => {
    if (month === 11) {
      setYear(year + 1);
      setMonth(0);
    } else {
      setMonth(month + 1);
    }
  };

  useEffect(() => {
    const rosterBody = document.getElementById('roster-body');
    rosterBody?.scrollTo({
      left: -10000,
      top: 0,
      behavior: 'smooth',
    });
  }, [year, month]);

  useEffect(() => {
    setRosterType(profile.roster);
  }, [profile.roster]);

  return (
    <RosterPageContainer className="roster-page__container">
      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onClose={confirmDialog.onClose}
        onConfirm={confirmDialog.onConfirm}
      />

      <RosterPageHeader style={{ marginBottom: 16 }}>
        <Typography variant="h6">{rosterType}</Typography>

        <div>
          <Button
            color="primary"
            disabled={rosterType === RosterType.Engineer}
            onClick={() => handleSwitchRosterType(RosterType.Engineer)}
            sx={{ mr: 2 }}
            variant="outlined"
          >
            Engineer
          </Button>
          <Button
            color="primary"
            disabled={rosterType === RosterType.Mechanic}
            onClick={() => handleSwitchRosterType(RosterType.Mechanic)}
            sx={{ mr: 2 }}
            variant="outlined"
          >
            Mechanic
          </Button>
          <Button
            className="shadow"
            variant="contained"
            color="primary"
            onClick={handleDialogOpen}
          >
            New
          </Button>
        </div>
      </RosterPageHeader>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Button variant="outlined" onClick={handlePreviousClick}>
          Previous
        </Button>

        <Typography variant="h5">
          {format(new Date(year, month), 'MMMM yyyy')}
        </Typography>

        <Button variant="outlined" onClick={handleNextClick}>
          Next
        </Button>
      </Box>

      <RosterForm
        dialogOpen={dialogOpen}
        handleConfirmDialog={handleConfirmDialogOpen}
        handleDialogOpen={handleDialogOpen}
        month={month}
        profile={profile}
        rosterType={rosterType}
        shift={editMode ? shift : undefined}
        year={year}
      />

      {rosterType === RosterType.Engineer && (
        <RosterContainer
          handleEditDialogOpen={handleEditDialogOpen}
          month={month}
          year={year}
          rosterType={RosterType.Engineer}
        />
      )}

      {rosterType === RosterType.Mechanic && (
        <RosterContainer
          handleEditDialogOpen={handleEditDialogOpen}
          month={month}
          year={year}
          rosterType={RosterType.Mechanic}
        />
      )}
    </RosterPageContainer>
  );
};

export default RosterPage;
