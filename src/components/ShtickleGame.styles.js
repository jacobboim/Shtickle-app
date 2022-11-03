import { StyleSheet } from "react-native";
import { colors } from "../constants";

export default StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#10172a",
    alignItems: "center",
  },
  title: {
    // color: colors.lightgrey,
    fontSize: 30,
    fontWeight: "bold",
    letterSpacing: 5,

    // marginRight: "20%",
  },
  map: {
    alignSelf: "stretch",
    marginVertical: 20,
  },
  row: {
    alignSelf: "stretch",
    flexDirection: "row",
    justifyContent: "center",
  },
  cellIpad: {
    flex: 1,
    aspectRatio: 1,
    borderWidth: 2,
    margin: 3,
    borderColor: colors.darkgrey,
    maxWidth: 140,
    maxHeight: 125,
    justifyContent: "center",
    alignItems: "center",
  },
  cellIPhone: {
    flex: 1,
    aspectRatio: 1,
    borderWidth: 2,
    margin: 3,
    borderColor: colors.darkgrey,
    maxWidth: 70,
    justifyContent: "center",
    alignItems: "center",
  },

  cellText: {
    // color: colors.lightgrey,
    fontWeight: "bold",
    fontSize: 28,
    marginLeft: 0.5,
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 0,
  },

  modalCellIpad: {
    // aspectRatio: 1,
    borderWidth: 2,
    margin: 3,
    marginTop: 30,
    borderColor: colors.darkgrey,
    width: "15%",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    textAlign: "center",
    fontSize: 20,
    padding: 15,
  },

  modalCellIpone: {
    // aspectRatio: 1,
    borderWidth: 2,
    margin: 3,
    marginTop: 10,
    borderColor: colors.darkgrey,
    width: "15%",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    textAlign: "center",
    fontSize: 20,
    padding: 3,
  },

  modalCellCorrectIpad: {
    // aspectRatio: 1,
    borderWidth: 2,
    margin: 3,
    marginTop: 30,
    borderColor: colors.darkgrey,
    width: "15%",
    justifyContent: "center",
    display: "flex",
    alignItems: "center",
    display: "flex",
    textAlign: "center",
    fontSize: 20,
    backgroundColor: "#4a8f52",
    padding: 15,
  },

  modalCellCorrectIphone: {
    // aspectRatio: 1,
    borderWidth: 2,
    margin: 3,
    marginTop: 10,
    borderColor: colors.darkgrey,
    width: "15%",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    textAlign: "center",
    fontSize: 20,
    backgroundColor: "#4a8f52",
    padding: 3,
  },

  modalCellInWordIpad: {
    // aspectRatio: 1,
    borderWidth: 2,
    margin: 3,
    marginTop: 30,
    borderColor: colors.darkgrey,
    width: "15%",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    textAlign: "center",
    fontSize: 20,
    padding: 15,

    backgroundColor: "#e89736",
  },

  modalCellInWordIphone: {
    borderWidth: 2,
    margin: 3,
    marginTop: 10,
    borderColor: colors.darkgrey,
    width: "15%",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    textAlign: "center",
    fontSize: 20,
    padding: 3,

    backgroundColor: "#e89736",
  },

  modalCellNotWordIpad: {
    // aspectRatio: 1,
    borderWidth: 2,
    margin: 3,
    marginTop: 30,
    borderColor: colors.darkgrey,
    width: "15%",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    textAlign: "center",
    padding: 15,

    fontSize: 20,
    backgroundColor: "#818384",
  },

  modalCellNotWordIpone: {
    // aspectRatio: 1,
    borderWidth: 2,
    margin: 3,
    marginTop: 10,
    borderColor: colors.darkgrey,
    width: "15%",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    textAlign: "center",
    padding: 3,

    fontSize: 20,
    backgroundColor: "#818384",
  },

  modalInfoLetterIpad: {
    fontSize: 25,
    textAlign: "center",
    marginTop: 4,
  },

  modalInfoLetterIphone: {
    fontSize: 15,
    textAlign: "center",
    marginTop: 4,
  },

  modalViewIpad: {
    // margin: 20,
    height: "55%",
    width: "80%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 4,
    // elevation: 5,
  },

  modalViewIphone: {
    // margin: 20,
    height: "60%",
    width: "80%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 4,
    // elevation: 5,
  },

  button: {
    borderRadius: 20,
    padding: 10,
    marginTop: 20,
    width: 80,
    // elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#4a8f52",
  },

  textStyleIpad: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 15,
  },
  modalTextIpad: {
    marginTop: 60,
    marginBottom: 25,
    textAlign: "center",
    fontSize: 25,
  },

  textStyleIpone: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 10,
  },
  modalTextIpone: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 20,
  },
});
