import { render, screen } from '@cedarjs/testing/web'

import SignupPage from './SignupPage'

describe('SignupPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<SignupPage />)
    }).not.toThrow()
  })

  it('displays email and password fields with submit button', () => {
    render(<SignupPage />)

    expect(screen.getByLabelText('Email address')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Sign up/i })).toBeInTheDocument()
  })

  it('focuses the email field on render', () => {
    render(<SignupPage />)
    expect(screen.getByLabelText('Email address')).toHaveFocus()
  })
})
