---
date: 2020-04-04
title: "Introduction to Bash Scripting"
template: post
thumbnail: "../thumbnails/bash.png"
slug: introduction-to-bash-scripts
categories:
  - Programming

tags:
  - scripting
  - linux
---

Bash scripting is an extremely useful and powerful tool for a Software Engineer. At first sight it seems extremely scary, but trust me
it is not.

Bash is a type of interpreter that processes shell commands. A shell interpreter takes commands in plain text format and calls Operating
System service to do something. For example, `ls` command lists files and folders in a directory. Shell scripting is nothing but writing
a program for the shell to execute.

A shell script is a fully-fledged programming language in itself. It can define variables, functions, and we can do conditional execution
of shell commands as well. Knowing terminal can save you precious time. In addition, working inside a terminal makes you look like a geek 😂.

## Variables

Just like any other programming language, we can declare variables in a bash script. The only difference compared to other languages is that
we don't need to declare with `var` keyword or data type like `int`. To declare a variable and assign with a value, you just need to use
`VARIABLE_NAME=VALUE` expression.

```bash
PATH_HOME=/usr/local/bin
GRADLE_HOME=/usr/local/bin/gradle
GIT_ROOT=~/uditsamani.com/
GRADLE_VERSION=5.2
EMAIL='xyz@gmail.com'
```

> Note that `GIT_ROOT = /usr/uditsamani.com` with a space between the assignments is not valid - there must not be a space between the variable and value.

In the above example, we have declared a few variables with different data types. But bash does not have a type system, it can only have string
values. Hence internally all variables are stored as string.

To print a variable declared in the script, we need to put `$` as the prefix for the `VARIABLE_NAME` like `$VARIABLE_NAME`.

```bash
echo $PATH_HOME $GRADLE_HOME

=> /usr/local/bin /usr/local/bin/gradle
```

## Strings

A simple string in Bash does not require double quotes - you can write it directly.

```bash
echo Just a regular string
=> Just a regular string
```

A single or double quote expects a closing match, so in order to use such a string you would need to escape the quote.

```bash
echo I\'m a string
=> I'm a string.
```

If you want to use a single or double quote in a string without escaping characters, you can do
so by wrapping your string in quotes.

```bash
echo 'A single quoted "string"'
echo "A double quoted 'string'"
```

We can concatenate two variable by just placing them side by side. This is nothing but string interpolation.

```bash
FIRST_NAME=Udit
LAST_NAME=Samani

echo $FIRST_NAME$LAST_NAME

=> UditSamani

```

Even though Bash support single-quotes and double-quotes to define a string, only double quotes are capable of string interpolation.
If we tried string interpolation in single-quotes like `${SOME_NAME}` it will treat all the characters like normal characters and return
it as is.

```bash
SOME_NAME='Udit'
echo "Hello ${SOME_NAME}!;"
echo 'Hello ${SOME_NAME}!;'
=> Hello Udit!;
=> Hello ${SOME_NAME}!;
```

## Comparion Operators

Operators are slightly different in bash than any other language that you may have used.

In order to compare numbers, you use the operators in the number comparison column. For example, `-lt` for less than operation.

In order to compare strings, you use the operators in the string comparison column. For example, `<` for less than operation.

You can clearly see that compared to other programming languages this is really different.

| Number Comparison | String Comparison | Description            |
| ----------------- | ----------------- | ---------------------- |
| `-eq`             | `==`              | Equal                  |
| `-lt`             | `>`               | Less than              |
| `-gt`             | `<`               | Greater than           |
| `-ge`             | `<=`              | Greater than and equal |
| `-le`             | `>=`              | Less than and equal    |
| `-nq`             | `!=`              | Not Equal              |

## Conditions

`if` statements uses the `if`, `then`, `else`, and `fi` keywords. The condition goes in brackets.

```bash
#!/bin/bash

echo "Can you drink ?"

read age

if [$age -gt 20]
then
  echo 'You can drink.'
else
  echo 'You are too young to drink.'
fi
```

In `then` and `else` block, indentation is not necessary but it makes reading code easier. And type of
`if` block must end with `fi` to represent the end.

If you want to write both `if` and `then` block on the same line, you can use `;` in between them.

If you have multiple conditional expressions then you can use `&&` and `||` for AND and OR operations
respectively. We can also use parentheses to combine conditional expressions.

```bash
[5 -gt 3] && [6 -lt 5]
echo "Result 1: $?"

([ 5 -gt 3 ] && [ 6 -lt 5 ]) || ([ 3 -gt 1 ] && [ 6 -gt 5 ])
echo "Result 2: $?

=> Result 1: 1
=> Result 2: 0
```

## Loops

Bash supports `for` loops, `while` loops and `until` loops. The `for` loop syntax is really similar to
that of python based for loops.

### `for` Loops

The basic syntax of `for` loop is as follows

```bash
for iterator
do
    # Perform action per iteration
done
```

As shown in above example, `for`, `do`, and `done` are the required keywords. The `iterator` can be
different based on which flavor of for loop we are using.

Let us first look into `for:in` flavor which resembles python's for loop syntax.

```bash
for $VAR_NAME in Hello this is Udit Samani
```

In the above syntax, `for` is followed by `VAR_NAME` which contains items listed after `in` keyword. This
variable is accessible in `do` block.

```bash
for word in Hello this is Udit Samani; do
  echo "The word is : $WORD"
done

=> The word is : Hello
=> The word is : this
=> The word is : is
=> The word is : Udit
=> The word is : Samani
```

You may have notice the `;`. It is used as a statement separator.

If we pass a string variable to a command, bash breaks it into different words and pass them as a series
of arguments. This also applies in a `for:in` loop and very useful here.

```bash
FRUITS="Mango Apple Banana"

for fruit in $FRUITS; do
  echo "The fruit is: $fruit"
done

=> The fruit is: Mango
=> The furit is: Apple
=> The fruit is: Banana
```

If this is not the desired effect you want, use string interpolation

```bash
FRUITS="Mange Apple Banana"

for fruit in "$FRUITS"; do
  echo "The fruit is: Mango Apple Banana"
done
```

Another interesting fact is, we can drop `in` keyword and ignore to specify the list of items. This is
valid. In this case, bash will use arguments passed to the commands which run the script.

```bash
#file : variable.sh

for fruit; do
  echo "The fruit is: $FRUIT"
done

---------------
bash variable.sh Mango Apple Banana

=> The fruit is : Mango
=> The fruit is : Banana
=> The fruit is : Apple
```

Another good thing about `for:in` loop is, we can loop around any command output which returns a string
with possibly multiple words.

The more traditional flavor of the `for` loop is where we loop through certain number of times. We have
used this type of `for` loops in `C++` or `Java` or `JavaScript` languages. The syntax is similar like
`for(initialization; comparison; increment/decrement)` but without a variable declaration.

```bash
for (( i=n; i<N; n++ )); do
# Perform action per iteration
done
```

### The `while` loop

The `while` loop in bash is used to perform the same action as long as a condition is `true`. We use
`if` style conditional evaluator (using `[]`) to evaluate if a conditional expression is `true` or `false`.

```bash
while [# Condition expression]
do
  # Perform Action
done
```

`while`, `do` and `done` are mandatory keywords but we can put `while` and `do` keywords on the same
line using `;` statement separator. Let's consider a simple example of printing numbers while `n` is less
than `5`.

```bash
NUMBER=1

while [$NUMBER -lt 5]; do
  echo "Number is : $((NUMBER++))"
done
```

We can run `while` loop infinitely by using `while :` syntax instead of `while [conditional expression]`
syntax. But as infinitely running loop goes, we need to break out of the loop manually. You can use `true`
command to run a while loop infinitely.

### The `until` loop

The `until` loop is similar to while loop, but here `conditional expression` must evaluate to `true`
to terminate the loop.

```bash
NUMBER=1
until [ $NUMBER == 4 ]
do
    echo "Number is: $((NUMBER++))"
done

=> Number is: 1
=> Number is: 2
=> Number is: 3
```
