import { ChangeEvent, FC, useEffect, useState } from 'react';

// mui
import {
  Button,
  FormControl,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
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

const selectMonthOptions = [
  { value: 0, label: 'January' },
  { value: 1, label: 'February' },
  { value: 2, label: 'March' },
  { value: 3, label: 'April' },
  { value: 4, label: 'May' },
  { value: 5, label: 'June' },
  { value: 6, label: 'July' },
  { value: 7, label: 'August' },
  { value: 8, label: 'September' },
  { value: 9, label: 'October' },
  { value: 10, label: 'November' },
  { value: 11, label: 'December' },
];

const selectYearOptions = (): { value: number; label: string }[] => {
  const currentYear = new Date().getFullYear() - 3;
  const yearOptions: { value: number; label: string }[] = [];

  for (let i = currentYear; i < currentYear + 10; i++) {
    yearOptions.push({ value: i, label: i.toString() });
  }
  return yearOptions;
};

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
  const { findDayOff } = useDaysOff();
  const { profile } = useProfile();
  const { removeShiftDocument, shiftList } = useShiftList();
  const [isDeletePending, setIsDeletePending] = useState(false);
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
    setIsDeletePending(true);
    if (shift.type === ShiftType.X) {
      const docRef = ref(realtimeDatabase, 'days-off/' + shift.id);
      await remove(docRef);
      setIsDeletePending(false);
    } else {
      await removeShiftDocument(shift);
      setIsDeletePending(false);
    }

    setConfirmDialog(prevState => ({ ...prevState, open: false }));
    setEditMode(false);
    setShift({} as Shift);
    setDialogOpen(!dialogOpen);
  };

  const handleEditDialogOpen = (roster: Roster) => {
    let selectedShift: Shift | undefined;

    roster.type === ShiftType.X
      ? (selectedShift = findDayOff(roster))
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

  const handleYearChange = (event: ChangeEvent<HTMLInputElement>) =>
    setYear(Number(event.target.value));

  const handleMonthChange = (event: ChangeEvent<HTMLInputElement>) =>
    setMonth(Number(event.target.value));

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
        isConfirmPending={isDeletePending}
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onClose={confirmDialog.onClose}
        onConfirm={confirmDialog.onConfirm}
      />

      <RosterPageHeader style={{ marginBottom: 16 }}>
        <Typography variant="h6">{rosterType}</Typography>

        <Box>
          <Button
            disabled={rosterType === RosterType.Engineer}
            variant="outlined"
            color="primary"
            onClick={() => setRosterType(RosterType.Engineer)}
            sx={{ mr: 2 }}
          >
            Engineer
          </Button>
          <Button
            disabled={rosterType === RosterType.Mechanic}
            variant="outlined"
            color="primary"
            onClick={() => setRosterType(RosterType.Mechanic)}
            sx={{ mr: 2 }}
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
        </Box>
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

        <div>
          <FormControl
            variant="outlined"
            className="roster-page__form-control"
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'white',
              },
            }}
          >
            <TextField
              onChange={handleMonthChange}
              select
              size="small"
              sx={{ mr: 1 }}
              value={month}
            >
              {selectMonthOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
          <FormControl
            variant="outlined"
            className="roster-page__form-control"
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'white',
              },
            }}
          >
            <TextField
              select
              value={year}
              size="small"
              onChange={handleYearChange}
            >
              {selectYearOptions().map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
        </div>

        <Button variant="outlined" onClick={handleNextClick}>
          Next
        </Button>
      </Box>

      <RosterForm
        dialogOpen={dialogOpen}
        handleConfirmDialog={handleConfirmDialogOpen}
        handleDialogOpen={handleDialogOpen}
        isDeletePending={isDeletePending}
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
