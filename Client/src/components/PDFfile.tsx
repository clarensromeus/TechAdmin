import * as React from 'react';
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from '@react-pdf/renderer';
// external imports of ressources
import SchoolLogo from '../images/static/educationLogo.png';
import gradedHot from '../images/static/graduate.png';
import { IInfo } from '../Interface/student';

const PDFDocument: React.FC<
  Omit<IInfo<string>['doc'], 'Password' | 'ConfirmPassword'>
> = ({
  _id,
  _ID_User,
  Firstname,
  Lastname,
  Email,
  ClassName,
  SchoolLevel,
  Class,
}) => {
  // Create styles
  const styles = StyleSheet.create({
    page: {},
    Title: {
      textAlign: 'center',
      marginTop: 8,
      marginHorizontal: 29,
      fontWeight: 'bold',
      fontSize: 30,
    },
    Logo: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: 40,
      marginHorizontal: 240,
      width: '20%',
    },
    LogoText: {
      textAlign: 'center',
      marginTop: 5,
      marginHorizontal: 29,
    },
    StudentInfo: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      marginHorizontal: 40,
      paddingVertical: 10,
      gap: 2,
      marginTop: 35,
      backgroundColor: 'rgba(0,0,255,0.4)',
    },
    gradeIcon: {
      width: 38,
    },
    InfoText: {
      fontWeight: 'bold',
    },
    InfoWrapper: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
      backgroundColor: '#f5f5f5',
      marginHorizontal: 40,
    },
    TitleField: {
      textTransform: 'capitalize',
      fontWeight: 'bold',
      fontSize: 25,
    },
    Field: {
      marginLeft: 40,
    },
  });

  return (
    <Document style={{ width: 800 }}>
      <Page size="A4" style={styles.page}>
        <View style={styles.Logo}>
          <Image src={SchoolLogo} />
        </View>
        <View style={styles.Title}>
          <Text>TechAdmin</Text>
        </View>
        <View style={styles.LogoText}>
          <Text>Learning, creating and pushing forward</Text>
        </View>
        <View style={styles.StudentInfo}>
          <Image style={styles.gradeIcon} src={gradedHot} />
          <Text style={styles.InfoText}>Personal student informations</Text>
        </View>
        <View style={styles.InfoWrapper}>
          <Text style={styles.TitleField}>firstname:</Text>
          <Text style={styles.Field}>{Firstname}</Text>
        </View>
        <View style={styles.InfoWrapper}>
          <Text style={styles.TitleField}>lastname:</Text>
          <Text style={styles.Field}>{Lastname}</Text>
        </View>
        <View style={styles.InfoWrapper}>
          <Text style={styles.TitleField}>Class:</Text>
          <Text style={styles.Field}>{Class}</Text>
        </View>
        <View style={styles.InfoWrapper}>
          <Text style={styles.TitleField}>ClassName:</Text>
          <Text style={styles.Field}>{ClassName}</Text>
        </View>
        <View style={styles.InfoWrapper}>
          <Text style={styles.TitleField}>SchooLevel:</Text>
          <Text style={styles.Field}>{SchoolLevel}</Text>
        </View>
        <View style={styles.InfoWrapper}>
          <Text style={styles.TitleField}>Email:</Text>
          <Text style={styles.Field}>{Email}</Text>
        </View>
        <View style={styles.InfoWrapper}>
          <Text style={styles.TitleField}>ID:</Text>
          <Text style={styles.Field}>{_ID_User}</Text>
        </View>
        <View style={styles.InfoWrapper}>
          <Text style={styles.TitleField}>Date of birth:</Text>
          <Text style={styles.Field}>10/11/2000</Text>
        </View>
      </Page>
    </Document>
  );
};

export default PDFDocument;
