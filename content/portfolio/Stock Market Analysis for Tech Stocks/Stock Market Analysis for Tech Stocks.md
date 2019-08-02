---
date: 2019-01-04
title: 'Stock Market Analysis for Tech Stocks'
template: portfolio
thumbnail: '../../thumbnails/stock.png'
slug: 'tech-stocks-analysis'
---

In this project, we'll analyse data from the stock market for some technology stocks.

Again, we'll use Pandas to extract and analyse the information, visualise it, and look at different ways to analyse the risk of a stock, based on its performance history.

Here are the questions we'll try to answer:

- What was the change in a stock's price over time?
- What was the daily return average of a stock?
- What was the moving average of various stocks?
- What was the correlation between daily returns of different stocks?
- How much value do we put at risk by investing in a particular stock?
- How can we attempt to predict future stock behaviour?


```python
#Python Data Analysis imports
import pandas as pd
from pandas import Series,DataFrame
import numpy as np

#Visualisation imports
import matplotlib.pyplot as plt
import seaborn as sns
sns.set_style('whitegrid')
%matplotlib inline

#To grab stock data
from pandas.io.data import DataReader
from datetime import datetime

#To handle floats in Python 2
from __future__ import division
```

    /Users/sajal/Library/Enthought/Canopy_64bit/User/lib/python2.7/site-packages/pandas/io/data.py:35: FutureWarning:
    The pandas.io.data module is moved to a separate package (pandas-datareader) and will be removed from pandas in a future version.
    After installing the pandas-datareader package (https://github.com/pydata/pandas-datareader), you can change the import ``from pandas.io import data, wb`` to ``from pandas_datareader import data, wb``.
      FutureWarning)


We're going to analyse some tech stocks, and it seems like a good idea to look at their performance over the last year. We can create a list with the stock names, for future looping.


```python
#We're going to analyse stock info for Apple, Google, Microsoft, and Amazon
tech_list = ['AAPL','GOOG','MSFT','AMZN','YHOO']
```


```python
#Setting the end date to today
end = datetime.now()

#Start date set to 1 year back
start = datetime(end.year-1,end.month,end.day)
```


```python
#Using Yahoo Finance to grab the stock data
for stock in tech_list:
    globals()[stock] = DataReader(stock,'yahoo',start,end) #The globals method sets the stock name to a global variable
```

Thanks to the globals method, Apple's stock data will be stored in the AAPL global variable dataframe. Let's see if that worked.


```python
AAPL.head()
```




<div>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Open</th>
      <th>High</th>
      <th>Low</th>
      <th>Close</th>
      <th>Volume</th>
      <th>Adj Close</th>
    </tr>
    <tr>
      <th>Date</th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>2015-09-23</th>
      <td>113.629997</td>
      <td>114.720001</td>
      <td>113.300003</td>
      <td>114.320000</td>
      <td>35756700</td>
      <td>111.926895</td>
    </tr>
    <tr>
      <th>2015-09-24</th>
      <td>113.250000</td>
      <td>115.500000</td>
      <td>112.370003</td>
      <td>115.000000</td>
      <td>50219500</td>
      <td>112.592660</td>
    </tr>
    <tr>
      <th>2015-09-25</th>
      <td>116.440002</td>
      <td>116.690002</td>
      <td>114.019997</td>
      <td>114.709999</td>
      <td>56151900</td>
      <td>112.308730</td>
    </tr>
    <tr>
      <th>2015-09-28</th>
      <td>113.849998</td>
      <td>114.570000</td>
      <td>112.440002</td>
      <td>112.440002</td>
      <td>52109000</td>
      <td>110.086252</td>
    </tr>
    <tr>
      <th>2015-09-29</th>
      <td>112.830002</td>
      <td>113.510002</td>
      <td>107.860001</td>
      <td>109.059998</td>
      <td>73365400</td>
      <td>106.777002</td>
    </tr>
  </tbody>
</table>
</div>




```python
#Basic stats for Apple's Stock
AAPL.describe()
```




<div>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Open</th>
      <th>High</th>
      <th>Low</th>
      <th>Close</th>
      <th>Volume</th>
      <th>Adj Close</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>count</th>
      <td>253.000000</td>
      <td>253.000000</td>
      <td>253.000000</td>
      <td>253.000000</td>
      <td>2.530000e+02</td>
      <td>253.000000</td>
    </tr>
    <tr>
      <th>mean</th>
      <td>104.824941</td>
      <td>105.777510</td>
      <td>103.881146</td>
      <td>104.858498</td>
      <td>4.179762e+07</td>
      <td>103.707287</td>
    </tr>
    <tr>
      <th>std</th>
      <td>8.073718</td>
      <td>8.110392</td>
      <td>8.019398</td>
      <td>8.075914</td>
      <td>1.749642e+07</td>
      <td>7.735402</td>
    </tr>
    <tr>
      <th>min</th>
      <td>90.000000</td>
      <td>91.669998</td>
      <td>89.470001</td>
      <td>90.339996</td>
      <td>1.304640e+07</td>
      <td>89.853242</td>
    </tr>
    <tr>
      <th>25%</th>
      <td>97.320000</td>
      <td>98.209999</td>
      <td>96.580002</td>
      <td>97.139999</td>
      <td>2.944520e+07</td>
      <td>96.348065</td>
    </tr>
    <tr>
      <th>50%</th>
      <td>105.519997</td>
      <td>106.309998</td>
      <td>104.879997</td>
      <td>105.790001</td>
      <td>3.695570e+07</td>
      <td>104.701886</td>
    </tr>
    <tr>
      <th>75%</th>
      <td>110.629997</td>
      <td>111.769997</td>
      <td>109.410004</td>
      <td>110.779999</td>
      <td>4.896780e+07</td>
      <td>109.220001</td>
    </tr>
    <tr>
      <th>max</th>
      <td>123.129997</td>
      <td>123.820000</td>
      <td>121.620003</td>
      <td>122.570000</td>
      <td>1.333697e+08</td>
      <td>120.004194</td>
    </tr>
  </tbody>
</table>
</div>



And that easily, we can make out what the stock's minimum, maximum, and average price was for the last year.


```python
#Some basic info about the dataframe
AAPL.info()
```

    <class 'pandas.core.frame.DataFrame'>
    DatetimeIndex: 253 entries, 2015-09-23 to 2016-09-22
    Data columns (total 6 columns):
    Open         253 non-null float64
    High         253 non-null float64
    Low          253 non-null float64
    Close        253 non-null float64
    Volume       253 non-null int64
    Adj Close    253 non-null float64
    dtypes: float64(5), int64(1)
    memory usage: 13.8 KB


No missing info in the dataframe above, so we can go about our business.

### What's the change in stock's price over time?


```python
#Plotting the stock's adjusted closing price using pandas
AAPL['Adj Close'].plot(legend=True,figsize=(12,5))
```




    <matplotlib.axes._subplots.AxesSubplot at 0x11463ef50>




![png](output_13_1.png)


Similarily, we can plot change in a stock's volume being traded, over time.


```python
#Plotting the total volume being traded over time
AAPL['Volume'].plot(legend=True,figsize=(12,5))
```




    <matplotlib.axes._subplots.AxesSubplot at 0x1148209d0>




![png](output_15_1.png)


### What was the moving average of various stocks?

Let's check out the moving average for stocks over a 10, 20 and 50 day period of time. We'll add that information to the stock's dataframe.


```python
ma_day = [10,20,50]

for ma in ma_day:
    column_name = "MA for %s days" %(str(ma))

    AAPL[column_name] = AAPL['Adj Close'].rolling(window=ma,center=False).mean()
```


```python
AAPL.tail()
```




<div>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Open</th>
      <th>High</th>
      <th>Low</th>
      <th>Close</th>
      <th>Volume</th>
      <th>Adj Close</th>
      <th>MA for 10 days</th>
      <th>MA for 20 days</th>
      <th>MA for 50 days</th>
    </tr>
    <tr>
      <th>Date</th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>2016-09-16</th>
      <td>115.120003</td>
      <td>116.129997</td>
      <td>114.040001</td>
      <td>114.919998</td>
      <td>79886900</td>
      <td>114.919998</td>
      <td>108.808999</td>
      <td>108.1500</td>
      <td>104.992706</td>
    </tr>
    <tr>
      <th>2016-09-19</th>
      <td>115.190002</td>
      <td>116.180000</td>
      <td>113.250000</td>
      <td>113.580002</td>
      <td>47023000</td>
      <td>113.580002</td>
      <td>109.393999</td>
      <td>108.3610</td>
      <td>105.341124</td>
    </tr>
    <tr>
      <th>2016-09-20</th>
      <td>113.050003</td>
      <td>114.120003</td>
      <td>112.510002</td>
      <td>113.570000</td>
      <td>34514300</td>
      <td>113.570000</td>
      <td>109.980999</td>
      <td>108.6140</td>
      <td>105.683375</td>
    </tr>
    <tr>
      <th>2016-09-21</th>
      <td>113.849998</td>
      <td>113.989998</td>
      <td>112.440002</td>
      <td>113.550003</td>
      <td>36003200</td>
      <td>113.550003</td>
      <td>110.499999</td>
      <td>108.8490</td>
      <td>106.016473</td>
    </tr>
    <tr>
      <th>2016-09-22</th>
      <td>114.349998</td>
      <td>114.940002</td>
      <td>114.000000</td>
      <td>114.620003</td>
      <td>31011700</td>
      <td>114.620003</td>
      <td>111.410000</td>
      <td>109.1785</td>
      <td>106.381911</td>
    </tr>
  </tbody>
</table>
</div>




```python
AAPL[['Adj Close','MA for 10 days','MA for 20 days','MA for 50 days']].plot(subplots=False,figsize=(12,5))
```




    <matplotlib.axes._subplots.AxesSubplot at 0x114a9c390>




![png](output_20_1.png)


Moving averages for more days have a smoother plot, as they're less reliable on daily fluctuations. So even though, Apple's stock has a slight dip near the start of September, it's generally been on an upward trend since mid-July.

### What was the daily return average of a stock?


```python
#The daily return column can be created by using the percentage change over the adjusted closing price
AAPL['Daily Return'] = AAPL['Adj Close'].pct_change()
```


```python
AAPL['Daily Return'].tail()
```




    Date
    2016-09-16   -0.005624
    2016-09-19   -0.011660
    2016-09-20   -0.000088
    2016-09-21   -0.000176
    2016-09-22    0.009423
    Name: Daily Return, dtype: float64




```python
#Plotting the daily return
AAPL['Daily Return'].plot(figsize=(14,5),legend=True,linestyle='--',marker='o')
```




    <matplotlib.axes._subplots.AxesSubplot at 0x1150ccd90>




![png](output_25_1.png)



```python
sns.distplot(AAPL['Daily Return'].dropna(),bins=100,color='red')
```




    <matplotlib.axes._subplots.AxesSubplot at 0x1163caad0>




![png](output_26_1.png)


Positive daily returns seem to be slightly more frequent than negative returns for Apple.

### What was the correlation between daily returns of different stocks?


```python
#Reading just the 'Adj Close' column this time
close_df = DataReader(tech_list,'yahoo',start,end)['Adj Close']
```


```python
close_df.tail()
```




<div>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>AAPL</th>
      <th>AMZN</th>
      <th>GOOG</th>
      <th>MSFT</th>
      <th>YHOO</th>
    </tr>
    <tr>
      <th>Date</th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>2016-09-16</th>
      <td>114.919998</td>
      <td>778.520020</td>
      <td>768.880005</td>
      <td>57.250000</td>
      <td>43.669998</td>
    </tr>
    <tr>
      <th>2016-09-19</th>
      <td>113.580002</td>
      <td>775.099976</td>
      <td>765.700012</td>
      <td>56.930000</td>
      <td>43.189999</td>
    </tr>
    <tr>
      <th>2016-09-20</th>
      <td>113.570000</td>
      <td>780.219971</td>
      <td>771.409973</td>
      <td>56.810001</td>
      <td>42.790001</td>
    </tr>
    <tr>
      <th>2016-09-21</th>
      <td>113.550003</td>
      <td>789.739990</td>
      <td>776.219971</td>
      <td>57.759998</td>
      <td>44.139999</td>
    </tr>
    <tr>
      <th>2016-09-22</th>
      <td>114.620003</td>
      <td>804.700012</td>
      <td>787.210022</td>
      <td>57.820000</td>
      <td>44.150002</td>
    </tr>
  </tbody>
</table>
</div>



Everything works as expected.

Just as we did earlier, we can use Pandas' pct_change method to get the daily returns of our stocks.


```python
rets_df = close_df.pct_change()
```


```python
rets_df.tail()
```




<div>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>AAPL</th>
      <th>AMZN</th>
      <th>GOOG</th>
      <th>MSFT</th>
      <th>YHOO</th>
    </tr>
    <tr>
      <th>Date</th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>2016-09-16</th>
      <td>-0.005624</td>
      <td>0.011472</td>
      <td>-0.003732</td>
      <td>0.001049</td>
      <td>-0.007274</td>
    </tr>
    <tr>
      <th>2016-09-19</th>
      <td>-0.011660</td>
      <td>-0.004393</td>
      <td>-0.004136</td>
      <td>-0.005590</td>
      <td>-0.010992</td>
    </tr>
    <tr>
      <th>2016-09-20</th>
      <td>-0.000088</td>
      <td>0.006606</td>
      <td>0.007457</td>
      <td>-0.002108</td>
      <td>-0.009261</td>
    </tr>
    <tr>
      <th>2016-09-21</th>
      <td>-0.000176</td>
      <td>0.012202</td>
      <td>0.006235</td>
      <td>0.016722</td>
      <td>0.031549</td>
    </tr>
    <tr>
      <th>2016-09-22</th>
      <td>0.009423</td>
      <td>0.018943</td>
      <td>0.014158</td>
      <td>0.001039</td>
      <td>0.000227</td>
    </tr>
  </tbody>
</table>
</div>



Let's try creating a scatterplot to visualise any correlations between different stocks. First we'll visualise a scatterplot for the relationship between the daily return of a stock to itself.


```python
sns.jointplot('GOOG','GOOG',rets_df,kind='scatter',color='green')
```




    <seaborn.axisgrid.JointGrid at 0x116d5b1d0>




![png](output_35_1.png)


As expected, the relationship is perfectly linear because we're trying to correlate something with itself. Now, let's check out the relationship between Google and Apple's daily returns.


```python
sns.jointplot('GOOG','AAPL',rets_df,kind='scatter')
```




    <seaborn.axisgrid.JointGrid at 0x11a321290>




![png](output_37_1.png)


There seems to be a minor correlation between the two stocks, looking at the figure above. The Pearson R Correlation Coefficient value of 0.45 echoes that sentiment.

But what about other combinations of stocks?


```python
sns.pairplot(rets_df.dropna())
```




    <seaborn.axisgrid.PairGrid at 0x11a9ba710>




![png](output_39_1.png)


Quick and dirty overarching visualisation of the scatterplots and histograms of daily returns of our stocks. To see the actual numbers for the correlation coefficients, we can use seaborn's corrplot method.


```python
sns.corrplot(rets_df.dropna(),annot=True)
```




    <matplotlib.axes._subplots.AxesSubplot at 0x127a07690>




![png](output_41_1.png)


Google and Microsoft seem to have the highest correlation. But another interesting thing to note is that all tech companies that we explored are positively correlated.

### How much value do we put at risk by investing in a particular stock?

A basic way to quantify risk is to compare the expected return (which can be the mean of the stock's daily returns) with the standard deviation of the daily returns.


```python
rets = rets_df.dropna()
```


```python
plt.figure(figsize=(8,5))

plt.scatter(rets.mean(),rets.std(),s=25)

plt.xlabel('Expected Return')
plt.ylabel('Risk')


#For adding annotatios in the scatterplot
for label,x,y in zip(rets.columns,rets.mean(),rets.std()):
    plt.annotate(
    label,
    xy=(x,y),xytext=(-120,20),
    textcoords = 'offset points', ha = 'right', va = 'bottom',
    arrowprops = dict(arrowstyle='->',connectionstyle = 'arc3,rad=-0.5'))


```


![png](output_46_0.png)


We'd want a stock to have a high expected return and a low risk; Google and Microsoft seem to be the safe options for that. Meanwhile, Yahoo and Amazon stocks have higher expected returns, but also have a higher risk

### Value at Risk

We can treat _Value at risk_ as the amount of money we could expect to lose for a given confidence interval. We'll use the 'Bootstrap' method and the 'Monte Carlo Method' to extract this value.

__Bootstrap Method__

Using this method, we calculate the empirical quantiles from a histogram of daily returns. The quantiles help us define our confidence interval.


```python
sns.distplot(AAPL['Daily Return'].dropna(),bins=100,color='purple')
```




    <matplotlib.axes._subplots.AxesSubplot at 0x11534fdd0>




![png](output_48_1.png)


To recap, our histogram for Apple's stock looked like the above. And our daily returns dataframe looked like:


```python
rets.head()
```




<div>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>AAPL</th>
      <th>AMZN</th>
      <th>GOOG</th>
      <th>MSFT</th>
      <th>YHOO</th>
    </tr>
    <tr>
      <th>Date</th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>2015-09-24</th>
      <td>0.005948</td>
      <td>-0.004328</td>
      <td>0.005527</td>
      <td>0.000912</td>
      <td>-0.013450</td>
    </tr>
    <tr>
      <th>2015-09-25</th>
      <td>-0.002522</td>
      <td>-0.017799</td>
      <td>-0.022100</td>
      <td>0.000683</td>
      <td>-0.007157</td>
    </tr>
    <tr>
      <th>2015-09-28</th>
      <td>-0.019789</td>
      <td>-0.038512</td>
      <td>-0.027910</td>
      <td>-0.014793</td>
      <td>-0.052523</td>
    </tr>
    <tr>
      <th>2015-09-29</th>
      <td>-0.030061</td>
      <td>-0.015851</td>
      <td>0.000134</td>
      <td>0.003465</td>
      <td>0.023913</td>
    </tr>
    <tr>
      <th>2015-09-30</th>
      <td>0.011370</td>
      <td>0.031891</td>
      <td>0.022606</td>
      <td>0.018877</td>
      <td>0.023001</td>
    </tr>
  </tbody>
</table>
</div>




```python
#Using Pandas built in qualtile method
rets['AAPL'].quantile(0.05)
```




    -0.025722813451247724



The 0.05 empirical quantile of daily returns is at -0.019. This means that with 95% confidence, the worst daily loss will not exceed 2.57% (of the investment).

### How can we attempt to predict future stock behaviour?

__Monte Carlo Method__

Check out this [link](http://www.investopedia.com/articles/07/montecarlo.asp) for more info on the Monte Carlo method. In short: in this method, we run simulations to predict the future many times, and aggregate the results in the end for some quantifiable value.



```python
days = 365

#delta t
dt = 1/365

mu = rets.mean()['GOOG']

sigma = rets.std()['GOOG']
```


```python
#Function takes in stock price, number of days to run, mean and standard deviation values
def stock_monte_carlo(start_price,days,mu,sigma):

    price = np.zeros(days)
    price[0] = start_price

    shock = np.zeros(days)
    drift = np.zeros(days)

    for x in xrange(1,days):

        #Shock and drift formulas taken from the Monte Carlo formula
        shock[x] = np.random.normal(loc=mu*dt,scale=sigma*np.sqrt(dt))

        drift[x] = mu * dt

        #New price = Old price + Old price*(shock+drift)
        price[x] = price[x-1] + (price[x-1] * (drift[x]+shock[x]))

    return price
```

We're going to run the simulation of Google stocks. Let's check out the opening value of the stock.


```python
GOOG.head()
```




<div>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Open</th>
      <th>High</th>
      <th>Low</th>
      <th>Close</th>
      <th>Volume</th>
      <th>Adj Close</th>
    </tr>
    <tr>
      <th>Date</th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>2015-09-23</th>
      <td>622.049988</td>
      <td>628.929993</td>
      <td>620.000000</td>
      <td>622.359985</td>
      <td>1470900</td>
      <td>622.359985</td>
    </tr>
    <tr>
      <th>2015-09-24</th>
      <td>616.640015</td>
      <td>627.320007</td>
      <td>612.400024</td>
      <td>625.799988</td>
      <td>2240100</td>
      <td>625.799988</td>
    </tr>
    <tr>
      <th>2015-09-25</th>
      <td>629.770020</td>
      <td>629.770020</td>
      <td>611.000000</td>
      <td>611.969971</td>
      <td>2174000</td>
      <td>611.969971</td>
    </tr>
    <tr>
      <th>2015-09-28</th>
      <td>610.340027</td>
      <td>614.604980</td>
      <td>589.380005</td>
      <td>594.890015</td>
      <td>3127700</td>
      <td>594.890015</td>
    </tr>
    <tr>
      <th>2015-09-29</th>
      <td>597.280029</td>
      <td>605.000000</td>
      <td>590.219971</td>
      <td>594.969971</td>
      <td>2309500</td>
      <td>594.969971</td>
    </tr>
  </tbody>
</table>
</div>



Let's do a simulation of 100 runs, and plot them.


```python
start_price = 622.049 #Taken from above

for run in xrange(100):
    plt.plot(stock_monte_carlo(start_price,days,mu,sigma))

plt.xlabel('Days')
plt.ylabel('Price')
plt.title('Monte Carlo Analysis for Google')
```




    <matplotlib.text.Text at 0x11b53ddd0>




![png](output_58_1.png)



```python
runs = 10000

simulations = np.zeros(runs)

for run in xrange(runs):
    simulations[run] = stock_monte_carlo(start_price,days,mu,sigma)[days-1]
```


```python
q = np.percentile(simulations,1)

plt.hist(simulations,bins=200)

plt.figtext(0.6,0.8,s="Start price: $%.2f" %start_price)

plt.figtext(0.6,0.7,"Mean final price: $%.2f" % simulations.mean())

plt.figtext(0.6,0.6,"VaR(0.99): $%.2f" % (start_price -q,))

plt.figtext(0.15,0.6, "q(0.99): $%.2f" % q)

plt.axvline(x=q, linewidth=4, color='r')

plt.title(u"Final price distribution for Google Stock after %s days" %days, weight='bold')
```




    <matplotlib.text.Text at 0x12a7e1cd0>




![png](output_60_1.png)


We can infer from this that, Google's stock is pretty stable. The starting price that we had was USD622.05, and the average final price over 10,000 runs was USD623.36.

The red line indicates the value of stock at risk at the desired confidence interval. For every stock, we'd be risking USD18.38, 99% of the time.
