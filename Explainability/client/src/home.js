import React, { Component } from 'react';
import './home.css';


class Home extends Component {
    render() {
        return (
            <div className="home">
                <h2>Welcome to the Machine Learning Explorer!</h2>
                <p>
                    If this is your first time using the Machine Learning Explorer, you may have been sent 
                    here to look at a specific machine learning model. If so, click on the Models tab at the top to see a 
                    list of models and find the one you are looking for. There, you will be able to see how
                    each factor affects the decisions the model makes and explore what happens when you change
                    the weights of various factors. You can even force the model to give equal opportunity to 
                    certain groups. To learn more about equal opportunity, see
                    <a href="https://research.google.com/bigpicture/attacking-discrimination-in-ml/"> Google's explanation</a>.
                </p>
                <p>
                    To allow equal opportunity on a factor, it will first need to be marked as a 
                    binary variable, meaning that it can only be true or false. You can change this
                    by clicking the "..." next to each factor name.
                </p>
                <h3>For machine learning developers</h3>
                <p>
                    If you are a machine learning developer who wants to make a model more explainable
                    for your users, click on Datasets and upload your dataset. You can download an
                    existing dataset to see formatting. Once you have uploaded a dataset, you can go to
                    to Models page to add your new model. Currently, only logistic regression models are
                    supported.
                </p>
                <h2>About this project: MIMS Final Project 2018</h2>
                <p>The use of machine learning for public policy will very likely increase as the use of machine learning proliferates in various domains. When important elements of governance use software implementations, public policies should have accountability mechanisms, including explainability and contestability, to better earn the trust of the public. However, for the implementations that use machine learning, explainability and contestability are more challenging to implement. In this project, we will select the machine learning model that has the proper tradeoff between accuracy and explainability and conduct an experiment to test public acceptance of a possible design solution for increasing contestability in government machine learning models. In the course of conducting the experiment, we are going to develop user interfaces that will allow individuals or organizations to test contestable machine learning at their best.</p>
            </div>
        );
    }
}
export default Home;