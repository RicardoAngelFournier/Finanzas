import React, { useState, useCallback } from 'react';
import { View } from 'react-native';
import DateTimePicker, { DateType, ModeType } from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { StyleSheet } from 'react-native';

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
    <View style={styles.datePicker}>
      <DateTimePicker
        mode={mode}
        startDate={currentRange.startDate}
        endDate={currentRange.endDate}
        onChange={handleDateChange}
        locale="es"
        displayFullDays
        headerButtonColor={"#9B7EDE"}
        selectedTextStyle={{
          fontWeight: 'bold',
          color: "#fff",
        }}
      />
    </View>
  );
};

export default CustomDatePicker;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  body: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    alignItems: 'center',
  },
  titleContainer: {
    paddingVertical: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
    marginBottom: 20,
    width: '100%',
  },
  title: { fontSize: 18, fontWeight: 'bold' },
  modesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 20,
  },
  modeSelect: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  modeSelectText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  datePickerContainer: {
    alignItems: 'center',
  },
  datePicker: {
    backgroundColor: '#DED8E3',
    padding: 15,
    borderRadius: 20,
    shadowRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 0 },
  },
  footer: {
    paddingHorizontal: 5,
    paddingVertical: 5,
    marginTop: 15,
  },
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  todayButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  todayButtonText: {
    fontWeight: 'bold',
  },
});