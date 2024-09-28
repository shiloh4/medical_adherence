import React from 'react';
import { View, FlatList, Text, TouchableOpacity } from 'react-native';
import { Avatar, Card, IconButton, List, TouchableRipple, TextInput } from 'react-native-paper';
import PrescriptionCard from '../components/prescriptioncard';

const HomeScreen = ({ navigation }) => {
    const [text, setText] = React.useState("");

    const handleTickPress = () => {
      console.log('Tick button pressed');
    };

    const prescriptions = [
      { id: '1', name: 'Ibuprofen', dose: '200mg', frequency: '1/day', duration: '1/1/2025' },
      { id: '2', name: 'Aspirin', dose: '100mg', frequency: '1/day', duration: '1/1/2025' },
      { id: '3', name: 'Aspirin', dose: '100mg', frequency: '1/day', duration: '1/1/2025' },
      { id: '4', name: 'Aspirin', dose: '100mg', frequency: '1/day', duration: '1/1/2025' },
      { id: '5', name: 'Aspirin', dose: '100mg', frequency: '1/day', duration: '1/1/2025' },
      { id: '6', name: 'Aspirin', dose: '100mg', frequency: '1/day', duration: '1/1/2025' },
      { id: '7', name: 'Aspirin', dose: '100mg', frequency: '1/day', duration: '1/1/2025' },
      { id: '8', name: 'Aspirin', dose: '100mg', frequency: '1/day', duration: '1/1/2025' },
      { id: '9', name: 'Aspirin', dose: '100mg', frequency: '1/day', duration: '1/1/2025' },
      { id: '10', name: 'Aspirin', dose: '100mg', frequency: '1/day', duration: '1/1/2025' },
      { id: '11', name: 'Aspirin', dose: '100mg', frequency: '1/day', duration: '1/1/2025' },
      { id: '12', name: 'Aspirin', dose: '100mg', frequency: '1/day', duration: '1/1/2025' },
      { id: '13', name: 'Aspirin', dose: '100mg', frequency: '1/day', duration: '1/1/2025' },
    ];

    const renderItem = ({ item }) => (
        <TouchableRipple onPress={() => navigation.navigate('PrescriptionDetails', { prescription: item })}>
            <Card style={{ 
                marginVertical: '1%',
                marginHorizontal: '5%'
            }}>
                <PrescriptionCard prescription={item} />
            </Card>
        </TouchableRipple>
    );

    return (
        <View>
            <List.Section>
                <List.Subheader style={{fontSize: 35,
                                        fontWeight: 'bold',
                                        marginTop: '30%',
                                        marginHorizontal: '5%'
                }}>Active Prescriptions</List.Subheader>
            </List.Section>


            <FlatList
                style={{marginTop: '2%',
                        maxHeight: '50%',
                        minHeight: '50%'
                }}
                data={prescriptions}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
            />

            <Text style={{marginHorizontal: '5%',
                          marginTop: '5%',
                          fontSize: 20}}>Feeling funny?</Text>
            <TextInput placeholder="Log any sensation or side effects"
                value={text}
                onChangeText={text=>setText(text)}
                multiline={true}
                textAlignVertical='top'
                right={<TextInput.Icon icon="check" onPress={handleTickPress}/>}
                style={{marginHorizontal: '5%',
                        marginVertical: '2%',
                        minHeight: '20%',
                        maxHeight: '20%'
                }}/>
        </View>
    );
};

export default HomeScreen;
