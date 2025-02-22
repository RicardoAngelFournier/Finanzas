import React, { useState, useCallback } from 'react';
import { View } from 'react-native';
import DateTimePicker, { DateType, ModeType } from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { StyleSheet } from 'react-native';

dayjs.locale('es');

interface CustomDatePickerProps {
  date: DateType | null; // Accepts a single date or null
  onDateChange: (date: DateType) => void; // Emits a single date
  mode?: ModeType;
  textColor?: string;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  date,
  onDateChange,
  mode = 'single', // Change default mode to 'single'
  textColor = '#000',
}) => {
  // Ensure a valid initial date (fallback to today's date)
  const initialDate = date ?? new Date();
  const [selectedDate, setSelectedDate] = useState<DateType>(initialDate);

  const handleDateChange = useCallback(
    (params: { date: DateType }) => {
      setSelectedDate(params.date);
      onDateChange(params.date);
    },
    [onDateChange]
  );

  return (
    <View style={styles.datePicker}>
      <DateTimePicker
        mode={mode}
        date={selectedDate} // Use single date
        onChange={handleDateChange}
        locale="es"
        displayFullDays
        headerButtonColor={"#9B7EDE"}
        selectedTextStyle={{
          color: "#fff",
          fontFamily: "Bold"
        }}
      />
    </View>
  );
};

export default CustomDatePicker;

const styles = StyleSheet.create({
  datePicker: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 20,
    shadowRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 0 },
    borderColor: "#DED8E3",
    borderWidth: 2
  }
});
