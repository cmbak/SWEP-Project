import { getRouteInfoFromState } from 'expo-router/build/LocationProvider';
import React, {useState, useCallback, useEffect} from 'react';

import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Button,
    StatusBar,
    SafeAreaView,
    ScrollView,
    Image,
    KeyboardAvoidingView,
    TouchableOpacity,
    Dimensions,
} from 'react-native';

import {LineChart, BarChart,} from 'react-native-chart-kit';

import {Table, Row, Rows } from "react-native-table-component";

export default function diagnosticsDash() {
    const [name, setName] = useState("");
    const [problem, setProblem] = useState("");
    const [offset, setOffset] = useState(0);
    const [errors, setErrors] = useState({})

    {/* To hide or display elements */}
    const [displayDashTitle, setDashTitleVisible] = useState(true);
    const [displayDashboardRow1, setDashboardRow1Visible] = useState(true);
    const [displayDashboardRow2, setDashboardRow2Visible] = useState(true);
    const [displayBackIcon, setBackIconVisible] = useState(false);
    
    const [displayImageDesc1, setImageDesc1Visible] = useState(true);
    const [displayImageDesc2, setImageDesc2Visible] = useState(true);

    const [displayDevForm, setDevFormVisible] = useState(false);
    const [displayGraph, setGraphVisible] = useState(false);
    const [displayProblemTable, setProblemTableVisible] = useState(false);
    const [displayUserChat, setUserChatVisible] = useState(false);

    const [displaySpecificChat, setSpecificChatVisible] = useState(false);
    const [currentUser, setCurrentUser] = useState("");

    const dashboard = () => {
        {/* Used to hide or display the dashboard depending on the elements clicked on */}
        setDashTitleVisible(!displayDashTitle);
        setBackIconVisible(false);

        setDashboardRow1Visible(!displayDashboardRow1);
        setDashboardRow2Visible(!displayDashboardRow2);

        setImageDesc1Visible(!displayImageDesc1);
        setImageDesc2Visible(!displayImageDesc2);
    }

    const goBack = (arg=null) => {
        {/* Hide the current screen and go back to the dashboard */}
        if (arg != null) {
            {/* The back button was clicked from within a specific chat (a string was passed)}
            {/* Go back to the chat screen instead of the dashboard */}
            setUserChatVisible(true);   
            setSpecificChatVisible(false);
            setCurrentUser("");
        }
        else{
            setDevFormVisible(false);
            setGraphVisible(false);
            setProblemTableVisible(false);
            setSpecificChatVisible(false);
            setUserChatVisible(false);
            dashboard();
        }

        setReplyList([]);

        
    }

    const showGraph = () => {
        {/* Display the graph and hide the dashboard */}
        dashboard();
        setBackIconVisible(true);
        setGraphVisible(true);
    }

    const showDevForm = () => {
        {/* Display the form to contact the devs and hide the dashboard */}
        dashboard();
        setBackIconVisible(true);
        setDevFormVisible(true);
    }

    const showProblemTable = () => {
        {/* Display the table with issues reported by users */}
        dashboard();
        setBackIconVisible(true);
        setProblemTableVisible(true);
    }

    const showUserChat = () => {
        {/* Display the table with issues reported by users */}
        dashboard();
        setBackIconVisible(false);  {/* False here because I created a separate back button for this page */}
        setUserChatVisible(true);
    }
    
    const validateForm = () => {
        {/* Checks if the text input box is empty on the dev form*/}
        let errors = {}

        if (!name) errors.name = "Your name is required";
        if (!problem) errors.problem = "The problem is required";

        setErrors(errors);
        return Object.keys(errors).length === 0;
        // Return true if there are no errors so the form can be submitted
    }

    const handleSubmit = () => {
        {/* Submits the dev form if boxes aren't empty */}
        if(validateForm()) {
            console.log("Submitted", name, problem);
            setProblem("");
            setName("");
            setErrors({});
        }
    }

    {/* For the line graph */}
    const linedata = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        datasets: [{
            data: [20, 53, 35, 100, 0],
            strokeWidth: 2, // optional
        }]
      };

    {/* Bar chart data */}
    const barData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        datasets: [{
            data: [20, 45, 28, 80,0],
          }],
      };

    {/* Table of unsolved problems */}
    const tableHead = ["Full name", "Links", "Problem"];
    const data = [
      ["John Smith", "N/A", "Accomodation does not include images"],
      ["Adam Turner", "N/A", "The price isn't specified for the accomodation"],
      ["Taylor Brown", "N/A", "No images for the accomodation"],
      ["James Evans", "N/A", "Cannot find a link to share the accomodation"],
      ["Robert Clarke", "N/A", "Landlord did not include contact details"],
    ];
    const widthArr = [100, 100, 250];

    {/* Data for the chats */}
    const messages = {
        "David Clark": ["Hi, could I get some help please?", "8:32pm"],
        "Michael Phillips": ["I forgot my username", "7:19pm"],
        "John Smith": ["Could you reset my password for me?", "Yesterday"],
    }

    const showSpecificChat = (key) => {
        {/* When the user clicks on a message preview it takes them to that specific chat */}
        setBackIconVisible(false);  {/* False here because I created a separate back button for this page */}
        setUserChatVisible(false);
        setSpecificChatVisible(true);

        setCurrentUser(key);  {/* The name of the person clicked on was passed to the function */}
    }

    const screenHeight = Dimensions.get("window").height;
    const [messageMargin, setMessageMargin] = useState(20);
    const addOffset = (amount) => {
        setOffset(amount);

        (amount == 60) ? setMessageMargin(210) : setMessageMargin(20);
    }

    const [reply, setReply] = useState();
    const [sentReply, setSentReply] = useState(false);
    const [replyList, setReplyList] = useState([]);

    const sendMessage = () => {
        (reply != null) ? replyList.push(reply) : null;
        setReplyList(replyList);
        setReply();
    }

    return (
        <SafeAreaView style={styles.safeContainer}>
            {/* SafeAreaView for iOS notch, StatusBar for android */}
            <StatusBar style="auto" barStyle="dark-content"/>
            <ScrollView > 
                {/* This moves the keyboard below the elements so it doesn't cover them */}
                
                {displayDashboardRow1 ? (
                    <Text style={styles.dashboardTitle}>Diagnostic Dashboard</Text>
                ) : null}
                
                {displayBackIcon ? (
                    <TouchableOpacity onPress={() => goBack()}> 
                        <Image source={require("../../assets/back.png")} style={styles.backImage} />
                    </TouchableOpacity>
                ) : null}


                {/* The first row with the graph image and contact image*/}
                {displayDashboardRow1 ? (
                    <View style={styles.dashboardContainer}>
                        <TouchableOpacity onPress={() => showGraph()}> 
                            <Image source={require("../../assets/graph-icon.png")} style={styles.graphImage} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => showDevForm()}> 
                            <Image source={require("../../assets/report-symbol.png")} style={styles.reportImage} />
                        </TouchableOpacity>
                </View>
                ) : null}
                

                {displayImageDesc1 ? (
                    <View style={styles.descContainer}>
                        <Text style={[styles.imageDesc, styles.issuesText]}>Issues reported</Text>
                        <Text style={[styles.imageDesc, styles.contactText]}>Contact developer</Text>
                    </View>
                ) : null}

                {/* The second row with the unsolved problems image and the chat image*/}
                {displayDashboardRow2 ? (
                    <View style={styles.dashboardContainer}>
                        <TouchableOpacity onPress={() => showProblemTable()}> 
                            <Image source={require("../../assets/problem.png")} style={styles.problemImage} />
                        </TouchableOpacity>
                   
                        <TouchableOpacity onPress={() => showUserChat()}> 
                            <Image source={require("../../assets/chat.png")} style={styles.chatImage}/>
                        </TouchableOpacity>
                    </View>
                ): null}
                

                {displayImageDesc2 ? (
                    <View style={styles.descContainer}>
                        <Text style={[styles.imageDesc, styles.problemsText]}>Unsolved problems</Text>
                        <Text style={[styles.imageDesc, styles.usersText]}>Chat with users</Text>
                    </View>
                ) : null}

                
                {displayGraph ? (
                    <View>
                        <Text style={styles.lineGraphTitle}> Issues reported by users </Text>
                        <LineChart
                            data={linedata}  width={Dimensions.get('window').width - 40}  height={220}  yAxisInterval={5}
                            style={{marginLeft: 20, borderRadius: 20}}
                            chartConfig={{
                                decimalPlaces: 0, // optional, defaults to 2dp
                                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                backgroundGradientFrom: "#007FFF",
                                backgroundGradientTo: "#2a52be"
                            }}
                        />

                        <Text style={[styles.lineGraphTitle, styles.barChartTitle]}> Issues solved </Text>
                        <BarChart
                            data={barData}  width={Dimensions.get('window').width - 40}  height={220}  yAxisInterval={5} fromZero
                            style={{marginLeft: 20, borderRadius: 20}}
                            chartConfig={{
                                decimalPlaces: 0,
                                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                backgroundGradientFrom: "#17B169",
                                backgroundGradientTo: "#018749",
                                barPercentage: 0.8
                            }}
                        />
                    </View>
                ) : null}

                {/* Display the form to contact developers when the report icon is clicked on */}
                {displayDevForm ? (
                    <View style={{margin: 20}}> 
                        <Text style={styles.lineGraphTitle}> Contact a developer </Text>

                        <TextInput style={styles.nameInput} value={name} onChangeText={setName} placeholder="Admin's Name" autoCorrect={false}/>
                        {errors.name ? (<Text style={styles.errorText}>{errors.name}</Text>) : null} 
                        {/* Display error text if they did not enter a name or problem */}

                        <TextInput style={[styles.nameInput, styles.problemInput]} placeholder="Problem" multiline autoCorrect={false} value={problem} onChangeText={setProblem} />
                        {errors.problem ? (<Text style={styles.errorText}>{errors.problem}</Text>) : null} 

                        <TouchableOpacity style={styles.submitButton} onPress={() => handleSubmit()}>
                            <Text style={styles.submitText}> Submit </Text>
                        </TouchableOpacity>
                    </View>
                ) : null}

                {/* Display the table for the unsolved problems reported */}
                {displayProblemTable ? (
                    <View style={styles.tableContainer}>
                        <Text style={styles.tableTitle}> Unsolved problems reported by users </Text>
                        <ScrollView horizontal={true}>
                            <View>
                                {/* 1 table for the header and 1 table for the rows */}
                                <Table borderStyle={{borderWidth: 2, borderColor: "#C1C0B9" }}>
                                    <Row data={tableHead} widthArr={widthArr} style={styles.tableHead} textStyle={{textAlign: "center", fontWeight: "bold"}}/>
                                </Table>

                                <ScrollView style={styles.dataWrapper}>
                                    <Table borderStyle={{borderWidth: 1, borderColor: "#C1C0B9" }}>
                                        {data.map((dataRow, index) => (
                                        <Row
                                            key={index} data={dataRow} widthArr={widthArr}
                                            style={[styles.row, index % 2 && { backgroundColor: "#ffffff" }]}
                                            textStyle={{textAlign: "center"}}
                                        />
                                        ))}
                                    </Table>
                                </ScrollView>
                            </View>
                        </ScrollView>
                    </View>
                ) : null}

                {/* Display the chat */}
                {displayUserChat ? (
                    <View> 
                        <View style={styles.chatHeaderBorder}>
                            {/* Added 3 parent views to create 3 equal spaces on the row to align items properly */}
                            <View style={styles.headerBox}> 
                                <TouchableOpacity onPress={() => goBack()}> 
                                    <Image source={require("../../assets/back.png")} style={{marginRight: 55,}} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.headerBox}>
                                <Text style={styles.chatTitle}> Chats </Text>
                            </View>

                            <View style={styles.headerBox}></View>
                        </View>

                        {/* Display a preview of every user and their message sent */}
                        {/* Creates an array containing the keys of the 'message' dictionary (the username) and displays the username and the message + time associated with it */}
                        {Object.keys(messages).map(key => 
                            <TouchableOpacity style={styles.msgRow} onPress={() => showSpecificChat(key)}>
                                <View style={styles.rowBox}>
                                    <Image style={styles.userImage} source={require("../../assets/user.png")} />
                                </View>
                                
                                <View style={[styles.rowBox, {flex: 1}]}>
                                    <Text style={styles.userName}>{key}</Text>
                                    {/* messages[key] returns the array associated with the username, index 0 contains the msg and 1 contains the time */}
                                    <Text style={styles.msgPreview}>{messages[key][0]}</Text>
                                </View>

                                <View style={styles.rowBox}>
                                    <Text style={styles.time}>{messages[key][1]}</Text>
                                </View>
                            </TouchableOpacity>
                             
                        )}
                    </View>
                ) : null}

                {displaySpecificChat ? (
                    <KeyboardAvoidingView keyboardVerticalOffset={offset} behavior="position" enabled>
                        <View style={styles.chatHeaderBorder}>
                            <TouchableOpacity style={styles.rowBox} onPress={() => goBack("specificChat")}> 
                                <Image source={require("../../assets/back.png")} style={{marginLeft: 15,}} />
                            </TouchableOpacity>

                            <View style={styles.rowBox}>
                                <Image style={styles.specificUserImage} source={require("../../assets/user.png")} />
                            </View>

                            <View style={[styles.rowBox]}>
                                <Text style={styles.specificUserName}> {currentUser} </Text>
                            </View>
                        </View>

   
                        <View style={{height: screenHeight - 200, backgroundColor: "lightgrey"}}> 
                            <Text style={[styles.specificMessage, {marginTop: messageMargin}]}>{messages[currentUser][0]}</Text>

                            {(replyList != []) ? (
                                replyList.map(msg => 
                                    <View style={{flexDirection: "row", justifyContent: "flex-end"}}>
                                        <Text style={[styles.specificMessage, {backgroundColor: "#007FFF", marginBottom: 10}]}>{msg}</Text>
                                    </View>
                                )
                            ) : null}
                                         
                            <View style={{flexDirection: "row", justifyContent: "flex-end"}}> 
                                <TextInput style={styles.enterMessage} value={reply} onChangeText={setReply} placeholder="Enter message" multiline autoCorrect={false}
                                    onFocus={() => addOffset(60)} onBlur={() => addOffset(0)}/>
                                    {/* Move the keyboard down by 60 when the Issue box is clicked on, and back to 0 when not clicked on */}
                                
                                <TouchableOpacity style={styles.send} onPress={() => sendMessage()}>
                                    <Text style={styles.sendText}> Send </Text>
                                </TouchableOpacity>
                            </View>
                            

                        </View>
                        
                    </KeyboardAvoidingView>
                ) : null}
                
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        marginTop: StatusBar.currentHeight,
    },
    dashboardTitle: {
        alignSelf: "center",
        fontWeight: "bold",
        fontSize: 20,
        marginTop: 10
    },
    nameInput: {
        height: 40,
        margin: 12,
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
    },
    problemInput: {
        minHeight: 150,
        textAlignVertical: "top",
    },
    dashboardContainer: {
        flexDirection: "row",
        marginTop: 20,
        marginBottom: 20,
        marginRight: 30,
    },
    reportImage: {
        height: 140,
        width: 130,
        marginLeft: 75,
        marginTop: 10,
    },
    graphImage: {
        marginLeft: 30,
        marginTop: 15,
    },
    problemImage: {
        marginTop: 40,
        marginLeft: 35,
        height: 125,
        width: 125,
    },
    chatImage: {
        height: 125,
        width: 125,
        marginLeft: 72,
        marginTop: 45
    },
    descContainer: {
        flexDirection: "row",
        justifyContent: "center",
    },
    imageDesc: {
        fontWeight: "bold",
        fontSize: 15,
        color: "#113f67"
    },
    issuesText: {
        marginRight: 20,
    },
    contactText: {
        marginLeft: 50,
    },
    problemsText:{
        marginRight: 70,
    },
    usersText: {
        marginRight: 15,
    },
    submitButton: {
        alignSelf: "center",
        borderWidth: 1,
        margin: 20,
        backgroundColor: "#7FCDCD",
        borderRadius: 10,
        height: 45,
        width: 100,
    },
    submitText: {
        fontSize: 25,
        marginLeft: 5,
        marginTop: 5
    },
    errorText: {
        color: "red",
        marginBottom: 10,
    },
    backImage: {
        marginLeft: 30,
        marginTop: 10,
    },
    lineGraphTitle:{
        alignSelf: "center",
        marginTop: 30,
        marginBottom: 18,
        fontWeight: "bold",
        fontSize: 20,
    },
    barChartTitle: {
        marginTop: 30,
    },
    problemContainer: {
        flex: 1,
        padding: 16,
        paddingTop: 30
    },
    tableContainer: {
        flex: 1,
        padding: 16,
        paddingTop: 30,
        backgroundColor: "#fff",
        marginTop: 50,
    },
    tableHead: {
        height: 40,
        backgroundColor: "#f1f8ff",
        fontWeight: "bold"
    },
    dataWrapper:{
        marginTop: -1
    },
    row: {
        height: 50
    },
    tableTitle: {
        fontWeight: "bold",
        fontSize: 18,
        textAlign: "center",
        marginBottom: 30,
    },
    chatHeaderBorder: {
        flexDirection: "row",
        borderWidth: 1,
        height: 70,
        backgroundColor: "lightblue",
        marginTop: "auto",
    },
    headerBox: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
    },
    chatTitle: {
        fontWeight: "bold",
        fontSize: 25,
    },
    msgRow: {
        flexDirection: "row",
        borderWidth: 1,
        height: 80,
    },
    rowBox: {
        justifyContent: "center",
        alignItems: "center",
    },
    userImage: {
        height: 50,
        width: 50,
        marginRight: 20,
        marginLeft: 10,
    },
    userName: {
        alignSelf: "flex-start",
        fontSize: 15,
        fontWeight: "bold"
    },
    msgPreview: {
        alignSelf: "flex-start",
        color: "grey",
        marginTop: 5
    },
    time: {
        alignSelf: "flex-end",
        marginRight: 20,
        paddingLeft: 30,
    },
    specificUserImage: {
        marginLeft: 40,
        height: 50,
        width: 50,
    },
    specificUserName: {
        marginLeft: 12,
        fontWeight: "bold",
        fontSize: 18
    },
    specificMessage: {
        borderWidth: 1,
        padding: 15,
        margin: 20,
        width: 200,
        borderRadius: 20,
        overflow: "hidden",
        marginBottom: "auto",
    },
    enterMessage: {
        borderWidth: 1,
        height: 70,
        padding: 10,
        fontSize: 17,
        flex: 1
    },
    send: {
        alignSelf: "center",
        borderWidth: 1,
        backgroundColor: "#7FCDCD",
        borderRadius: 10,
        height: 30,
        width: 60,
        position: "absolute",
        marginRight: 50
    },
    sendText: {
        fontSize: 20
    }
})
