import React, { useState, useCallback } from 'react';
import { View } from 'react-native';
import DateTimePicker, { DateType, ModeType } from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

dayjs.locale('es');

interface CustomDatePickerProps {
  date: { startDate: DateType; endDate: DateType };
  onDateChange: (range: { startDate: DateType; endDate: DateType }) => void;
  mode?: ModeType;
  textColor?: string;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  date,
  onDateChange,
  mode = 'range',
  textColor = '#000',
}) => {
  const [currentRange, setCurrentRange] = useState(date);

  const handleDateChange = useCallback(
    (params: { startDate: DateType; endDate: DateType }) => {
      setCurrentRange(params);
      onDateChange(params); // Pass the new date range to the parent component
    },
    [onDateChange]
  );

  return (
    <View>
      <DateTimePicker
        mode={mode}
        startDate={currentRange.startDate}
        endDate={currentRange.endDate}
        onChange={handleDateChange}
        locale="es"
        displayFullDays
      />
    </View>
  );
};

export default CustomDatePicker;
