import React, { Component } from 'react'
import udit from '../images/udit.jpg'

export default class UserInfo extends Component {
  render() {
    return (
      <aside className="note">
        <div className="container note-container">
          <div className="flex-author">
            <div className="flex-avatar">
              <img className="avatar" src={udit} alt="Tania Rascia" />
            </div>
            <div>
              <h3>Author</h3>
              <p>
                Hey, I’m Udit, a Software engineer. I write about what I know will help
                the upcoming generation of CS engineers. Life is about giving what you have.
              </p>
            </div>
          </div>
        </div>
      </aside>
    )
  }
}
