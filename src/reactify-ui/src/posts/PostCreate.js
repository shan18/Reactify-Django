import React, { Component } from 'react'
import 'whatwg-fetch'
import cookie from 'react-cookies'

class PostCreate extends Component {
  constructor (props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.state = {
      draft: false,
      title: null,
      content: null,
      publish: null
    }
  }

  createPost (data) {
    const endpoint = '/api/posts/'
    const csrfToken = cookie.load('csrftoken')

    if (csrfToken !== undefined) {
      let lookupOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken // specified in django documentation
        },
        body: JSON.stringify(data),
        credentials: 'include'
      }

      fetch(endpoint, lookupOptions)
        .then(function (response) {
          return response.json()
        }).then(function (responseData) {
          console.log(responseData)
        }).catch(function (error) {
          console.log('error', error)
          alert('An error occured. Please try again later.')
        })
    }
  }

  handleSubmit (event) {
    event.preventDefault()
    // console.log(this.state)
    let data = this.state
    if (data['draft'] === 'on') {
      data['draft'] = true
    } else {
      data['draft'] = false
    }
    console.log(data)
    this.createPost(data)
  }

  handleInputChange (event) {
    event.preventDefault()
    // console.log(event.target.name, event.target.value)

    // validate data
    let key = event.target.name
    let value = event.target.value
    if (key === 'title') {
      if (value.length > 15) {
        alert('This title is too long!')
      }
    }

    this.setState({
      // event.target.name gives the input type for which this function was called and since the name can be variable
      // we write it within []
      [key]: value
    })
  }

  componentDidMount () {
    this.setState({
      draft: false,
      title: null,
      content: null,
      publish: null
    })
  }

  render () {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className='form-group'>
          <label for='title'>Post title</label>
          <input
            type='text' id='title' name='title' className='form-control' placeholder='Blog post title' onChange={this.handleInputChange} required='required'
          />
        </div>
        <div className='form-group'>
          <label for='content'>Content</label>
          <textarea
            id='content' name='content' className='form-control' placeholder='Post content' onChange={this.handleInputChange} required='required'
          />
        </div>
        <div className='form-group'>
          <label for='draft'>
            <input type='checkbox' id='draft' name='draft' className='mr-2' onChange={this.handleInputChange} />
            Draft
          </label>
        </div>
        <div className='form-group'>
          <label for='publish'>Publish Date</label>
          <input type='date' id='publish' name='publish' className='form-control' onChange={this.handleInputChange} required='required' />
        </div>
        <button className='btn btn-primary'>Save</button>
      </form>
    )
  }
}

export default PostCreate
