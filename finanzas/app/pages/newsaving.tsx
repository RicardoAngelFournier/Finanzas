import { StyleSheet, Text, TouchableOpacity, View, FlatList } from 'react-native'
import React from 'react'
import { Dimensions } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { ButtonGroup } from '@rneui/themed'
import { color, Input } from '@rneui/base';
import { useState } from 'react';
import { Divider } from '@rneui/themed';
import { supabase } from '@/database/supabaseClient';
import { useEffect } from 'react';
import { useRef } from 'react';
import { Skeleton } from '@rneui/themed';

export default function newsaving() {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [amount, setAmount] = useState('');
    const [cards, setCards] = useState([]);
    const [selectedCard, setSelectedCard] = useState(null);
    const [savingsTotal, setSavingsTotal] = useState(0);
    const [error, setError] = useState('');
    const [remainingBalance, setRemainingBalance] = useState(null);
    const [loading, setLoading] = useState(true); // Add loading state
    
    const amountInputRef = useRef(null); // Reference for shaking the inp

    useEffect(() => {
        fetchCards();
        fetchSavingsTotal();
    }, []);

    const fetchCards = async () => {
        setLoading(true); // Set loading to true when starting to load cards
        const { data, error } = await supabase.from('cards').select('*');
        if (error) {
            console.error('Error fetching cards:', error);
        } else {
            setCards(data);
            setLoading(false); // Set loading to true when starting to load cards
        }
    };

    const fetchSavingsTotal = async () => {
        const { data, error } = await supabase.from('savings').select('total').order('id', { ascending: false }).limit(1);
        if (error) {
            console.error('Error fetching savings total:', error);
        } else if (data.length > 0) {
            setSavingsTotal(data[0].total);
        }
    };

    const handleTransfer = async () => {
        setError(""); // Clear previous errors
    
        if (!selectedCard || !amount) {
            setError("Seleccione una cuenta y una cantidad válida.");
            amountInputRef.current?.shake();
            return;
        }
    
        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            setError("Ingrese un monto válido.");
            amountInputRef.current?.shake();    
            return;
        }
    
        if (selectedIndex === 0 && numericAmount > selectedCard.balance) {
            setError("Saldo insuficiente en la cuenta seleccionada.");
            amountInputRef.current?.shake();
            return;
        }
    
        if (selectedIndex === 1 && numericAmount > savingsTotal) {
            setError("No hay suficiente saldo en ahorros.");
            amountInputRef.current?.shake();
            return;
        }
    
        const newDate = new Date().toISOString(); // Generate the current timestamp
    
        try {
            if (selectedIndex === 0) {
                // Depositing into savings
                await supabase
                    .from('savings')
                    .insert([{ date: newDate, amount: numericAmount, total: savingsTotal + numericAmount }]);
    
                await supabase
                    .from('cards')
                    .update({ balance: selectedCard.balance - numericAmount })
                    .eq('id', selectedCard.id);
            } else {
                // Withdrawing from savings
                await supabase
                    .from('savings')
                    .insert([{ date: newDate, amount: -numericAmount, total: savingsTotal - numericAmount }]);
    
                await supabase
                    .from('cards')
                    .update({ balance: selectedCard.balance + numericAmount })
                    .eq('id', selectedCard.id);
            }
    
            alert("Transacción realizada con éxito");
            fetchCards();
            fetchSavingsTotal();
            setAmount('');
        } catch (error) {
            console.error("Error updating data:", error);
            setError("Hubo un error en la transacción.");
            amountInputRef.current?.shake();
        }
    };
    
    const handleAmountChange = (value) => {
        setAmount(value);
    
        const numericAmount = parseFloat(value);
        if (!selectedCard || isNaN(numericAmount)) {
            setRemainingBalance(null);
            return;
        }
    
        if (selectedIndex === 0) {
            // Depositing into savings (subtracting from card balance)
            setRemainingBalance(selectedCard.balance - numericAmount);
        } else {
            // Withdrawing from savings (card balance increases)
            setRemainingBalance(selectedCard.balance + numericAmount);
        }
    };


    return (
        <View style={styles.container}>
            <View style={styles.backcard} />
            <View style={styles.header}>
                <Text style={styles.title}>Nuevo Ahorro</Text>
            </View>
            <LinearGradient
                colors={["#DED8E3", "#FFFFFF", "#A8DADC"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.cardContainer, { width: width - 20, marginHorizontal: 10 }]}
            >
                <View style={styles.cardTop}>
                    <View>
                        <Text style={styles.totalBalanceText}>Ahorro:</Text>
                        <Text style={styles.balanceAmount}>${savingsTotal}</Text>
                    </View>
                    <View>
                        <FontAwesome6 name="circle-dollar-to-slot" size={30} color="black" />
                    </View>
                </View>
                <View style={styles.row}>
                    <View>
                        <Text style={styles.totalBalanceText}>Saldo en tarjeta despues de transaccion:</Text>
                    </View>
                </View>
                <View style={styles.row}>
                    <View>
                    <Text style={[
                            styles.balanceAmount, 
                            remainingBalance !== null && remainingBalance < 0 ? { color: 'red' } : {}
                        ]}
                    >
                        {remainingBalance !== null ? `$${remainingBalance.toFixed(2)}` : '--'}
                    </Text>
                    </View>
                </View>
            </LinearGradient>

            <View style={styles.buttons}>
            <ButtonGroup
                buttons={['Ingreso', 'Retiro']}
                selectedIndex={selectedIndex}
                selectedButtonStyle={{backgroundColor: "#957FEF"}}
                onPress={(value) => {
                    setSelectedIndex(value);
                }}
                containerStyle={{ marginBottom: 20, borderRadius: 20, borderWidth: 2}}
                textStyle={{fontFamily: "Medium"}}
                buttonContainerStyle={{}}
                />

            </View>

            <View style={styles.cardBottom}>
            <Input
                placeholder='Cantidad'
                ref={amountInputRef}
                keyboardType="numeric"
                value={amount}
                onChangeText={handleAmountChange}
                placeholderTextColor={"gray"}
                inputStyle={{ fontFamily: "Bold", fontSize: 32, color: "#957FEF" }}
                leftIcon={<FontAwesome6 name="dollar-sign" size={30} color="gray" />}
                errorMessage={error} // Show error message
            />
            </View>

            <View style={styles.card}>
                <Text style={styles.subtitle}>Cuenta de Origen</Text>
                {loading ? (
            <View style={styles.card}>
              <Skeleton
                LinearGradientComponent={LinearGradient}
                animation="wave"
                style={styles.cardItem}
              />
            </View>
            ) : (

                <View style={styles.row3}>
                <FlatList
                horizontal
                data={cards}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => setSelectedCard(item)}>
                        <LinearGradient
                            colors={["#fff", item.color, "#A8DADC"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1., y: 1.2 }}
                            style={[
                                styles.cardItem,
                                selectedCard?.id === item.id && { borderWidth: 4, borderColor: '#000', }
                            ]}
                        >
                            <View style={styles.row3}>
                                <Text style={styles.cardNameLabel}>{item.name}</Text>
                            </View>
                            <Text style={styles.cardNumber}>${item.balance}</Text>
                            <Text style={styles.subtitle}>{item.bank}</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                )}
                
            />
            </View>
            )}
            </View>
        
            <TouchableOpacity onPress={handleTransfer} style={styles.transferButton}>
                <Text style={styles.transferButtonText}>Transferir</Text>
            </TouchableOpacity>

        </View>
    )
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
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
    header: {
        marginTop: 40,
        color: '#000',
    },
    title: {
        fontSize: 26,
        fontFamily: "Bold",
        color: '#000',
    },
    subtitle: {
        fontSize: 16,
        color: '#000',
        fontFamily: "Medium",
        marginVertical: 3
      },
    cardContainer: {
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
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 5,
    },
    row3: {
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "space-between",
      },
    cardNumber: {
        fontSize: 16,
        fontFamily: "ExtraBold",
        color: "#000",
    },
    cardBottom: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    cardNameLabel: {
        fontSize: 14,
        fontFamily: "Bold",
        color: "#000",
    },
    cardName: {
        fontSize: 16,
        fontFamily: "Bold",
        color: "#000",
    },
    card: {
        alignItems: 'center',
        width: width - 32,
        backgroundColor: '#FAFAFF',
        borderRadius: 20,
        padding: 14,
        borderColor: "#DED8E3",
        borderWidth: 2
      },
      cardItem: {
        height: 150,
        width: 130,
        borderRadius: 20,
        padding: 12,
        marginRight: 16,
        justifyContent: 'space-between',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
      },
      transferButton: { backgroundColor: "#957FEF", padding: 15, borderRadius: 10, alignItems: "center", marginTop: 20 },
      transferButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
})
