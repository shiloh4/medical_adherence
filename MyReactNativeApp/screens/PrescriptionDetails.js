import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { IconButton, TouchableRipple, Checkbox, Button, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/AntDesign';

const url = 'https://relieved-koi-supposedly.ngrok-free.app';
const backgroundColor = ['tomato', 'lightgreen'];
const windowHeight = Dimensions.get('window').height;

const PrescriptionDetails = ({ route, navigation }) => {
    // console.log(route.params);
    const { prescription } = route.params;
    const [checked, setChecked] = useState(false);
    const currentDate = new Date().toISOString();

    const handleSavePress = async () => {
        const data = {
            id: prescription.activeid,  // Send any relevant data
            name: prescription.name,
            date: (checked ? currentDate : ""),
        };

        try {
            // const requestUrl = `${url}/api/v1/take_medicine/${prescription.patientid}`;
            // console.log("Request URL:", requestUrl);
            console.log(data);
            
            const response = await fetch(`${url}/api/v1/take_medicine/${prescription.patientid}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                // Log the status and response text for debugging
                const errorText = await response.text(); // Get raw response as text
                console.error(`HTTP Error: ${response.status}`, errorText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // console.log(prescription);
            navigation.goBack();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const bgColor = checked ? backgroundColor[1] : backgroundColor[0];

    return (
        <View style={{flex: 1, backgroundColor: bgColor}}>
            <TouchableRipple onPress={() => navigation.goBack()}>
                    <IconButton 
                        icon="arrow-left"
                        style={{
                            alignSelf: 'flex-end',
                            borderRadius: 30,
                            marginTop:'25%',
                            marginHorizontal: '5%'
                        }}
                    />
            </TouchableRipple>
            <View style={{flexDirection: 'row', marginHorizontal: '5%', justifyContent: 'space-between' }}>
                <Text style={{fontSize: 35,
                              fontWeight: 'bold',
                }}>{prescription.name}</Text>
            
                <Checkbox status={checked ? 'checked' : 'unchecked'} 
                          onPress={() => { setChecked(!checked) }} 
                          color='rebeccapurple'
                ></Checkbox>    
            </View>
            <Text variant="titleMedium" style={{marginHorizontal: '5%'}}>Dosage: {prescription.dosage} mg</Text>
            <Text variant="titleMedium" style={{marginHorizontal: '5%'}}>Frequency: {prescription.frequency} per day</Text>
            <Text variant="titleMedium" style={{marginHorizontal: '5%'}}>Duration: {prescription.duration} weeks</Text>
            <Text variant="titleMedium" style={{marginHorizontal: '5%'}}>Remaining Quantity: {prescription.remaining_quantity} pills</Text>
            <View style={{flex: 1, flexDirection: 'row', marginHorizontal: '8%', marginTop: '30%', gap: 10}}>
            <Icon name="infocirlceo" size = {18} />
            <Text variant="titleMedium">{ prescription.description }</Text> 
            </View>
            <Button mode="contained" textColor='white' buttonColor='rebeccapurple'
                    onPress={() => {handleSavePress()}} style={{
                flex: 1,
                position: 'absolute',
                alignSelf: 'flex-end',
                justifyContent:'flex-end',
                marginHorizontal: '5%',
                marginBottom: '5%',
                bottom: 20,  // Button positioned 20 units from the bottom
                right: 20
            }}>Save</Button>
        </View>
    );
};

export default PrescriptionDetails;