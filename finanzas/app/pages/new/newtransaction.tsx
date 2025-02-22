import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { ButtonGroup, Dialog, Input, Skeleton } from '@rneui/themed';
import { supabase } from '@/database/supabaseClient';
import { Dimensions } from 'react-native';
import dayjs from 'dayjs';
import CustomDatePicker2 from '@/components/CalendarPicker2';

export default function NewTransaction() {
    const router = useRouter();
    const { id } = useLocalSearchParams(); // Card ID passed from previous screen

    const [amount, setAmount] = useState('');
    const [transactionName, setTransactionName] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(1); // 0 = Ingreso, 1 = Retiro
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [card, setCard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [visible1, setVisible1] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null); // Manage picked date

    const amountInputRef = useRef(null);

    useEffect(() => {
        fetchCardDetails();
        fetchCategories();
    }, [id]);

    // Fetch card details (balance, color, etc.)
    const fetchCardDetails = async () => {
        const { data, error } = await supabase
            .from('cards')
            .select('*')
            .eq('id', id)
            .single();
        
        if (error) console.error('Error fetching card:', error);
        else setCard(data);
        setLoading(false);
    };

    // Fetch categories
    const fetchCategories = async () => {
        const { data, error } = await supabase.from('category').select('*');
        if (error) console.error('Error fetching categories:', error);
        else setCategories(data);
    };

    const handleDateChange = (date) => {
      setSelectedDate(date);
      setVisible1(false);
  };

      const handleTransfer = async () => {
        if (!amount || isNaN(amount) || !selectedCategory || !transactionName) {
            alert('Por favor completa todos los campos.');
            return;
        }

        const transactionAmount = parseFloat(amount);
        const isWithdrawal = selectedIndex === 1;
        const newBalance = isWithdrawal ? card.balance - transactionAmount : card.balance + transactionAmount;

        if (isWithdrawal && newBalance < card.negative) {
            alert('No tienes suficiente saldo.');
            return;
        }

        const formattedDate = selectedDate
            ? dayjs(selectedDate).format('YYYY-MM-DD HH:mm:ss')
            : null;

        const transactionData = {
            name: transactionName,
            amount: transactionAmount,
            type: isWithdrawal ? 'Retiro' : 'Ingreso',
            category: selectedCategory.id,
            card: card.id,
        };

        if (formattedDate) {
            transactionData.date = formattedDate;
        }

        const { error: transactionError } = await supabase.from('transaction').insert([transactionData]);

        if (transactionError) {
            console.error('Error saving transaction:', transactionError);
            alert('Error al guardar la transacción.');
            return;
        }

        const { error: balanceError } = await supabase
            .from('cards')
            .update({ balance: newBalance })
            .eq('id', card.id);

        if (balanceError) {
            console.error('Error updating balance:', balanceError);
            alert('Error al actualizar el saldo.');
        } else {
            alert('Transacción agregada exitosamente.');
            router.back();
        }
    };

    const toggleDialog1 = () => {
      setVisible1(!visible1);
    };
  

    return (
        <View style={styles.container}>
          <View style={styles.backcard}/>
            <View style={styles.header}>
                <Text style={styles.title}>Nueva Transacción</Text>
            </View>

            {/* Card Info */}
            <LinearGradient
                colors={["#DED8E3", card?.color || "#fff", "#A8DADC"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.cardContainer}
            >
                <View style={styles.cardTop}>
                    <View>
                        <Text style={styles.totalBalanceText}>Balance Actual:</Text>
                        <Text style={styles.balanceAmount}>${card?.balance?.toFixed(2)}</Text>
                    </View>
                    <FontAwesome6 name="circle-dollar-to-slot" size={30} color="black" />
                </View>
                <View style={styles.row}>
                    <Text style={styles.totalBalanceText}>Saldo después de transacción:</Text>
                </View>
                <View style={styles.row}>
                    <Text style={[
                        styles.balanceAmount,
                        isNaN(amount) ? {} : ((selectedIndex === 1 && (card?.balance - parseFloat(amount) < card?.negative)) ? { color: 'red' } : {})
                    ]}>
                        {isNaN(amount) ? "--" : `$${(selectedIndex === 1 ? card?.balance - parseFloat(amount) : card?.balance + parseFloat(amount))?.toFixed(2)}`}
                    </Text>
                </View>
            </LinearGradient>

            {/* Transaction Type Buttons */}
            <ButtonGroup
                buttons={['Ingreso', 'Retiro']}
                selectedIndex={selectedIndex}
                selectedButtonStyle={{ backgroundColor: "#957FEF" }}
                onPress={(value) => setSelectedIndex(value)}
                containerStyle={{ marginBottom: 20, borderRadius: 20, borderWidth: 2 }}
                textStyle={{ fontFamily: "Medium" }}
            />

            {/* Amount Input */}
            <Input
                placeholder="Cantidad"
                ref={amountInputRef}
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
                placeholderTextColor="gray"
                inputStyle={{ fontFamily: "Bold", fontSize: 32, color: "#957FEF" }}
                leftIcon={<FontAwesome6 name="dollar-sign" size={30} color="gray" />}
            />

            {/* Transaction Name Input */}
            <Input
                placeholder="Nombre de Transacción"
                value={transactionName}
                onChangeText={setTransactionName}
                placeholderTextColor="gray"
                inputStyle={{ fontFamily: "Bold", fontSize: 20, color: "gray" }}
                leftIcon={<FontAwesome6 name="edit" size={30} color="gray" />}
            />

                    {/* Date Picker Section */}
                    <View style={styles.periodSelector}>
                <Text style={styles.periodText}>
                    {selectedDate ? dayjs(selectedDate).format("DD MMM YYYY - HH:mm:ss") : "Fecha automática"}
                </Text>
                <TouchableOpacity onPress={() => setVisible1(true)}>
                    <Text style={styles.changePeriod}>Cambiar Fecha</Text>
                </TouchableOpacity>

                <Dialog
                    isVisible={visible1}
                    onBackdropPress={() => setVisible1(false)}
                    overlayStyle={{
                        position: "absolute",
                        width: "90%",
                        borderRadius: 20,
                    }}
                >
                    <Dialog.Title title="Seleccionar Fecha y Hora" titleStyle={styles.periodText} />
                    <CustomDatePicker2
                        date={selectedDate}
                        onDateChange={handleDateChange}
                        mode="single"
                    />
                </Dialog>
            </View>

            {/* Category Selection */}
            <View style={{marginHorizontal: 16, marginVertical: 5}}>
            <Text style={styles.subtitle}>Selecciona una categoría:</Text>
            </View>
            {loading ? (
              <View style={{flexDirection: 'row'}}>
                <Skeleton LinearGradientComponent={LinearGradient} animation="wave" style={styles.cardItem} />
                <Skeleton LinearGradientComponent={LinearGradient} animation="wave" style={styles.cardItem} />
              </View>
            ) : (
                <FlatList
                    horizontal
                    data={categories}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => setSelectedCategory(item)}>
                            <LinearGradient
                                colors={["#fff", item.color, "#A8DADC"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={[styles.cardItem, selectedCategory?.id === item.id && { borderWidth: 4, borderColor: '#000' }]}
                            >
                                <Text style={styles.subtitle}>{item.emoji}  {item.name}</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    )}
                />
            )}

            {/* Submit Button */}
            <TouchableOpacity onPress={handleTransfer}   style={[styles.transferButton, { backgroundColor: card?.color || "#fff" }]}>
                <Text style={styles.transferButtonText}>Agregar Transacción</Text>
            </TouchableOpacity>
        </View>
    );
}
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
},
backcard: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  height: height * 0.35,
  backgroundColor: '#E6E8FF',
  borderRadius: 40
},
    header: { marginTop: 40,      paddingHorizontal: 16    },
    title: { fontSize: 26,  fontFamily: "Bold", },
    subtitle: { fontSize: 16, color: '#000', fontFamily: "Medium",  marginVertical: 3 },
    cardContainer: {
      paddingHorizontal: 16,
      borderRadius: 18,
      padding: 20,
      margin: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 5,
      width: "90%", // Adjust based on your layout
      alignSelf: "center",
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
},
totalBalanceText: {
  fontSize: 15,
  color: "#000",
  fontFamily: "Regular", // Adjust based on your fonts
},
balanceAmount: {
  fontSize: 26,
  fontFamily: "Bold",
  color: "#000",
},
cardItem: {
  height: 60,
  width: 130,
  borderRadius: 20,
  padding: 12,
  marginRight: 16,
  justifyContent: "center",
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 5,
  elevation: 5,
},
    transferButton: {  padding: 15, borderRadius: 10, alignItems: "center",  marginHorizontal: 16,},
    transferButtonText: { color: "#000", fontSize: 18, fontFamily: "Bold" },
    periodSelector: {
      flexDirection: "row",
      paddingHorizontal: 16,
      justifyContent: "space-between",
      padding: 5,
      backgroundColor: "#E6E8FF",
      borderColor: "#DED8E3",
      borderWidth: 2
    },
    periodText: {
      fontSize: 16,
      fontFamily: "Medium",
    },
    changePeriod: {
      fontSize: 14,
      color: "#957FEF",
      fontFamily: "Medium",
    },
});
