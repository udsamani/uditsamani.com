import React, { Component } from 'react'
import { Link } from 'gatsby'


export default class Contact extends Component {
  render() {
    return (
      <>
        <h1>Stay in Touch</h1>
        <p>You can also contact me via email or find me around the web.</p>
        <ul>
          <li>
            <strong>Email</strong>: <a href="mailto:udit@uditsamani.com">udit@uditsamani.com</a>
          </li>
          <li>
            <strong>GitHub</strong>:{' '}
            <a target="_blank" rel="noopener noreferrer" href="https://github.com/udsamani">
              udsamani
            </a>
          </li>
          <li>
            <strong>Twitter</strong>:{' '}
            <a target="_blank" rel="noopener noreferrer" href="https://twitter.com/uditpsamani">
              uditpsamani
            </a>
          </li>
        </ul>
      </>
    )
  }
}
