# Federated Learning of a Mobile Keyboard Next-Word Prediction Model

**ACM Research, Fall 2021**

## Background
Federated learning is a decentralized training technique for machine learning models that relies on
participants' devices training small portions of the model. Doing such training at "the edge"
preserves users' privacy (since only model parameters are shared with a centralized entity), but
retaining the collective benefits of learned models to help predict user behavior.

## Purpose
In this project, participants will study the literature of federated learning as well as cover basic
machine learning concepts in the interest of producing a mobile keyboard next-word suggestion model
similar to that seen in the default iOS keyboard. Participants will first train the model on a
corpus of English-language text and then implement aggregation methods to update weights
accordingly. 

If time permits, multiple methods for aggregating weight updates will be considered, and mitigations
against data poisoning attacks will be implemented.

## Key Decisions
Key decisions that will need to be made throughout the course of the project include:

- Training data sourcing
- The trade-off between model size and ability to run gradient descent on a mobile device
- The value of *n* in an n-gram language model (consideration of additional context)
- Methods for aggregating weight updates

## Differentiation
Differentiators from previous efforts to produce a similar model include:
- Increasing *n* to provide more context (in comparison to the GBoard paper)
- Using a larger and more varied training dataset
- Using different aggregation methods (FedMA, FedPer)

## Contributors
- Will be updated soon
