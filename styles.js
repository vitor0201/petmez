import React from 'react';
import { StyleSheet } from 'react-native';
import { Constants } from 'expo';
var Dimensions = require('Dimensions');
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  statusBar: {
    backgroundColor: "#bbb",
    height: Constants.statusBarHeight,
  },
  container: {
    flex: 1
  },
  isRed: {
    color: '#df4723'
  },
  backgroundWhite: {
    backgroundColor: '#fff',
  },
  logo: {
    width: 100,
    height: 55,
    marginTop: 70
  },
  nav: {
    marginTop: 70
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  img: {
    width: 80,
    height: 80,
    borderRadius: 40,
    margin: 10
  },
  imgRow: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    padding: 15,
  },
  inputStyle: {
    width: deviceWidth,
    padding: 15,
    backgroundColor: '#fff',
    height: 60
  },
  bold: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  button: {
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#91dc5a',
    textAlign: 'center',
    color: '#91dc5a',
    padding: 15,
    margin: 15,
    fontSize: 18,
    fontWeight: 'bold',
  },
  card: {
    width: deviceWidth * .9,
    height: deviceHeight * .75,
    borderRadius: 50,
  },
  cardDescription: {
    padding: 15,
    justifyContent: 'flex-end',
    flex: 1,
  },
  cardInfo: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
  },
  border: {
    borderTopColor: '#bbb',
    borderTopWidth: 0.5,
  },
})

module.exports = styles