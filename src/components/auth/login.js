import React, {Component} from 'react';
import {ScrollView, View} from 'react-native';

import Input from '../../utils/forms/input';
import Button from '../../utils/forms/button';
import ErrorPopup from '../../utils/forms/errorPopup';
import ValidationRules from '../../utils/forms/validationRules';


import {setTokens} from "../../utils/misc/misc";
import LinearGradient from "react-native-linear-gradient";
import Logo from "../../utils/misc/logo";




class Login extends Component {

    state = {
        hasErrors: false,
        form: {
            email: {
                value: '',
                valid: false,
                type: 'textInput',
                rules: {
                    isRequired: true,
                    isEmail: true
                }
            },
            password: {
                value: '',
                valid: false,
                type: 'textInput',
                rules: {
                    isRequired: true,
                    minLength: 8
                }
            }
        }
    };


    updateInput = (name, value) => {
        this.setState({
            hasErrors: false
        });

        let formCopy = this.state.form;
        formCopy[name].value = value;


        // rules
        let rules = formCopy[name].rules;
        let valid = ValidationRules(value, rules, formCopy);


        formCopy[name].valid = valid;

        this.setState({
            form: formCopy
        })
    };


    submitUser = () => {
        let isFormValid = true;
        let formToSubmit = {};
        const formCopy = this.state.form;

        for (let key in formCopy) {
            isFormValid = isFormValid && formCopy[key].valid;
            formToSubmit[key] = formCopy[key].value;
        }

        if (isFormValid) {
            this.props.screenProps.signIn(formToSubmit).then(() => {
                this.manageAccess()
            })
        } else {
            this.setState({hasErrors: true})
        }
    };


    manageAccess = () => {

        if (!this.props.screenProps.user.auth.uid) {
            this.setState({hasErrors: true})
        } else {
            setTokens(this.props.screenProps.user.auth, () => {
                this.setState({hasErrors: false});
                const user = this.props.screenProps.user;
                this.props.screenProps.getUserInfo(user.auth.uid).then(() => {
                    const userWithInfo = this.props.screenProps.user;
                    this.props.navigation.navigate('App',{user: userWithInfo});
                })
            })
        }
    };


    render() {
        return (
            <ScrollView contentContainerStyle={{
                flexGrow: 1,
                justifyContent: 'space-between'
            }}>
                <LinearGradient style={{flex: 1, padding: 50}} colors={['#0C3C35', '#5C7C78']}>

                    <View style={{alignItems: 'center', paddingBottom: 50}}>
                        <Logo style={{width: 112, height: 112,}}/>
                    </View>

                    <View>
                        <Input type={this.state.form.email.type}
                               placeholder={'Enter your email'}
                               value={this.state.form.email.value}
                               keyboardType={"email-address"}
                               onChangeText={value => this.updateInput("email", value)}/>

                        <Input type={this.state.form.password.type}
                               placeholder={'Enter your password'}
                               value={this.state.form.password.value}
                               onChangeText={value => this.updateInput("password", value)}
                               secureTextEntry={true}/>


                        <ErrorPopup hasErrors={this.state.hasErrors}/>

                        <Button type={'primary'}
                                onPress={this.submitUser}
                                text={'Login'}/>

                        <Button type={'secondary'}
                                onPress={() => this.props.navigation.navigate('Register')}
                                text={'I want to register'}/>

                        {/*<Button type={'secondary'}*/}
                        {/*        onPress={() => this.props.navigation.navigate('App')}*/}
                        {/*        text={"I'll do it later"}/>*/}
                    </View>

                </LinearGradient>
            </ScrollView>
        )
    }
}



export default Login;
