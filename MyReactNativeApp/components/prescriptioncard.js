import React from 'react';
import { View } from 'react-native';
import { Button, Card, Title, Paragraph } from 'react-native-paper';

const PrescriptionCard = ({ prescription }) => (
  <Card>
    <Card.Content>
      <Title>{prescription.name}</Title>
      {/* <Paragraph>Dose: {prescription.dose}</Paragraph> */}
      {/* <Paragraph>Frequency: {prescription.frequency}</Paragraph> */}
    </Card.Content>
    {/* <Card.Actions>
      <Button>View Details</Button>
    </Card.Actions> */}
  </Card>
);

export default PrescriptionCard;
