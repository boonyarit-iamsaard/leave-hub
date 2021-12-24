const publicHolidays: Date[] = [
  new Date(2022, 0, 3),
  new Date(2022, 1, 1),
  new Date(2022, 1, 16),
  new Date(2022, 3, 6),
  new Date(2022, 3, 13),
  new Date(2022, 3, 14),
  new Date(2022, 4, 2),
  new Date(2022, 4, 4),
  new Date(2022, 4, 16),
  new Date(2022, 5, 3),
  new Date(2022, 6, 13),
  new Date(2022, 6, 28),
  new Date(2022, 7, 12),
  new Date(2022, 9, 13),
  new Date(2022, 9, 24),
  new Date(2022, 11, 5),
  new Date(2022, 11, 12),
  new Date(2022, 11, 26),
  new Date(2023, 0, 2),
];

const usePublicHolidays = (): { publicHolidays: Date[] } => {
  return { publicHolidays };
};

export default usePublicHolidays;
