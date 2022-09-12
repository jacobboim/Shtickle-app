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
  cell: {
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

  modalCell: {
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

  modalCellCorrect: {
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

  modalCellInWord: {
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

    backgroundColor: "#e89736",
  },

  modalCellNotWord: {
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

  modalInfoLetter: {
    fontSize: 15,
    textAlign: "center",
    marginTop: 4,
  },
  modalView: {
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
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 10,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 20,
  },
});
