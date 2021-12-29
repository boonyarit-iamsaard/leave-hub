import { ChangeEvent, FC, useEffect, useState } from 'react';

// mui
import {
  Button,
  FormControl,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';

// components
import { RosterContainer } from '../components/Roster';
import { ShiftForm, ShiftFormMode } from '../components/Shift';

// hooks
import useDaysOff from '../hooks/useDaysOff';
import useProfile from '../hooks/useProfile';
import useShiftList from '../hooks/useShiftList';
import useUserList from '../hooks/useUserList';

// interfaces
import { Profile } from '../interfaces/auth.interface';
import {
  Roster,
  RosterType,
  Shift,
  ShiftType,
} from '../interfaces/roster.interface';

// styles
import { RosterPageContainer, RosterPageHeader } from './RosterPage.style';

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

const RosterPage: FC = () => {
  const { findDayOff } = useDaysOff();
  const { profile } = useProfile();
  const { shiftList } = useShiftList();
  const { userList } = useUserList();

  const [month, setMonth] = useState(0);
  const [rosterType, setRosterType] = useState<RosterType>(RosterType.Mechanic);
  const [shiftForm, setShiftForm] = useState({
    mode: ShiftFormMode.EDIT,
    open: false,
    roster: rosterType,
    selectedProfile: {} as Profile,
    shift: {} as Shift,
  });
  const [year, setYear] = useState(2022);

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

  const handleRosterTypeChange = (updatedRosterType: RosterType) => {
    setRosterType(updatedRosterType);
    if (profile.isAdmin && profile.roster !== updatedRosterType) {
      setShiftForm({
        ...shiftForm,
        roster: updatedRosterType,
      });
    }
  };

  const handleShiftFormClose = () => {
    setShiftForm({
      ...shiftForm,
      open: false,
    });
  };

  const handleClickAddNewShift = () => {
    setShiftForm({
      ...shiftForm,
      open: true,
      mode: ShiftFormMode.CREATE,
      selectedProfile: profile,
      shift: {} as Shift,
    });
  };

  const handleClickEditShift = (roster: Roster) => {
    const selectedProfile = userList.find(user => user.uid === roster.uid);
    const selectedShift =
      roster.type === ShiftType.X
        ? findDayOff(roster)
        : shiftList.find(shift => shift.id === roster.shiftId);

    if (!selectedProfile || !selectedShift) return;

    setShiftForm({
      ...shiftForm,
      open: true,
      mode: ShiftFormMode.EDIT,
      selectedProfile,
      shift: selectedShift,
    });
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
      <RosterPageHeader style={{ marginBottom: 16 }}>
        <Typography variant="h6">{rosterType}</Typography>

        <Box>
          <Button
            disabled={rosterType === RosterType.Engineer}
            variant="outlined"
            color="primary"
            onClick={() => handleRosterTypeChange(RosterType.Engineer)}
            sx={{ mr: 2 }}
          >
            Engineer
          </Button>
          <Button
            disabled={rosterType === RosterType.Mechanic}
            variant="outlined"
            color="primary"
            onClick={() => handleRosterTypeChange(RosterType.Mechanic)}
            sx={{ mr: 2 }}
          >
            Mechanic
          </Button>
          <Button
            className="shadow"
            variant="contained"
            color="primary"
            onClick={handleClickAddNewShift}
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

      <ShiftForm
        handleClose={handleShiftFormClose}
        month={month}
        year={year}
        {...shiftForm}
      />

      {rosterType === RosterType.Engineer && (
        <RosterContainer
          handleEditDialogOpen={handleClickEditShift}
          month={month}
          year={year}
          rosterType={RosterType.Engineer}
        />
      )}

      {rosterType === RosterType.Mechanic && (
        <RosterContainer
          handleEditDialogOpen={handleClickEditShift}
          month={month}
          year={year}
          rosterType={RosterType.Mechanic}
        />
      )}
    </RosterPageContainer>
  );
};

export default RosterPage;
