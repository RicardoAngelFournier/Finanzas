import { StyleSheet, Image, Platform, View, Dimensions, } from 'react-native';
import { Text } from 'react-native';
import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { PieChart } from "react-native-gifted-charts";

export default function Credit() {

    const pieData = [
        {
          value: 47,
          color: '#009FFF',
          gradientCenterColor: '#006DFF',
          focused: true,
        },
        {value: 40, color: '#93FCF8', gradientCenterColor: '#3BE9DE'},
        {value: 16, color: '#BDB2FA', gradientCenterColor: '#8F80F3'},
        {value: 3, color: '#FFA5BA', gradientCenterColor: '#FF7F97'},
      ];

      const renderDot = color => {
        return (
          <View
            style={{
              height: 10,
              width: 10,
              borderRadius: 5,
              backgroundColor: color,
              marginRight: 10,
            }}
          />
        );
      };

      const renderLegendComponent = () => {
        return (
          <>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginBottom: 10,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: 120,
                  marginRight: 20,
                }}>
                {renderDot('#006DFF')}
                <Text style={{color: 'white'}}>Excellent: 47%</Text>
              </View>
              <View
                style={{flexDirection: 'row', alignItems: 'center', width: 120}}>
                {renderDot('#8F80F3')}
                <Text style={{color: 'white'}}>Okay: 16%</Text>
              </View>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: 120,
                  marginRight: 20,
                }}>
                {renderDot('#3BE9DE')}
                <Text style={{color: 'white'}}>Good: 40%</Text>
              </View>
              <View
                style={{flexDirection: 'row', alignItems: 'center', width: 120}}>
                {renderDot('#FF7F97')}
                <Text style={{color: 'white'}}>Poor: 3%</Text>
              </View>
            </View>
          </>
        );
      };

  return (
    <View style={styles.container}>
        <View style={styles.backcard} />

        {/* Header Section */}
        <View style={styles.header}>
            <Text style={{ fontFamily: 'Medium', fontSize: 18 }} >ENERO 2025</Text>
            <Text style={styles.subtitle}>Buenos días Ricardo</Text>

            <View
      style={{
        margin: 10,
        padding: 10,
        borderRadius: 20,
        backgroundColor: '#232B5D',
      }}>

      <View style={{padding: 5, alignItems: 'center'}}>
        <PieChart
          data={pieData}
          donut
          showGradient
          sectionAutoFocus
          radius={80}
          innerRadius={50}
          innerCircleColor={'#232B5D'}
          centerLabelComponent={() => {
            return (
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Text
                  style={{fontSize: 22, color: 'white', fontFamily: 'Regular'}}>
                  47%
                </Text>
                <Text style={{fontSize: 12, color: 'white', fontFamily: 'Regular'}}>Excelente</Text>
              </View>
            );
          }}
        />

<Text style={{fontSize: 12, color: 'white', fontFamily: 'Regular'}}>Excelente</Text>

      </View>
    </View>
        </View>

    </View>
  );
}

const { width, height } = Dimensions.get('window');
const cardWidth = width * 0.4;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F1FAEE',
        paddingHorizontal: 16,
      },
      backcard: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: height * 0.35,
        backgroundColor: '#EDD2FC',
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
      },
      header: {
        marginTop: 40,
        marginBottom: 20,
      },
      title: {
        fontSize: 24,
        color: '#000',
      },
      subtitle: {
        fontSize: 14,
        color: '#0C3B35',
        fontFamily: "Medium", 
      },
});
