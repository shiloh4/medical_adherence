import React, { useState, useContext, useEffect } from 'react';
import { View } from 'react-native';
import { Button, Card, Title, Paragraph, Text } from 'react-native-paper';
import { sendPushNotification, registerForPushNotificationsAsync, handleRegistrationError, PushTokenContext } from '../util';

const url = 'https://relieved-koi-supposedly.ngrok-free.app';
const cardColor = [ 'lightgray',  // not collected
                    'lightgreen', // taken
                    'tomato'      // not taken
                  ];

const PrescriptionCard = ({ prescription }) => {
    const expoPushToken = useContext(PushTokenContext);
    const [takeMedNow, setTakeMedNow] = useState([]);
    const [timeTillNextDose, setTimeTillNextDose] = useState(null);

    const calculateTimeTillNext = () => {
        if (prescription.date_collected === null) {

          return;
        }

        const currentDate = new Date();
        const lastTakenDate = new Date(
            prescription.last_taken === null
                ? prescription.date_collected
                : prescription.last_taken
        );

        // Calculate time since last dose in hours
        const timeSinceLast = (currentDate - lastTakenDate) / (1000 * 60 * 60); // Convert milliseconds to hours

        const currentTime = 24 / prescription.frequency - timeSinceLast;

        setTimeTillNextDose(currentTime);
        console.log(timeTillNextDose);

        if (currentTime  < -1) {
            triggerPostCall();
        }
    };

    // Function to trigger the POST call if the condition is met
    const triggerPostCall = async () => {
        try {
            const response = await fetch(`${url}/api/v1/take_medicine/${prescription.patientid}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: prescription.activeid,
                    name: prescription.name,
                    date: ""
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`HTTP Error: ${response.status}`, errorText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            console.log('Missed dose successfully logged.');
        } catch (error) {
            console.error('Error posting missed dose:', error);
        }
    };

  useEffect(() => {
          // Set up an interval to calculate time till next dose every 5 minutes
          const intervalId = setInterval(calculateTimeTillNext, 300000);

          calculateTimeTillNext(); // on mount

          // Clear interval when the component unmounts
          return () => {
              clearInterval(intervalId);
          };
  }, [prescription]);

    useEffect(() => {
        if (timeTillNextDose !== null && timeTillNextDose === 0) {
            setTakeMedNow(prevState => [...prevState, prescription.name]);
        }
    }, [timeTillNextDose]);

    useEffect(() => {
        if (takeMedNow.length > 0) {
          sendPushNotification(expoPushToken);
          setTakeMedNow([]);
        }
    }, [takeMedNow])

    return (
        <Card style={{
            backgroundColor: timeTillNextDose === null ? cardColor[0] : timeTillNextDose > 0 ? cardColor[1] : cardColor[2],
            borderRadius: 12}}>
            <Card.Content>
                <Title>{prescription.name}</Title>
                <Text variant='titleMedium'>Time till next dose: {timeTillNextDose !== null ? prescription.date_collected ? `${timeTillNextDose.toFixed(0)} hours` : 'Calculating...' : 'Not collected' }</Text>
            </Card.Content>
        </Card>
    );
};

export default PrescriptionCard;
