import React from 'react';
import './home.css';


class Home extends React.Component {
    render() {
        return (
            <div className="home">
                <h1>Explainable Machine Learning for Public Policy</h1>
                <h2>MIMS Final Project 2018</h2>
                <p>The use of machine learning for public policy will very likely increase as the use of machine learning proliferates in various domains. When important elements of governance use software implementations, public policies should have accountability mechanisms, including explainability and contestability, to better earn the trust of the public. However, for the implementations that use machine learning, explainability and contestability are more challenging to implement. In this project, we will select the machine learning model that has the proper tradeoff between accuracy and explainability and conduct an experiment to test public acceptance of a possible design solution for increasing contestability in government machine learning models. In the course of conducting the experiment, we are going to develop user interfaces that will allow individuals or organizations to test contestable machine learning at their best.</p>
            </div>
        );
    }
}
export default Home;