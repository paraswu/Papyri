import React from 'react';
import '../styles/index.css';
import './Landing.css';
import '../components/UI/UI.css';
import { Container, Row, Col, Button, Form, FormGroup, Input, FormText } from 'reactstrap';
import { IoIosArrowBack } from "react-icons/io";
import * as docCookies from 'doc-cookies';

const loginURL = "http://127.0.0.1:8000/api/user/login/";
const userInfoURL = "http://127.0.0.1:8000/api/user/";

/**
 * Landing page for our web application
 */
class Landing extends React.Component {

    /**
     * 
     * Constructor for Landing component.
     * Sets state for login and register.
     * Renders different views based on login and register states.
     * @param {array} props properties that are passed into element when being used
     */
    constructor(props) {
        super(props);
        this.state = {
            loginClicked: false, 
            registerClicked: false,
            email: "",
            password: "",
            authorizationError: false,
            loginError: false,
            errorText: ""
        };
        this.handleLoginClick = this.handleLoginClick.bind(this);
        this.handleRegisterClick = this.handleRegisterClick.bind(this);
        this.handleRegisterInstructor = this.handleRegisterInstructor.bind(this);
        this.handleRegisterStudent = this.handleRegisterStudent.bind(this);
        this.handleBackClick = this.handleBackClick.bind(this);
        this.checkAuthorization = this.checkAuthorization.bind(this);
        this.getLoginScreen = this.getLoginScreen.bind(this);
        this.handleAuthorizationError = this.handleAuthorizationError.bind(this);
    }

    componentDidMount() {
        console.log("mounting");
    }

    componentWillUnmount() {
        console.log("unmounting");
    }

    /**
     * 
     * Makes http request to endpoint to authenticate login with email and password
     * @param {event} e event that triggered this onclick function
     */
    authenticateLogin(e) {
        e.preventDefault();
        console.log("attempted login");
        
            fetch(loginURL, {
                method: "POST",
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username:  this.state.email,
                    password: this.state.password
                }),
            })
                .then(res => {
                    console.log(res);
                    if (res.ok) {
                        return (res.json());
                    }
                    
                    throw Error(res.statusText);
                })
                .then(
                    (result) => {
                        docCookies.setItem('token', result.token);
                        this.checkAuthorization();
                    }
                )
                .catch (error => {
                    console.log("Error: ", error);
                    this.setState({
                        errorText: error.message,
                        loginError: true
                    })
                })
    }

    /**
     * Event handler for when user chooses to login
     * Changes component state
     */
    handleLoginClick() {
        console.log("login button clicked!");
        this.setState(state => ({
            loginClicked: true
        }));
    }

    /**
     * Event handler for when user chooses to register.
     * Changes component state.
     */
    handleRegisterClick() {
        this.setState(state => ({
            registerClicked: true
        }));
    }

    /**
     * Event handler for when user chooses to register as instructor.
     * Changes component state and redirects to instructor register form.
     */
    handleRegisterInstructor() {
        console.log("register instructor!");
        this.setState(state => ({
            registerClicked: true
        }));
        let path = '/register/instructor';
        this.props.history.push(path);
    }

    /**
     * Event handler for when user chooses to register as student.
     * Changes component state and redirects to student register form.
     */
    handleRegisterStudent() {
        console.log("register student!");
        this.setState(state => ({
            registerClicked: true
        }));
        let path = '/register/student';
        this.props.history.push(path);
    }

    /**
     * Event handler for when back button is clicked.
     * Changes component state and redirects to previous view
     */
    handleBackClick() {
        this.setState(state => ({
            loginClicked: false,
            registerClicked: false,
            loginError: false
        }))
    }

    handleChange(e) {
        this.setState({
            [ e.target.name ]: e.target.value,
        });
    }

    checkAuthorization() {
        console.log("checking whether authentication exists");
        var authenticationField = "Token " + docCookies.getItem('token');
        console.log(authenticationField);
        
        //try {
            fetch(userInfoURL, {
                method: "GET",
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'authorization':  authenticationField
                },
            })
                .then(res => {
                    console.log(res);
                    if (res.ok) {
                        return (res.json());
                    }
                    
                    throw Error(res.statusText);
                })
                .then(
                    (result) => {
                        console.log("status:");
                        console.log(result);
                        let userType = result.user_info.is_student;
                        localStorage.setItem('userID', result.user.id);
                        localStorage.setItem('firstName', result.user.first_name);
                        localStorage.setItem('lastName', result.user.last_name);
                        localStorage.setItem('isStudent', userType);
                        localStorage.setItem('uid', result.user_info.uid);

                        if (userType) {
                            localStorage.setItem('user', 'student');
                            this.props.history.push('student/dashboard');
                        }
                        else {
                            localStorage.setItem('user', 'instructor');
                            this.props.history.push('/instructor/dashboard');
                        }
                    }
                )
                .catch (error => {
                    console.log("Error: ", error);
                    docCookies.removeItem('token');
                    this.setState({
                        loginClicked: false, 
                        registerClicked: false,
                        email: "",
                        password: "",
                        authorizationError: false,
                        loginError: false,
                        errorText: ""
                    })
                })
        // } catch (error) {
        //     console.log("Error: ", error);
        //     this.setState({authorizationError: true})
        // }
    }

    getLoginScreen() {
        var display, backButton = null;

        if (this.state.loginError) {
            display = (
                <div>
                    <Form  onSubmit={ e => this.authenticateLogin(e) }>
                        <FormGroup>
                            <Input 
                                className="custom-input" 
                                type="email" 
                                name="email" 
                                id="exampleEmail" 
                                placeholder="Email"
                                value={this.state.email}
                                onChange={ (e) => this.handleChange(e) } />
                        </FormGroup>
                        <FormGroup>
                            <Input 
                                className="custom-input" 
                                type="password" 
                                name="password" 
                                id="examplePassword" 
                                placeholder="Password"
                                value={this.state.password}
                                onChange={ (e) => this.handleChange(e) } />
                            <FormText style={{color: 'red'}}>Login credentials incorrect!</FormText>
                        </FormGroup>
                        <FormGroup>
                            <Button className="yellow-button" size="lg" block type="submit">Login</Button>
                        </FormGroup>
                    </Form>
                </div>
            );
        }

        else if (!this.state.loginClicked && !this.state.registerClicked) {
            display = (
                <div>
                    <Row>
                        <Col><Button className="yellow-button" size="lg" block onClick={this.handleLoginClick}>Login</Button></Col>
                    </Row>
                    <Row>
                        <Col><Button className="white-button" size="lg" block onClick={this.handleRegisterClick}>Register</Button></Col>
                    </Row>
                </div>
            );
        }

        else if (this.state.loginClicked) {
            display = (
                <div>
                    <Form  onSubmit={ e => this.authenticateLogin(e) }>
                        <FormGroup>
                            <Input 
                                className="custom-input" 
                                type="email" 
                                name="email" 
                                id="exampleEmail" 
                                placeholder="Email"
                                value={this.state.email}
                                onChange={ (e) => this.handleChange(e) } />
                        </FormGroup>
                        <FormGroup>
                            <Input 
                                className="custom-input" 
                                type="password" 
                                name="password" 
                                id="examplePassword" 
                                placeholder="Password"
                                value={this.state.passsword}
                                onChange={ (e) => this.handleChange(e) } />
                        </FormGroup>
                        <FormGroup>
                            <Button className="yellow-button" size="lg" block type="submit">Login</Button>
                        </FormGroup>
                    </Form>
                </div>
            );
        }

        else if (this.state.registerClicked) {
            display = (
                <div>
                    <Row>
                        <Col><Button className="yellow-button" size="lg" block onClick={this.handleRegisterInstructor}>I am an Instructor</Button></Col>
                    </Row>
                    <Row>
                        <Col><Button className="white-button" size="lg" block onClick={this.handleRegisterStudent}>I am a Student</Button></Col>
                    </Row>
                </div>
            );
        }

        if (this.state.loginClicked || this.state.registerClicked) {
            backButton = (
                <Row>
                    <Col><Button className="link-button" color="link" onClick={this.handleBackClick}><IoIosArrowBack />Back</Button></Col>
                </Row>
            );
        }

        return (
            <Container className="narrow-container">
                <Row>
                    <Col><p className="papyri-heading">Papyri</p></Col>
                </Row>
                {display}
                {backButton}
            </Container>
        )
    }

    handleAuthorizationError() {
        this.setState({
            loginClicked: false, 
            registerClicked: false,
            email: "",
            password: "",
            authorizationError: false,
            loginError: false,
            errorText: ""
        })
    }
    
    render() {
        console.log("rendering");
        console.log(this.state);

        if (docCookies.hasItem('token')) {
            this.checkAuthorization();
            return (
                <div></div>
            )
        }
        else {
            return (this.getLoginScreen());
        }

    }
}

export default Landing;