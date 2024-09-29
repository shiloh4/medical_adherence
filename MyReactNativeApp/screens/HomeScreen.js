import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, FlatList, Text, Animated, StyleSheet, Easing } from 'react-native';
import { Avatar, Card, IconButton, List, TouchableRipple, TextInput } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import PrescriptionCard from '../components/PrescriptionCard';

const url = 'https://relieved-koi-supposedly.ngrok-free.app'

const HomeScreen = ({ navigation }) => {
    const [text, setText] = useState("");
    const [textInputError, setTextInputError] = useState("");
    const [prescriptions, setPrescription] = useState();
    const [id, setId] = useState(1);
    const [streak, setStreak] = useState(0);
    const streakAnim = useRef(new Animated.Value(0)).current;
    const lottieRef = useRef(null);
    const [refresh, setRefresh] = useState(false);

    const handleRefresh = () => {
        setRefresh(prevState => !prevState);
    };

    const checkMedicationsForToday = async () => {
        const today = new Date().toISOString().split('T')[0]; // Format the date as YYYY-MM-DD

        try {
            // console.log("hello");
            const response = await fetch(`${url}/api/v1/check_streak/${id}/?date=${today}`);
            
            if (!response.ok) throw new Error('Failed to fetch data');
            
            const data = await response.json();
            console.log(data); 
            if (data.result) {
                setStreak((prev)=>{prev+1});
            } else {
                setStreak(0); // Reset streak if false
            }
        } catch (error) {
            console.error('Error checking medications:', error);
        }
    };

    // useEffect(()=>{
        
    //     if (prescriptions){
    //     fetch(`${url}/api/v1/set_streak/${prescriptions.patientid}/?streak=${newStreak}`, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //     })
    //     .then(()=>{console.log("Success")})
    //     .catch((error) => {console.error("Failed to set streak")})
    // }}, [streak]);

    const getTimeUntilMidnight = () => {
        const now = new Date();
        const midnight = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() + 1, // Next day
            0, 0, 0, 0 // Midnight
        );
        return midnight - now;
    };

    const updateStreakAtMidnight = () => {
        checkMedicationsForToday(); // Call the function to check today's medications
        const timeUntilMidnight = getTimeUntilMidnight();

        // Set timeout to trigger the streak update at midnight
        setTimeout(() => {
            checkMedicationsForToday(); // Re-check at midnight
            setInterval(checkMedicationsForToday, 24 * 60 * 60 * 1000); // Set interval to repeat every 24 hours
        }, timeUntilMidnight);
    };

    useEffect(() => {
        // Call the streak update function when the component mounts
        updateStreakAtMidnight();
    }, [refresh]);

    const handleEnterLog = async () => {
        if (text.trim() === '') {
            setTextInputError('Please enter a valid log.');
            return;
        }

        const userLog = {
            content: text
        };

        try {
            // const requestUrl = `${url}/api/v1/take_medicine/${prescription.patientid}`;
            // console.log("Request URL:", requestUrl);
            // console.log(data);
            
            const response = await fetch(`${url}/api/v1/log_feelings/${id}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userLog),
            });

            if (!response.ok) {
                // Log the status and response text for debugging
                const errorText = await response.text(); // Get raw response as text
                console.error(`HTTP Error: ${response.status}`, errorText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error:', error);
            setTextInputError('Failed to submit the log. Please try again.');
        }

        setText("");
    };

    const animateStreak = () => {
        streakAnim.setValue(0);  // Reset animation value
        Animated.timing(streakAnim, {
            toValue: -50,         // Fly up by 50 units
            duration: 500,        // Animation duration
            easing: Easing.out(Easing.quad),  // Smooth easing function
            useNativeDriver: true,  // Use native driver for performance
        }).start();
    };

    useFocusEffect(
        useCallback(() => {
            // Whenever the screen comes into focus, trigger the animation
            animateStreak();
            if (lottieRef.current) {
                lottieRef.current.play();  // Start the Lottie animation
            }

            // Optionally, you can handle cleanup here if needed
            return () => {
                if (lottieRef.current) {
                    lottieRef.current.reset();  // Pause the Lottie animation when leaving focus
                }
                streakAnim.setValue(0);  // Reset animation when leaving focus (optional)
            };
        }, [streak, refresh]) // Dependencies include streak, to re-animate when it changes
    );
    
    // populate FlatList w prescriptions
    useFocusEffect(
        useCallback(() => {
        let ignoreStaleRequest = false;
        fetch(`${url}/api/v1/patient_meds/${id}/`, {
          method: "GET",
          credentials: "same-origin",
        })
          .then((response) => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
          })
          .then((data) => {
            // If ignoreStaleRequest was set to true, we want to ignore the results of the
            // the request. Otherwise, update the state to trigger a new render.
            if (!ignoreStaleRequest) {
                setPrescription(data);
                console.log(data);
                fetch(`${url}/api/v1/set_streak/${prescriptions.patientid}/?streak=${newStreak}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                .then(()=>{console.log("Success")})
                .catch((error) => {console.error("Failed to set streak")})
            }
          })
          .catch((error) => console.log(error));
        return () => {
          ignoreStaleRequest = true;
        };
      }, [refresh]));

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
            <View style={{
                fontSize: 20,
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: '5%',
                marginHorizontal: '5%',
                justifyContent: 'space-between',
                alignSelf: 'flex-end',
                gap: 0
            }}>
                <IconButton
                    icon="refresh" // Icon name for refresh (depends on your icon library)
                    size={30}
                    onPress={handleRefresh} // Trigger refresh on press
                    style={{marginHorizontal: '5%'}}
                />
                <LottieView
                    ref={lottieRef}
                    source={require('../assets/fire-animation.json')}  // Your Lottie animation asset
                    loop={false}
                    style={{width: 50,
                            height: 50
                    }}
                />
                <Animated.Text style={[styles.streakText, { transform: [{ translateY: streakAnim }] }]}>
                    {streak}
                </Animated.Text>
            </View>

            
            
            <List.Section>
                <List.Subheader style={{fontSize: 30,
                                        fontWeight: 'bold',
                                        marginHorizontal: '5%'
                }}>Active Prescriptions</List.Subheader>
            </List.Section>

            <FlatList
                style={{maxHeight: '50%',
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
                error={textInputError}
                right={<TextInput.Icon icon="check" onPress={handleEnterLog}/>}
                style={{marginHorizontal: '5%',
                        marginVertical: '2%',
                        minHeight: '15%',
                        maxHeight: '15%'
                }}/>

            {textInputError ? <Text style={{marginHorizontal: '5%', color: '#8b0000'}}>{textInputError}</Text> : null}

            
        </View>
    );
};

const styles = StyleSheet.create({
    streakText: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'orange',
        marginTop: '25%'
    },
})

export default HomeScreen;
