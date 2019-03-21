---
date: 2019-03-19
title: "Understanding Hypothesis Testing - I"
template: post
thumbnail: "../thumbnails/hypothesis.png"
slug: "hypothesis-testing-1"
categories:
  - Probability
  - Theory
tags:
  - probability
  - data analytics
---

I don't know about you but for me understanding **hypothesis testing** had always been difficult. The certain concepts of hypothesis testing like p-value, alternative hypothesis always confused me. This is my try to make you all understand hypothesis testing in the most simplest manner.

### Prerequises

- Basic knowledge of Probability and concpts conditional probability.
- Knowledge of probability distributions like [Bernoulli](https://en.wikipedia.org/wiki/Bernoulli_distribution).

### Goals of this Series

- To get a better understanding of hypothesis testing.
- Understand the concept of **p-value**.
- Learn what does it mean to reject null Hypothesis
- Using [scikit learn](https://scikit-learn.org/stable/) to code basic hypothesis tests.

## Introduction

Hypothesis testing is a statistical tool used to determine whether there is enough evidence in sample data to infer that a certain condition is true about entire population. For example, you want to conduct a research about certain traits of **Golden State Warrior** fans. Something like are they as humble as [Stephen Curry](https://en.wikipedia.org/wiki/Stephen_Curry) ? In such case we take a sample of such fans and try to generalize our results on all the Golden State Warrior fans. The idea is whether these findings are sufficient to infer about all Golden State Warriors fans.

These testing methods are necessary to make decisions on the basis of limited information contained in the sample data. To arrive at a decision we often make assumptions about the nature of underlying population or situation. Such assertions may or may not be valid.

## Defining Hypotheses

Hypothesis testing can be formulated in terms of two hypotheses.

- $H_0$: Null hypothesis
- $H_a$: Alternative Hypothesis

A null hypothesis is a hypothesis where things are happening as expected i.e. there is **no difference**. To elaborate, back to our GSW example our null hypothesis would be that yes all GSW fan are as humble as Stephen Curry (**NO DIFFERENCE**).Trust me, remember this key word and you will never have problem understanding null hypothesis.

Alternative hypothesis on other hand is a claim where if you have evidence to back up that claim, that would be new news. You are saying hey there is something interesting going on here. **There is a differece**.

##Outcomes of Hypothesis Testing

There are two possible outcomes of hypothesis testing:

- Reject $H_0$ and accept $H_a$ because there is sufficient evidence in the sample that favor $H_a$
- Do not reject $H_0$ because of insufficient evidence to support $H_a$

Here comes a point where many people get confused. So please pay utter **attention**.

Many people have a misconception that by not rejecting $H_0$, we can say that $H_0$ is true. However this is not the case. We do not have any formal evidence to accept $H_0$. Our hypothesis testing basically yields a result that we do not have sufficient evidence to support $H_a$. This tells us that we can never say that null hypothesis is true using hypothesis testing. Crazy right! Let us better understand this from a very simple example.

Consider the following hypotheses:

- $H_0$: Defendant is innocent
- $H_a$: Defendant is guilty

In the above scenario if there is sufficient evidence to support that the defendant is guilty we can reject $H_0$. But if the evidence is not sufficient does not mean that defendant is innocent. It simply means we do not have enough evidence to reject it.

## Learning by example

To get a better perspective of hypothesis testing let us consider yet another example. A company manufacturing RAM chips claims that the defective rate of population is **5%**. Let **'P'** be the probability denoting true defective. Thus our hypotheses would be :

- $H_0$: $P = 0.05$
- $H_a$: $P \neq 0.05$

Now we randomly sample 100 chips from the production to test. Let **'X'** denote the number of defective chips in the sample. We arbitrarily say that if $X\geq 10$ then we reject $H_0$.
A question may arise in your mind that why did we choose 10 as our critical value. The reason behind this is that selecting a defective RAM chip is a bernoulli process. Thus the expected number of defective in sample would be $np = 5$. Thus 10 defectives would be a strong evidence that $P > 0.05$.

I would like to end this article here. In part 2 we shall talk more about types of hypotheses tests and how to use scikit learn to conduct such tests.
