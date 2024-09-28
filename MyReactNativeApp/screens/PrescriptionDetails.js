import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IconButton, TouchableRipple } from 'react-native-paper';

const PrescriptionDetails = ({ route, navigation }) => {
    const { prescription } = route.params;

    return (
        <View>
            <View style={{flexDirection: 'row', marginHorizontal: '5%', marginTop: '25%', justifyContent: 'space-between' }}>
                <Text style={{fontSize: 35,
                              fontWeight: 'bold',
                }}>{prescription.name}</Text>
            
                <TouchableRipple onPress={() => navigation.goBack()}>
                    <IconButton 
                      icon="arrow-left"
                      style={{
                        alignSelf: 'flex-end',
                        borderRadius: 30
                      }}
                    />
                </TouchableRipple>
            </View>
            <Text style={{marginHorizontal: '5%'}}>Dose: {prescription.dose}</Text>
            <Text style={{marginHorizontal: '5%'}}>Frequency: {prescription.frequency}</Text>
            <Text style={{marginHorizontal: '5%'}}>Duration: {prescription.duration}</Text>
        </View>
    );
};

export default PrescriptionDetails;